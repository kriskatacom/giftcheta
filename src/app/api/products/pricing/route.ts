import { NextRequest, NextResponse } from "next/server";
import { getProductByColumn, updateProductPrice } from "@/lib/services/product-service";
import { productPriceSchema } from "@/app/admin/products/[id]/pricing/schema";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsedResult = productPriceSchema.safeParse(body);

        if (!parsedResult.success) {
            const errors: Record<string, string> = {};

            parsedResult.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                errors[field] = issue.message;
            });

            return NextResponse.json(
                { success: false, errors },
                { status: 400 },
            );
        }

        const parsed = parsedResult.data;

        const result = await updateProductPrice(parsed);

        const updatedProduct = await getProductByColumn("id", parsed.id as number);

        return NextResponse.json(
            {
                success: true,
                productId: result.id,
                data: updatedProduct,
                updated: result.updated,
            },
            { status: 200 },
        );
    } catch (err: any) {
        console.error("API error:", err);

        return NextResponse.json(
            {
                success: false,
                error: "Сървърна грешка.",
            },
            { status: 500 },
        );
    }
}
