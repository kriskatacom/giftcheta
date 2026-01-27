import { NextRequest, NextResponse } from "next/server";
import { createOrUpdateProductNameSlug } from "@/lib/services/product-service";
import { productNameSlugSchema } from "@/app/admin/products/[id]/name-and-slug-form/schema";

export async function POST(req: NextRequest) {
    const body = await req.json();

    // safeParse вместо parse
    const parsedResult = productNameSlugSchema.safeParse(body);

    if (!parsedResult.success) {
        const errors: Record<string, string> = {};
        parsedResult.error.issues.forEach((issue) => {
            const key = issue.path[0] as string;
            errors[key] = issue.message;
        });

        return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    const parsed = parsedResult.data;

    try {
        const result = await createOrUpdateProductNameSlug(parsed);

        return NextResponse.json(
            { success: true, productId: result.id, created: result.created },
            { status: result.created ? 201 : 200 },
        );
    } catch (err: any) {
        if (err?.code === "slug") {
            return NextResponse.json(
                { success: false, code: "slug", error: err.message },
                { status: 400 },
            );
        }

        console.error("API error:", err);

        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 },
        );
    }
}
