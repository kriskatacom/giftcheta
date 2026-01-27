import { NextResponse } from "next/server";
import { deleteProductsWithImages } from "@/lib/services/product-service";

export async function POST(req: Request) {
    try {
        const { ids }: { ids?: number[] } = await req.json();

        if (!ids || ids.length === 0) {
            return NextResponse.json(
                { message: "Няма предоставени идентификатори на продукти." },
                { status: 400 },
            );
        }

        const deletedCount = await deleteProductsWithImages(ids);

        return NextResponse.json({ success: true, deletedCount });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Сървърна грешка." },
            { status: 500 },
        );
    }
}
