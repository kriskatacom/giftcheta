import nodemailer from "nodemailer";
import { websiteName } from "../utils";
import { DOMAIN_NAME } from "../constants";

export interface EmailAttachment {
    filename: string;
    content: Buffer | string;
    contentType: string;
}

export interface EmailOptions {
    to: string;
    subject: string;
    text: string;
    attachments?: EmailAttachment[];
}

export async function sendEmail(options: EmailOptions) {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const attachments = options.attachments?.map((att) => ({
        ...att,
        content: Buffer.isBuffer(att.content)
            ? att.content
            : Buffer.from(att.content),
    }));

    await transporter.sendMail({
        from: `${websiteName()} <${process.env.EMAIL_ACCOUNT_NAME}>`,
        to: options.to,
        subject: options.subject,
        html: options.text,
        attachments,
    });

    console.log(`Имейл изпратен до ${options.to}`);
}
