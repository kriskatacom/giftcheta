"use server";

import fs from "fs";

import { CheckoutFormData } from "@/app/checkout/checkout-schema";
import { CartItem } from "@/stores/cart-store";
import { getDb } from "@/lib/db";
import {
    Order,
    OrderService,
    OrderStatusEnum,
    PaymentStatusEnum,
} from "@/lib/services/order-service";
import {
    generateOrderConfirmationHtml,
    OrderConfirmationData,
} from "@/app/api/lib/emails/generate-order-confirmation-html";
import { saveUserDataToSession, UserOrderData } from "@/lib/session";
import {
    generateInvoicePdfBuffer,
    InvoiceTemplateData,
    renderInvoiceTemplate,
} from "@/lib/services/invoice-service";
import { EmailOptions, sendEmail } from "@/lib/services/email-service";
import { websiteName } from "@/lib/utils";

export interface SendOrderResult {
    success: boolean;
    order?: Order;
    html?: string;
    error?: string;
}

const orderService = new OrderService(getDb());

export async function sendOrderConfirmation(
    formData: CheckoutFormData,
    items: CartItem[],
): Promise<SendOrderResult> {
    try {
        const orderNumber = `ORD-${Date.now()}`;

        const totalAmount = items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0,
        );

        // Създаваме поръчката в базата
        const order = await orderService.createOrder({
            order_number: orderNumber,
            fullname: formData.fullname,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            country: "Bulgaria",
            notes: formData.notes || null,
            status: OrderStatusEnum.Pending,
            payment_status: PaymentStatusEnum.Unpaid,
            total_amount: totalAmount,
            currency: "EUR",
            items,
            guest: true,
            gift: false,
            is_priority: false,
            allow_marketing: formData.terms || false,
            feedback_given: false,
        });

        // Запазваме данните в сесията

        // Генерираме HTML за потвърждение
        const orderData: OrderConfirmationData = {
            fullname: order.fullname,
            email: order.email,
            phone: order.phone,
            address: order.address,
            notes: order.notes,
            items: order.items,
            total_amount: order.total_amount,
        };

        const html = generateOrderConfirmationHtml(orderData);

        saveUserDataToSession(formData);

        const demoInvoiceData: InvoiceTemplateData = {
            invoiceNumber: "INV-2026-0001",
            issueDate: "2026-01-30",
            validUntil: "2026-02-13",

            customerName: "Иван Петров Иванов",
            customerAddress: "гр. София 1000, ул. Граф Игнатиев №12",
            customerEIK: "123456789",
            customerVAT: "BG123456789",

            items: [
                {
                    name: "Аранжировка с жълти и бели рози",
                    quantity: 1,
                    price: 120.0,
                },
                {
                    name: "Доставка до адрес",
                    quantity: 1,
                    price: 10.0,
                },
            ],

            subtotal: 130.0,
            vatAmount: 26.0, // 20% ДДС
            total: 156.0,

            totalInWords: "сто петдесет и шест лева и нула стотинки",

            company: {
                name: "Флора Арт ООД",
                address: "гр. Пловдив 4000, бул. България №45",
                vatId: "BG987654321",
                phone: "+359 88 123 4567",
                bank: "УниКредит Булбанк",
                iban: "BG18UNCR70001512345678",
                swift: "UNCRBGSF",
                logoUrl: "https://yourdomain.com/logo.png",
            },
        };

        const pdfBuffer = await generateInvoicePdfBuffer(demoInvoiceData);

        const emailOptions: EmailOptions = {
            subject: `Имате нова поръчка в ${websiteName()}`,
            text: html,
            to: order.email,
            attachments: [
                {
                    filename: `invoice-${demoInvoiceData.invoiceNumber}.pdf`,
                    content: pdfBuffer,
                    contentType: "application/pdf",
                },
            ],
        };

        await sendEmail(emailOptions);

        return { success: true, html, order };
    } catch (error: any) {
        console.error("Грешка при създаване на поръчка:", error);
        return { success: false, error: error?.message || "Нещо се случи!" };
    }
}

export async function saveCheckoutDataToSession(formData: CheckoutFormData) {
    const data: UserOrderData = { ...formData };

    await saveUserDataToSession(data);

    return { success: true };
}