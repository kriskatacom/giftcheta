import fs from "fs";
import os from "os";
import path from "path";
import { CartItem } from "@/stores/cart-store";
import { formatPrice, getFullUrl } from "@/lib/utils";

export type OrderConfirmationData = {
    fullname: string;
    phone: string;
    email: string;
    address: string;
    notes?: string | null;
    total_amount?: number;
    items: CartItem[];
};

export function generateOrderConfirmationHtml(
    data: OrderConfirmationData,
): string {
    const templatePath = path.join(
        process.cwd(),
        "src/lib/html-templates/order-confirmation.html",
    );

    let html = fs.readFileSync(templatePath, "utf-8");

    // 🔹 Basic replacements
    html = html
        .replace("{{ fullname }}", data.fullname)
        .replace("{{ phone }}", data.phone)
        .replace("{{ email }}", data.email)
        .replace("{{ address }}", data.address)
        .replace("{{ year }}", new Date().getFullYear().toString());

    // 🔹 Notes (optional)
    if (data.notes) {
        html = html.replace(
            /{{#if notes}}([\s\S]*?){{\/if}}/,
            `$1`.replace("{{ notes }}", data.notes),
        );
    } else {
        html = html.replace(/{{#if notes}}([\s\S]*?){{\/if}}/, "");
    }

    // 🔹 Render products
    const itemsHtml = data.items
        .map((item) => {
            return `
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                    <td width="80" valign="top">
                        <a href="${item.link}">
                            <img
                                src="${getFullUrl(`${item.image}`) ?? "https://via.placeholder.com/72"}"
                                alt="${item.name}"
                                width="72"
                                height="72"
                                style="border-radius:8px; object-fit:cover;"
                            />
                        </a>
                    </td>
                    <td valign="top" style="padding-left:12px;">
                        <p style="margin:0; font-size:14px; font-weight:bold; color:#111827;">
                            ${item.name}
                        </p>
                        <p style="margin:4px 0; font-size:13px; color:#6b7280;">
                            Количество: ${item.quantity}
                        </p>
                        <p style="margin:4px 0; font-size:13px; color:#6b7280;">
                            Цена: ${formatPrice(item.price)}
                        </p>
                    </td>
                </tr>
            </table>
            `;
        })
        .join("");

    html = html.replace(/{{#each items}}([\s\S]*?){{\/each}}/, itemsHtml);
    return html;
}
