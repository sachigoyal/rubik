const BRAND = "Rubik"
const ACCENT = "#1313BA"

type Mail = {
  to: string
  subject: string
  heading: string
  body: string
  action: string
  url: string
}

function render({ heading, body, action, url }: Omit<Mail, "to" | "subject">) {
  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:32px 16px;background:#f6f6f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#111827">
    <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:440px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:8px">
      <tr>
        <td style="padding:32px">
          <p style="margin:0 0 24px;font-size:14px;font-weight:600;color:${ACCENT}">${BRAND}</p>
          <h1 style="margin:0 0 12px;font-size:20px;font-weight:600;letter-spacing:-0.02em">${heading}</h1>
          <p style="margin:0 0 24px;font-size:14px;line-height:1.6;color:#4b5563">${body}</p>
          <a href="${url}" style="display:inline-block;padding:11px 18px;background:${ACCENT};color:#ffffff;font-size:14px;font-weight:500;text-decoration:none;border-radius:6px">${action}</a>
          <p style="margin:24px 0 0;font-size:12px;line-height:1.6;color:#6b7280">Or paste this link into your browser:<br /><a href="${url}" style="color:${ACCENT};word-break:break-all">${url}</a></p>
        </td>
      </tr>
    </table>
  </body>
</html>`

  const text = `${heading}\n\n${body}\n\n${action}: ${url}\n`

  return { html, text }
}

async function send(env: Env, mail: Mail) {
  const { html, text } = render(mail)
  try {
    await env.EMAIL.send({
      to: mail.to,
      from: { email: env.EMAIL_FROM, name: BRAND },
      subject: mail.subject,
      html,
      text,
    })
  } catch (error) {
    const code = (error as { code?: string }).code ?? "UNKNOWN"
    throw new Error(`Email send failed (${code}): ${(error as Error).message}`)
  }
}

export function sendVerificationEmail(env: Env, to: string, url: string) {
  return send(env, {
    to,
    url,
    subject: `Verify your ${BRAND} email`,
    heading: "Verify your email",
    body: "Confirm this address to finish setting up your account. The link expires in an hour.",
    action: "Verify email",
  })
}

export function sendPasswordResetEmail(env: Env, to: string, url: string) {
  return send(env, {
    to,
    url,
    subject: `Reset your ${BRAND} password`,
    heading: "Reset your password",
    body: "Choose a new password. The link expires in an hour. Ignore this email if you did not ask for it.",
    action: "Reset password",
  })
}
