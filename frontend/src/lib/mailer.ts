import nodemailer from "nodemailer";

type MailPayload = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

type MailerContext = {
  transporter: nodemailer.Transporter;
  from: string;
  mock: boolean;
};

let cachedMailer: MailerContext | null = null;

const PLACEHOLDER_HOSTS = new Set(["smtp.example.com", ""]);

function ensure(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing required env var "${name}" for mailer setup.`);
  }
  return value;
}

function createMailerContext(): MailerContext {
  if (cachedMailer) {
    return cachedMailer;
  }

  const isDev = process.env.NODE_ENV !== "production";
  const host = process.env.SMTP_HOST ?? "";
  const isPlaceholderHost = PLACEHOLDER_HOSTS.has(host.trim().toLowerCase());

  if (isDev && isPlaceholderHost) {
    cachedMailer = {
      transporter: nodemailer.createTransport({ jsonTransport: true }),
      from: process.env.SMTP_FROM ?? "Furrever <no-reply@furrever.com>",
      mock: true,
    };

    return cachedMailer;
  }

  const resolvedHost = ensure(process.env.SMTP_HOST, "SMTP_HOST");
  const port = Number(process.env.SMTP_PORT || "587");
  const user = ensure(process.env.SMTP_USER, "SMTP_USER");
  const pass = ensure(process.env.SMTP_PASS, "SMTP_PASS");
  const from = ensure(process.env.SMTP_FROM, "SMTP_FROM");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  cachedMailer = {
    transporter: nodemailer.createTransport({
      host: resolvedHost,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    }),
    from,
    mock: false,
  };

  return cachedMailer;
}

export async function sendTemplatedEmail(payload: MailPayload) {
  const { transporter, from, mock } = createMailerContext();

  try {
    const info = await transporter.sendMail({
      ...payload,
      from,
      text: payload.text ?? payload.html.replace(/<[^>]+>/g, ""),
    });

    if (mock) {
      const msg = typeof info?.message === "string" ? info.message : JSON.stringify(info ?? {}, null, 2);
      const urlMatch = msg.match(/https?:\/\/[^\s"<>]+verify-email[^\s"<>]*/i)
        || msg.match(/https?:\/\/[^\s"<>]*\?[^\s"<>]*token=[^\s"<>]+/);
      console.info("\n---------- [mailer] Development mock email ----------");
      if (urlMatch) {
        console.info("VERIFICATION LINK (copy and open in browser):\n", urlMatch[0]);
      }
      console.info("Full payload:", msg);
      console.info("------------------------------------------------------\n");
    }
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        "[mailer] Failed to send email in development mode.",
        error,
      );
      return;
    }

    throw error;
  }
}
