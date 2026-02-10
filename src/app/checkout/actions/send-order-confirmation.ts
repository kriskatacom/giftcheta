"use server";

import {
    generateOrderConfirmationHtml,
    OrderConfirmationData,
} from "@/app/api/lib/emails/generate-order-confirmation-html";

export async function sendOrderConfirmation(order: OrderConfirmationData) {
    // Можеш да добавиш тук: изпращане на имейл или запис в база
    const html = generateOrderConfirmationHtml(order);

    // TODO: тук можеш да извикаш nodemailer / resend / sendgrid
    // await emailService.send({
    //   to: order.email,
    //   subject: "Потвърждение на поръчка",
    //   html,
    //   attachments: [{ path: filePath, filename: "order-confirmation.html" }]
    // });

    return { success: true, html };
}
