import { NextRequest, NextResponse } from "next/server";
import {
    productNameSlugSchema,
    ProductBaseInput,
} from "@/app/admin/products/[id]/name-and-slug-form/schema";
import { ProductService } from "@/lib/services/product-service";
import { getDb } from "@/lib/db";

const productService = new ProductService(getDb());

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const input: ProductBaseInput = productNameSlugSchema.parse(body);

        const result = await productService.createItem({
            name: input.name,
            slug: input.slug,
        });

        return NextResponse.json(
            {
                success: true,
                created: result.created,
                product: result.product,
            },
            { status: 201 },
        );
    } catch (err: any) {
        if (err.errors) {
            return NextResponse.json(
                { success: false, errors: err.errors },
                { status: 400 },
            );
        }

        console.log(err);

        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 },
        );
    }
}

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();

        const input: ProductBaseInput = productNameSlugSchema.parse(body);

        if (!input.id) {
            return NextResponse.json(
                { success: false, message: "Не е предоставен ID на продукта" },
                { status: 400 },
            );
        }

        const updatedProduct = await productService.updateItem(input.id, {
            name: input.name,
            slug: input.slug,
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
        
        console.log(err);
        
        return NextResponse.json(
            { success: false, message: err.message },
            { status: 500 },
        );
    }
}
