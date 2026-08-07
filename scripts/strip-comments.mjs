#!/usr/bin/env node
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs"
import { join, extname, basename, relative, resolve } from "node:path"

const ROOT = resolve(import.meta.dirname, "..")

const DEFAULT_TARGETS = ["apps", "packages"]

const SCRIPT_EXTS = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"])
const STYLE_EXTS = new Set([".css"])

const SKIP_DIRS = new Set([
  ".git",
  ".turbo",
  ".wrangler",
  "build",
  "dist",
  "drizzle",
  "node_modules",
  "out",
])

const SKIP_FILES = new Set(["worker-configuration.d.ts"])

const isGenerated = (file) => /\.gen\.[cm]?[jt]sx?$/.test(file)

const KEEP = [
  /^!/,
  /^\/+\s*<reference/,
  /^\s*eslint[- ]/,
  /^\s*globals?\s/,
  /^\s*@ts-/,
  /^\s*@type\b/,
  /^\s*@license\b/,
  /^\s*@preserve\b/,
  /^\s*@jsx\b/,
  /^\s*@vite-ignore\b/,
  /^\s*webpack[A-Za-z]/,
  /^\s*prettier-ignore/,
  /^\s*(#|@)__(PURE|NO_SIDE_EFFECTS)__/,
  /^\s*(c8|v8|istanbul|noinspection)\b/,
]

const isDirective = (body) => KEEP.some((pattern) => pattern.test(body))

const REGEX_PRECEDERS = new Set(
  "(,=:[!&|?{};+-*%~^<>".split("").concat(["", "\n"]),
)

const REGEX_KEYWORDS = new Set([
  "await",
  "case",
  "delete",
  "do",
  "else",
  "in",
  "instanceof",
  "new",
  "of",
  "return",
  "throw",
  "typeof",
  "void",
  "yield",
])

const isWordChar = (char) => /[$\w]/.test(char)

// Comment ranges in a script, found by walking the source once and stepping
// over strings, template literals and regex literals on the way. Two things
// keep the walk honest without a real parser: a quoted run that reaches a line
// break is treated as an apostrophe in JSX prose rather than a string, and a
// slash only opens a regex where an expression could start.
function scriptComments(src) {
  const found = []
  const stack = [{ template: false, depth: 0 }]
  let last = ""
  let word = ""
  let i = 0

  while (i < src.length) {
    const top = stack[stack.length - 1]
    const char = src[i]
    const next = src[i + 1]

    if (top.template) {
      if (char === "\\") {
        i += 2
      } else if (char === "`") {
        stack.pop()
        i += 1
      } else if (char === "$" && next === "{") {
        stack.push({ template: false, depth: 0 })
        i += 2
      } else {
        i += 1
      }
      continue
    }

    if (char === "/" && next === "/") {
      let end = src.indexOf("\n", i)
      if (end === -1) end = src.length
      found.push({ start: i, end, body: src.slice(i + 2, end) })
      i = end
      continue
    }

    if (char === "/" && next === "*") {
      const close = src.indexOf("*/", i + 2)
      const end = close === -1 ? src.length : close + 2
      found.push({ start: i, end, body: src.slice(i + 2, end - 2) })
      i = end
      continue
    }

    if (char === '"' || char === "'") {
      let j = i + 1
      let closed = false
      while (j < src.length) {
        if (src[j] === "\\") {
          j += 2
          continue
        }
        if (src[j] === "\n") break
        if (src[j] === char) {
          closed = true
          break
        }
        j += 1
      }
      // Unterminated on its own line: JSX text, not a string.
      i = closed ? j + 1 : i + 1
      if (closed) {
        last = char
        word = ""
      }
      continue
    }

    if (char === "`") {
      stack.push({ template: true, depth: 0 })
      i += 1
      continue
    }

    if (char === "/") {
      const opensRegex = word
        ? REGEX_KEYWORDS.has(word)
        : REGEX_PRECEDERS.has(last)
      if (opensRegex) {
        let j = i + 1
        let inClass = false
        while (j < src.length) {
          const c = src[j]
          if (c === "\\") {
            j += 2
            continue
          }
          if (c === "\n") break
          if (c === "[") inClass = true
          else if (c === "]") inClass = false
          else if (c === "/" && !inClass) {
            j += 1
            break
          }
          j += 1
        }
        while (j < src.length && /[a-z]/.test(src[j])) j += 1
        i = j
        last = "/"
        word = ""
        continue
      }
    }

    if (char === "{") {
      top.depth += 1
    } else if (char === "}") {
      if (top.depth === 0 && stack.length > 1) {
        stack.pop()
        i += 1
        last = "}"
        word = ""
        continue
      }
      top.depth -= 1
    }

    if (!/\s/.test(char)) {
      last = char
      word = isWordChar(char) ? word + char : ""
    } else if (char === "\n") {
      last = last || "\n"
    }
    i += 1
  }

  return found
}

// Stylesheets only have block comments, and only strings can hide one.
function styleComments(src) {
  const found = []
  let i = 0

  while (i < src.length) {
    const char = src[i]

    if (char === "/" && src[i + 1] === "*") {
      const close = src.indexOf("*/", i + 2)
      const end = close === -1 ? src.length : close + 2
      found.push({ start: i, end, body: src.slice(i + 2, end - 2) })
      i = end
      continue
    }

    if (char === '"' || char === "'") {
      let j = i + 1
      while (j < src.length && src[j] !== char) {
        j += src[j] === "\\" ? 2 : 1
      }
      i = j + 1
      continue
    }

    i += 1
  }

  return found
}

// `{/* … */}` holds nothing once the comment goes, so the braces go with it.
// Only where the brace opens JSX children, never an object or a function body.
function widenJsxBraces(src, range) {
  let open = range.start - 1
  while (open >= 0 && /\s/.test(src[open])) open -= 1
  if (src[open] !== "{") return range

  let close = range.end
  while (close < src.length && /\s/.test(src[close])) close += 1
  if (src[close] !== "}") return range

  let before = open - 1
  while (before >= 0 && /\s/.test(src[before])) before -= 1
  const opensChildren = src[before] === ">" && src[before - 1] !== "="
  if (!opensChildren) return range

  return { ...range, start: open, end: close + 1 }
}

function strip(src, ext) {
  const style = STYLE_EXTS.has(ext)
  const ranges = (style ? styleComments(src) : scriptComments(src))
    .filter((range) => !isDirective(range.body))
    .map((range) => (style ? range : widenJsxBraces(src, range)))

  if (ranges.length === 0) return null

  // Each comment leaves a mark, so the pass that rebuilds the lines can tell a
  // line the comment had to itself (dropped whole) from a trailing one (the
  // code stays, the space it left does not). Prettier tidies the blank runs.
  const MARK = "\u0000"
  const pieces = []
  let cursor = 0
  for (const range of ranges) {
    pieces.push(src.slice(cursor, range.start))
    cursor = range.end
  }
  pieces.push(src.slice(cursor))

  const out = []
  for (const line of pieces.join(MARK).split("\n")) {
    if (!line.includes(MARK)) {
      out.push(line)
      continue
    }
    const bare = line.split(MARK).join("")
    if (bare.trim() !== "") out.push(bare.trimEnd())
  }
  while (out.length > 1 && out[0] === "") out.shift()

  return { text: out.join("\n").replace(/\n*$/, "\n"), count: ranges.length }
}

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue
      yield* walk(join(dir, entry.name))
    } else if (entry.isFile()) {
      yield join(dir, entry.name)
    }
  }
}

