import { NextResponse } from "next/server";
import { deleteUploadedFile, saveUploadedFile } from "@/app/api/lib";
import { slugify } from "@/lib/utils";
import { ProductService } from "@/lib/services/product-service";
import { getDb } from "@/lib/db";

const productService = new ProductService(getDb());

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(req: Request, { params }: Props) {
    const productId = Number((await params).id);
    
    if (isNaN(productId)) {
        return NextResponse.json(
            { error: "Невалиден идентификатор на продукт." },
            { status: 400 }
        );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;
    const isWithBaseName = formData.get("with_base_name") === "true";

    if (!file) {
        return NextResponse.json({ error: "Няма качен файл." }, { status: 400 });
    }

    try {
        const product = await productService.getItemByColumn("id", productId);

        if (!product) {
            return NextResponse.json(
                { error: "Този продукт не съществува." },
                { status: 404 }
            );
        }

        const baseName = isWithBaseName ? slugify(product.name) : "";

        const url = await saveUploadedFile(file, baseName);

        if (product.image) {
            await deleteUploadedFile(product.image);
        }

        const updatedProduct = await productService.updateItem(productId, { image: url });

        return NextResponse.json({
            success: true,
            url,
            product: updatedProduct,
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
    const productId = Number((await params).id);
    
    if (isNaN(productId)) {
        return NextResponse.json(
            { error: "Невалиден идентификатор на продукт." },
            { status: 400 }
        );
    }

    try {
        const product = await productService.getItemByColumn("id", productId);

        if (!product) {
            return NextResponse.json(
                { error: "Този продукт не съществува." },
                { status: 404 }
            );
        }

        if (product.image) {
            await deleteUploadedFile(product.image);
        }

        const updatedProduct = await productService.updateItem(productId, { image: "" });

        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (err: any) {
        console.error("Error deleting image:", err);
        return NextResponse.json(
            { error: err.message || "Грешка при изтриване на изображението." },
            { status: 500 }
        );
    }
}
