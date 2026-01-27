import { NextRequest, NextResponse } from "next/server";
import {
    getProductByColumn,
    updateProductInventory,
    updateProductTags,
} from "@/lib/services/product-service";
import { productInventorySchema } from "@/app/admin/products/[id]/inventory/schema";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsedResult = productInventorySchema.safeParse(body);

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

        const result = await updateProductInventory(parsed);

        const updatedProduct = await getProductByColumn(
            "id",
            parsed.id as number,
        );

        return NextResponse.json(
            {
                success: true,
                productId: result.id,
                data: updatedProduct,
                updated: result.updated,
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("API error (inventory):", err);

        return NextResponse.json(
            {
                success: false,
                error: "Сървърна грешка.",
            },
            { status: 500 },
        );
    }
}
