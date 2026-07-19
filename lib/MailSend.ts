"use server";

import nodemailer from "nodemailer";

function htmlToPlainText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/tr>/gi, "\n")
    .replace(/<\/td>/gi, "  ")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

async function sendViaSendGrid(data: any, plainText: string) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) return null;

  const mailUser =
    process.env.MAIL_USER || process.env.NEXT_PUBLIC_USER || "";
  const displayName = process.env.MAIL_FROM_NAME || "CricVista";
  const to = Array.isArray(data.to) ? data.to.join(", ") : data.to;

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: to }], subject: data.subject }],
      from: { email: mailUser, name: displayName },
      reply_to: { email: mailUser },
      content: [
        { type: "text/plain", value: plainText },
        { type: "text/html", value: data.html },
      ],
      tracking_settings: {
        click_tracking: { enable: false },
        open_tracking: { enable: false },
      },
    }),
  });

  if (!response.ok) {
    console.error(
      `[MailSend] SendGrid error ${response.status}:`,
      await response.text(),
    );
    return null;
  }
  return response;
}

async function sendViaSmtp(data: any, plainText: string) {
  const mailUser =
    process.env.MAIL_USER || process.env.NEXT_PUBLIC_USER;
  const mailPass =
    process.env.MAIL_PASSWORD || process.env.NEXT_PUBLIC_PASSWORD;
  const displayName = process.env.MAIL_FROM_NAME || "CricVista";

  if (!mailUser || !mailPass) {
    console.error(
      "[MailSend] Missing SMTP credentials. Set MAIL_USER and MAIL_PASSWORD env vars.",
    );
    return null;
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user: mailUser, pass: mailPass },
  });

  return transporter.sendMail({
    from: `"${displayName}" <${mailUser}>`,
    replyTo: mailUser,
    to: Array.isArray(data.to) ? data.to.join(", ") : data.to,
    subject: data.subject,
    text: plainText,
    html: data.html,
    headers: {
      "List-Unsubscribe": `<mailto:${mailUser}?subject=unsubscribe>`,
      "Precedence": "bulk",
      "X-Mailer": "CricVista Mailer v2.0",
      "X-Priority": "3",
      "Feedback-ID": "auth:cricvista:transactional",
    },
  });
}

export const MailSend = async (data: any) => {
  try {
    const plainText = data.text || (data.html ? htmlToPlainText(data.html) : "");

  let result: any = await sendViaSendGrid(data, plainText);
  if (result) return result;

  result = await sendViaSmtp(data, plainText);
  return result;
  } catch (error) {
    console.error("[MailSend] Failed to send email:", error);
    return null;
  }
};
