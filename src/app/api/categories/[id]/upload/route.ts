import { NextResponse } from "next/server";
import { deleteUploadedFile, saveUploadedFile } from "@/app/api/lib";
import { slugify } from "@/lib/utils";
import { CategoryService } from "@/lib/services/category-service";
import { getDb } from "@/lib/db";

const categoryService = new CategoryService(getDb());

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(req: Request, { params }: Props) {
    const categoryId = Number((await params).id);
    
    if (isNaN(categoryId)) {
        return NextResponse.json(
            { error: "Невалиден идентификатор на категория." },
            { status: 400 }
        );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const isWithBaseName = formData.get("with_base_name") === "yes";

    if (!file) {
        return NextResponse.json({ error: "Няма качен файл." }, { status: 400 });
    }

    try {
        const category = await categoryService.getItemById(categoryId);

        if (!category) {
            return NextResponse.json(
                { error: "Този категория не съществува." },
                { status: 404 }
            );
        }

        const baseName = isWithBaseName ? slugify(category.name) : "";

        const url = await saveUploadedFile(file, baseName);

        if (category.image) {
            await deleteUploadedFile(category.image);
        }

        const updatedCategory = await categoryService.updateItem(categoryId, { image: url });

        return NextResponse.json({
            success: true,
            url,
            product: updatedCategory,
        });
    } catch (err: any) {
        console.error("Error uploading image:", err);
        return NextResponse.json(
            { error: err.message || "Грешка при качване на изображението." },
            { status: 500 }
        );
    }
}

export async function DELETE(req: Request, { params }: Props) {
    const categoryId = Number((await params).id);
    
    if (isNaN(categoryId)) {
        return NextResponse.json(
            { error: "Невалиден идентификатор на категория." },
            { status: 400 }
        );
    }

    try {
        const category = await categoryService.getItemById(categoryId);

        if (!category) {
            return NextResponse.json(
                { error: "Този категория не съществува." },
                { status: 404 }
            );
        }

        if (category.image) {
            await deleteUploadedFile(category.image);
        }

        const updatedCategory = await categoryService.updateItem(categoryId, { image: "" });

        return NextResponse.json({ success: true, category: updatedCategory });
    } catch (err: any) {
        console.error("Error deleting image:", err);
        return NextResponse.json(
            { error: err.message || "Грешка при изтриване на изображението." },
            { status: 500 }
        );
    }
}
