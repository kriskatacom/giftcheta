"use server";

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

        return { success: true, html, order };
    } catch (error: any) {
        console.error("Грешка при създаване на поръчка:", error);
        return { success: false, error: error?.message || "Unknown error" };
    }
}

export async function saveCheckoutDataToSession(formData: CheckoutFormData) {
    const data: UserOrderData = { ...formData };

    await saveUserDataToSession(data);

    return { success: true };
}
