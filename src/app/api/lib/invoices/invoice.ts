import { randomUUID } from "crypto";

/* ===== Types ===== */

export interface InvoiceItem {
    name: string;
    quantity: number;
    unitPrice: number;
}

export interface Customer {
    name: string;
    email: string;
}

export interface InvoiceSummary {
    subtotal: number;
    vatRate: number;
    vatAmount: number;
    total: number;
    currency: "EUR";
}

export interface Invoice {
    invoiceNumber: string;
    issueDate: string;
    customer: Customer;
    items: Array<InvoiceItem & { totalPrice: number }>;
    summary: InvoiceSummary;
}

/* ===== Function ===== */

export function generateInvoice(params: {
    customer: Customer;
    items: InvoiceItem[];
    vatRate?: number;
    invoiceNumber?: string;
}): Invoice {
    const {
        customer,
        items,
        vatRate = 0.2,
        invoiceNumber = `INV-${randomUUID().slice(0, 8).toUpperCase()}`,
    } = params;

    const subtotal = items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
    );

    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    return {
        invoiceNumber,
        issueDate: new Date().toISOString().split("T")[0],
        customer,
        items: items.map((item) => ({
            ...item,
            totalPrice: Number((item.quantity * item.unitPrice).toFixed(2)),
        })),
        summary: {
            subtotal: Number(subtotal.toFixed(2)),
            vatRate,
            vatAmount: Number(vatAmount.toFixed(2)),
            total: Number(total.toFixed(2)),
            currency: "EUR",
        },
    };
}

const invoice = generateInvoice({
    customer: {
        name: "Ivan Petrov",
        email: "ivan@example.com",
    },
    items: [
        { name: "T-shirt", quantity: 2, unitPrice: 25 },
        { name: "Mug", quantity: 1, unitPrice: 12 },
    ],
});

console.log(invoice);