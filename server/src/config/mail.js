import nodemailer from "nodemailer";

const PLACEHOLDER_USER = /^(your[_-]?email|example@|test@)/i;
const PLACEHOLDER_PASS = /^(your[_-]?(email[_-]?)?pass(word)?|password|changeme)/i;

export function getMailCredentials() {
  const user = process.env.MAIL_USER?.trim().replace(/\r$/, "");
  const pass = process.env.MAIL_PASS?.trim().replace(/\s+/g, "").replace(/\r$/, "");
  return { user, pass };
}

export function isMailConfigured() {
  const { user, pass } = getMailCredentials();
  if (!user || !pass) return false;
  if (PLACEHOLDER_USER.test(user) || PLACEHOLDER_PASS.test(pass)) return false;
  if (!user.includes("@")) return false;
  if (pass.length < 16) return false;
  return true;
}

export function createMailTransporter() {
  const { user, pass } = getMailCredentials();

  if (!isMailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.MAIL_HOST?.trim() || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: process.env.MAIL_SECURE === "true",
    requireTLS: true,
    auth: { user, pass },
  });
}

export async function verifyMailTransporter(transporter) {
  if (!transporter) {
    const { user, pass } = getMailCredentials();
    if (user && pass && !isMailConfigured()) {
      throw new Error(
        "MAIL_USER / MAIL_PASS in server/.env look like placeholders. Save your real Gmail address and 16-character App Password, then restart the server."
      );
    }
    throw new Error(
      "Email service not configured. Set MAIL_USER and MAIL_PASS in server/.env"
    );
  }

  await transporter.verify();
}

export function getFrontendBaseUrl() {
  return (
    process.env.FRONTEND_URL ||
    process.env.CLIENT_URL ||
    "http://localhost:5173"
  );
}

export function logMailStartupStatus() {
  const { user } = getMailCredentials();
  if (isMailConfigured()) {
    const masked = user.replace(/(^.).+(@.+$)/, "$1***$2");
    console.log(`[Mail] SMTP ready for ${masked}`);
  } else {
    console.warn(
      "[Mail] Not configured — update server/.env with MAIL_USER (Gmail) and MAIL_PASS (App Password), then restart."
    );
  }
}
