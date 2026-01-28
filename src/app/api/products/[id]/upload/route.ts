import { NextResponse } from "next/server";
import { deleteUploadedFile, saveUploadedFile } from "@/app/api/lib";
import {
    getProductByColumn,
    updateProduct,
} from "@/lib/services/product-service";
import { slugify } from "@/lib/utils";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function POST(req: Request, { params }: Params) {
    const { id } = await params;

    const formData = await req.formData();
    const file = formData.get("image") as File;
    const isWithBaseName = formData.get("with_base_name");

    if (!file) {
        return NextResponse.json({ error: "Няма файл" }, { status: 400 });
    }

    try {
        const product = await getProductByColumn("id", id);

        if (!product) {
            return NextResponse.json({ error: "Този продукт не съществува" }, { status: 400 });
        }

        const baseName = isWithBaseName && slugify(product.name) || "";

        const url = await saveUploadedFile(file, baseName);

        const updatedProduct = await updateProduct(Number(id), {
            image: url,
        });

        return NextResponse.json({
            success: true,
            url,
            product: updatedProduct,
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Грешка при качване на изображението." },
            { status: 400 },
        );
    }
}

export async function DELETE(req: Request, { params }: Params) {
    const { id } = await params;

    try {
        const product = await getProductByColumn("id", id);

        if (!product) {
            return NextResponse.json(
                { error: "Този продукт не съществува." },
                { status: 404 },
            );
        }

        if (product.image) {
            await deleteUploadedFile(product.image);
        }

        const productUpdated = await updateProduct(Number(id), {
            image: ""
        });

        return NextResponse.json({ success: true, product: productUpdated });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Грешка при изтриване на изображението." },
            { status: 500 },
        );
    }
}