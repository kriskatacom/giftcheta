"use client";

import axios from "axios";
import { useCartStore } from "@/stores/cart-store";

export default function DownloadInvoiceButton() {
    const { items } = useCartStore((state) => state);

    async function downloadInvoice() {
        const invoiceData = {
            customerName: "Иван Петров",
            customerEmail: "ivan@example.com",
            items: [
                {
                    productId: 1,
                    name: "T-shirt",
                    slug: "tshirt",
                    price: 25,
                    quantity: 2,
                },
                {
                    productId: 2,
                    name: "Mug",
                    slug: "mug",
                    price: 12,
                    quantity: 1,
                },
            ],
            vatRate: 0.2,
        };

        const response = await axios.post("/api/invoice", invoiceData, {
            responseType: "blob",
        });

        const url = window.URL.createObjectURL(
            new Blob([response.data], { type: "application/pdf" }),
        );
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `faktura-${Date.now()}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <button
            onClick={downloadInvoice}
            className="px-4 py-2 bg-blue-600 text-white rounded"
        >
            Download Invoice
        </button>
    );
}
