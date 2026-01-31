import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ProductService } from "@/lib/services/product-service";
import { ProductStatus } from "@/lib/types";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const query = searchParams.get("q") || "";
        const limit = Number(searchParams.get("limit") ?? 10);
        const status = searchParams.get("status") as ProductStatus | null;

        if (!query.trim()) {
            return NextResponse.json([]);
        }

        const pool = getDb();
        const productService = new ProductService(pool);

        const products = await productService.searchProducts(query, {
            limit,
            status: status ?? undefined,
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Product search error:", error);

        return NextResponse.json(
            { message: "Грешка при търсене на продукти" },
            { status: 500 },
        );
    }
}