function* targets(paths, base) {
  for (const path of paths) {
    const full = resolve(base, path)
    if (statSync(full).isDirectory()) yield* walk(full)
    else yield full
  }
}

const args = process.argv.slice(2)
const check = args.includes("--check")
const paths = args.filter((arg) => !arg.startsWith("-"))

let comments = 0
const touched = []

const given = paths.length > 0
for (const file of targets(
  given ? paths : DEFAULT_TARGETS,
  given ? process.cwd() : ROOT,
)) {
  const ext = extname(file)
  if (!SCRIPT_EXTS.has(ext) && !STYLE_EXTS.has(ext)) continue
  if (SKIP_FILES.has(basename(file)) || isGenerated(basename(file))) continue

  const src = readFileSync(file, "utf8")
  const result = strip(src, ext)
  if (!result || result.text === src) continue

  comments += result.count
  touched.push(relative(ROOT, file))
  if (!check) writeFileSync(file, result.text)
}

if (touched.length === 0) {
  console.log("No comments to strip.")
  process.exit(0)
}

for (const file of touched) console.log(`${check ? "has" : "stripped"} ${file}`)
console.log(
  `${comments} comment${comments === 1 ? "" : "s"} in ${touched.length} file${
    touched.length === 1 ? "" : "s"
  }`,
)
process.exit(check ? 1 : 0)
