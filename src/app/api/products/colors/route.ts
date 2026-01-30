import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProductService } from "@/lib/services/product-service";
import { getDb } from "@/lib/db";
import { productColorsSchema, ProductColorsInput } from "@/app/admin/products/[id]/colors/schema";

const productService = new ProductService(getDb());

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed: ProductColorsInput = productColorsSchema.parse(body);

        if (!parsed.id) {
            return NextResponse.json(
                { success: false, message: "Не е предоставен product ID" },
                { status: 400 }
            );
        }

        await productService.syncProductColors(parsed.id, parsed.colors ?? []);

        const updatedProduct = await productService.getItemByColumn("id", parsed.id);

        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (err: any) {
        console.error("Error updating product colors:", err);

        if (err instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, errors: err.issues },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, message: "Възникна грешка при запис" },
            { status: 500 }
        );
    }
}