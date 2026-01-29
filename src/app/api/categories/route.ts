import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { CategoryService } from "@/lib/services/category-service";

const categoryService = new CategoryService(getDb());

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const parent_id = url.searchParams.get("parent_id");
        const parentIdNum = parent_id ? parseInt(parent_id, 10) : undefined;

        const categories = await categoryService.getAllItems(parentIdNum);

        return NextResponse.json({ categories });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: "Грешка при извличане на категориите" },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const idParam = url.searchParams.get("id");
        if (!idParam) {
            return NextResponse.json(
                { error: "Липсва ID за изтриване" },
                { status: 400 },
            );
        }

        const id = parseInt(idParam, 10);
        const success = await categoryService.deleteItem(id);

        if (!success) {
            return NextResponse.json(
                { error: "Категорията не беше намерена" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            message: "Категорията беше изтрита успешно",
            success,
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: "Грешка при изтриване на категорията" },
            { status: 500 },
        );
    }
}