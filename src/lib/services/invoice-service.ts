import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import { formatPrice } from "../utils";

export interface InvoiceTemplateData {
    invoiceNumber: string;
    issueDate: string;
    validUntil: string;
    customerName: string;
    customerAddress?: string;
    customerEIK?: string;
    customerVAT?: string;
    items: { name: string; quantity: number; price: number }[];
    subtotal: number;
    vatAmount: number;
    total: number;
    totalInWords: string;
    company: {
        name: string;
        address: string;
        vatId: string;
        phone: string;
        bank: string;
        iban: string;
        swift: string;
        logoUrl: string;
    };
}

export function renderInvoiceTemplate(data: InvoiceTemplateData) {
    const templatePath = path.join(
        process.cwd(),
        "src/lib/html-templates/invoice-template.html",
    );
    let template = fs.readFileSync(templatePath, "utf-8");

    // Генериране на редове за таблицата
    const itemsRows = data.items
        .map(
            (item) => `
<tr>
  <td>${item.name}</td>
  <td class="right">${item.quantity}</td>
  <td class="right">${formatPrice(item.price)}</td>
  <td class="right">${formatPrice(item.price * item.quantity)}</td>
</tr>`,
        )
        .join("");

    // Заместване на всички променливи {{ ... }}
    template = template
        .replace(/{{invoiceNumber}}/g, data.invoiceNumber)
        .replace(/{{issueDate}}/g, data.issueDate)
        .replace(/{{validUntil}}/g, data.validUntil)
        .replace(/{{customerName}}/g, data.customerName)
        .replace(/{{customerAddress}}/g, data.customerAddress ?? "")
        .replace(/{{customerEIK}}/g, data.customerEIK ?? "")
        .replace(/{{customerVAT}}/g, data.customerVAT ?? "")
        .replace(/{{itemsRows}}/g, itemsRows)
        .replace(/{{subtotal}}/g, formatPrice(data.subtotal))
        .replace(/{{vatAmount}}/g, formatPrice(data.vatAmount))
        .replace(/{{total}}/g, formatPrice(data.total))
        .replace(/{{totalInWords}}/g, data.totalInWords)
        .replace(/{{company.name}}/g, data.company.name)
        .replace(/{{company.address}}/g, data.company.address)
        .replace(/{{company.vatId}}/g, data.company.vatId)
        .replace(/{{company.phone}}/g, data.company.phone)
        .replace(/{{company.bank}}/g, data.company.bank)
        .replace(/{{company.iban}}/g, data.company.iban)
        .replace(/{{company.swift}}/g, data.company.swift)
        .replace(/{{company.logoUrl}}/g, data.company.logoUrl);

    return template;
}

export async function generateInvoicePdfBuffer(
    data: InvoiceTemplateData,
): Promise<Buffer> {
    const html = renderInvoiceTemplate(data);

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });

    const pdfUint8Array = await page.pdf({
        format: "A4",
        printBackground: true,
        margin: {
            top: "20mm",
            bottom: "20mm",
            left: "15mm",
            right: "15mm",
        },
    });

    const pdfBuffer = Buffer.from(pdfUint8Array);

    await browser.close();

    return pdfBuffer;
}
