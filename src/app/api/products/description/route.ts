import { NextRequest, NextResponse } from "next/server";
import {
    productDescriptionSchema,
    ProductDescriptionInput,
} from "@/app/admin/products/[id]/description/schema";
import { ProductService } from "@/lib/services/product-service";
import { getDb } from "@/lib/db";

const productService = new ProductService(getDb());

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const input: ProductDescriptionInput = productDescriptionSchema.parse(body);

        if (!input.id) {
            return NextResponse.json(
                { success: false, message: "Не е предоставен ID на продукта" },
                { status: 400 },
            );
        }

        const updatedProduct = await productService.updateItem(input.id, {
            short_description: input.short_description,
            description: input.description ?? "",
        });

        return NextResponse.json(
            {
                success: true,
                updated: true,
                product: updatedProduct,
            },
            { status: 200 },
        );
    } catch (err: any) {
        if (err.errors) {
            return NextResponse.json(
                { success: false, errors: err.errors },
                { status: 400 },
            );
        }

        console.error("Error updating product description:", err);

        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 },
        );
    }
}