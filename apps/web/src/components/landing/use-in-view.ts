import { useEffect, useRef, useState } from "react"

export function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [shown, setShown] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )

  useEffect(() => {
    const node = ref.current
    if (!node || shown) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShown(true)
      },
      { rootMargin: "0px 0px -12% 0px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [shown])

  return { ref, shown }
}
