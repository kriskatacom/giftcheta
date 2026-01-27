import { NextRequest, NextResponse } from "next/server";
import {
    getProductByColumn,
    updateProductDescription,
} from "@/lib/services/product-service";
import { productDescriptionSchema } from "@/app/admin/products/[id]/description/schema";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const parsedResult = productDescriptionSchema.safeParse(body);

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

        const result = await updateProductDescription(parsed);

        const updatedProduct = await getProductByColumn(
            "id",
            parsed.id as number,
        );

        return NextResponse.json(
            {
                success: true,
                productId: result.id,
                data: updatedProduct,
                created: result.created,
            },
            { status: result.created ? 201 : 200 },
        );
    } catch (err: any) {
        if (err?.code === "slug") {
            return NextResponse.json(
                {
                    success: false,
                    errors: {
                        slug: err.message,
                    },
                },
                { status: 400 },
            );
        }

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
