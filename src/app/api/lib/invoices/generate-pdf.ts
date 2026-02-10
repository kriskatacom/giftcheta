import PDFDocument from "pdfkit";
import fs from "fs";
import { Invoice } from "@/app/api/lib/invoices/invoice";

interface CompanyInfo {
    name: string;
    vatId: string;
    address: string;
    email?: string;
    phone?: string;
    website?: string;
}

export function generateInvoicePDF(
    invoice: Invoice,
    company: CompanyInfo,
    outputPath: string,
) {
    const doc = new PDFDocument({ margin: 50 });

    doc.pipe(fs.createWriteStream(outputPath));

    // ===== Header (Company Info) =====
    doc.fontSize(16).text(company.name);
    doc.fontSize(10).text(`VAT ID: ${company.vatId}`);
    doc.text(company.address);
    if (company.email) doc.text(`Email: ${company.email}`);
    if (company.phone) doc.text(`Phone: ${company.phone}`);
    if (company.website) doc.text(`Website: ${company.website}`);
    doc.moveDown(1.5);

    // ===== Invoice Info =====
    doc.fontSize(14).text(`Invoice / Фактура № ${invoice.invoiceNumber}`);
    doc.fontSize(10).text(`Issue Date: ${invoice.issueDate}`);
    doc.moveDown();

    // ===== Customer Info =====
    doc.text(`Bill To:`);
    doc.text(invoice.customer.name);
    doc.text(invoice.customer.email);
    doc.moveDown();

    // ===== Table Header =====
    doc.fontSize(12).text("Item", 50, doc.y);
    doc.text("Qty", 300, doc.y);
    doc.text("Unit Price", 370, doc.y);
    doc.text("Total", 450, doc.y);
    doc.moveDown(0.5);

    // ===== Items =====
    invoice.items.forEach((item) => {
        doc.fontSize(10).text(item.name, 50, doc.y);
        doc.text(item.quantity.toString(), 300, doc.y);
        doc.text(
            `${item.unitPrice.toFixed(2)} ${invoice.summary.currency}`,
            370,
            doc.y,
        );
        doc.text(
            `${item.totalPrice.toFixed(2)} ${invoice.summary.currency}`,
            450,
            doc.y,
        );
        doc.moveDown(0.5);
    });

    doc.moveDown(1);

    // ===== Summary =====
    doc.fontSize(10).text(
        `Subtotal: ${invoice.summary.subtotal.toFixed(2)} ${invoice.summary.currency}`,
        { align: "right" },
    );
    doc.text(
        `VAT (${(invoice.summary.vatRate * 100).toFixed(0)}%): ${invoice.summary.vatAmount.toFixed(
            2,
        )} ${invoice.summary.currency}`,
        { align: "right" },
    );
    doc.fontSize(12).text(
        `Total: ${invoice.summary.total.toFixed(2)} ${invoice.summary.currency}`,
        { align: "right" },
    );

    // ===== Footer =====
    doc.moveDown(2);
    doc.fontSize(8).text("Thank you for your business!", { align: "center" });

    doc.end();
}