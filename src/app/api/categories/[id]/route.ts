import { deleteUploadedFile } from "@/app/api/lib";
import { NextResponse } from "next/server";
import { CategoryService } from "@/lib/services/category-service";
import { getDb } from "@/lib/db";

const categoryService = new CategoryService(getDb());

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(_: Request, { params }: Props) {
    const categoryId = Number((await params).id);

    if (isNaN(categoryId)) {
        return NextResponse.json(
            { error: "Невалиден идентификатор на категорията." },
            { status: 400 },
        );
    }

    try {
        const category = await categoryService.getItemById(categoryId);

        if (!category) {
            return NextResponse.json(
                { error: "Този категорията не е намерен." },
                { status: 404 },
            );
        }

        if (category.image) {
            await deleteUploadedFile(category.image);
        }

        await categoryService.deleteItemsBulk([categoryId]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json(
            { error: "Неуспешно изтриване на категорията." },
            { status: 500 },
        );
    }
}
