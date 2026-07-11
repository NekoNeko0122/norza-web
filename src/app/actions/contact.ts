"use server";

import nodemailer from "nodemailer";

const RECIPIENT = "colocadoandrewed@gmail.com";

export interface ContactFormInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormResult {
  success: boolean;
  error?: string;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendContactMessage(input: ContactFormInput): Promise<ContactFormResult> {
  const name = input.name?.trim();
  const email = input.email?.trim();
  const subject = input.subject?.trim();
  const message = input.message?.trim();

  if (!name || !email || !subject || !message) {
    return { success: false, error: "Please fill in every field." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "That email address doesn't look right." };
  }

  const user = process.env.CONTACT_EMAIL_USER;
  const pass = process.env.CONTACT_EMAIL_APP_PASSWORD;

  if (!user || !pass) {
    console.error("Missing CONTACT_EMAIL_USER / CONTACT_EMAIL_APP_PASSWORD env vars");
    return { success: false, error: "Messaging isn't configured yet. Please try again later." };
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });

    await transporter.sendMail({
      from: `"Discover Norzagaray" <${user}>`,
      to: RECIPIENT,
      replyTo: `"${name}" <${email}>`,
      subject: `[Norzagaray Inquiry] ${subject}`,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `
        <div style="font-family: sans-serif; line-height: 1.6;">
          <p><strong>From:</strong> ${escapeHtml(name)} (${escapeHtml(email)})</p>
          <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
          <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
        </div>
      `,
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to send contact email:", err);
    return { success: false, error: "Something went wrong sending your message. Please try again later." };
  }
}
