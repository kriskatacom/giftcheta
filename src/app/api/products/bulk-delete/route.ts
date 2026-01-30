import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ProductService } from "@/lib/services/product-service";

const productService = new ProductService(getDb());

export async function POST(req: Request) {
    try {
        const { ids }: { ids?: number[] } = await req.json();

        if (!ids || ids.length === 0) {
            return NextResponse.json(
                { message: "Няма предоставени идентификатори на продукти." },
                { status: 400 },
            );
        }

        const deletedCount = await productService.deleteItemsBulk(ids);

        return NextResponse.json({ success: true, deletedCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при изтриване на продуктите" },
            { status: 500 },
        );
    }
}
