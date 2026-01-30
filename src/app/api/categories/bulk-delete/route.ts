import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { CategoryService } from "@/lib/services/category-service";

const categoryService = new CategoryService(getDb());

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { message: "Не са предоставени IDs за изтриване" },
                { status: 400 },
            );
        }

        for (const id of ids) {
            await categoryService.deleteItem(Number(id));
        }

        return NextResponse.json({
            success: true,
            deletedIds: ids,
            deletedCount: ids.length,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при изтриване на категориите" },
            { status: 500 },
        );
    }
}
