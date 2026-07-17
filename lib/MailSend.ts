"use server";

import nodemailer from "nodemailer";

/**
 * Strips HTML tags to generate a plain-text fallback for better deliverability.
 * Spam filters penalise HTML-only emails.
 */
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

export const MailSend = async (data: any) => {
  try {
    const mailUser =
      process.env.MAIL_USER || process.env.NEXT_PUBLIC_USER;
    const mailPass =
      process.env.MAIL_PASSWORD || process.env.NEXT_PUBLIC_PASSWORD;
    const displayName = process.env.MAIL_FROM_NAME || "CricVista";

    if (!mailUser || !mailPass) {
      console.error(
        "[MailSend] Missing email credentials. Set MAIL_USER and MAIL_PASSWORD env vars on Render."
      );
      return null;
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: mailUser,
        pass: mailPass,
      },
    });

    // Plain-text fallback — critical for spam filters
    const plainText = data.text || (data.html ? htmlToPlainText(data.html) : "");

    const send = await transporter.sendMail({
      // ✅ Proper display name prevents "no-reply@gmail" look
      from: `"${displayName}" <${mailUser}>`,
      replyTo: mailUser,
      to: Array.isArray(data.to) ? data.to.join(", ") : data.to,
      subject: data.subject,
      // ✅ Both text + html: spam filters heavily favour multi-part emails
      text: plainText,
      html: data.html,
      headers: {
        // ✅ List-Unsubscribe: required by Gmail/Yahoo bulk sender guidelines
        "List-Unsubscribe": `<mailto:${mailUser}?subject=unsubscribe>`,
        // ✅ Precedence header tells filters this is automated, not spam
        "Precedence": "bulk",
        // ✅ X-Mailer helps identify legitimate mailer
        "X-Mailer": "CricVista Mailer v1.0",
      },
    });

    return send;
  } catch (error) {
    console.error("[MailSend] Failed to send email:", error);
    return null;
  }
};
