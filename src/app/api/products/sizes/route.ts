// app/api/products/sizes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { ProductService } from "@/lib/services/product-service";
import { getDb } from "@/lib/db";
import { productSizesSchema, ProductSizesInput } from "@/app/admin/products/[id]/sizes/schema";

const productService = new ProductService(getDb());

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const parsed: ProductSizesInput = productSizesSchema.parse(body);

        if (!parsed.id) {
            return NextResponse.json(
                { success: false, message: "Не е предоставен product ID" },
                { status: 400 }
            );
        }

        await productService.syncProductSizes(parsed.id, parsed.sizes ?? []);

        const updatedProduct = await productService.getItemByColumn("id", parsed.id);

        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (err: any) {
        console.error("Error updating product sizes:", err);

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
