import { generateAndSendInvoice } from "./invoiceService";

export const POST = async (req: Request) => {
    const data = await req.json();
    const result = await generateAndSendInvoice(data);
    return new Response(
        JSON.stringify({ success: true, invoiceNumber: result.invoiceNumber }),
        {
            status: 200,
            headers: { "Content-Type": "application/json" },
        },
    );
};
