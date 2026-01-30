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
            { status: 400 },
        );
    }

    const formData = await req.formData();
    const files = formData.getAll("images") as File[];
    const isWithBaseName = formData.get("with_base_name") === "yes";

    if (!files.length) {
        return NextResponse.json(
            { error: "Няма файлове за качване." },
            { status: 400 },
        );
    }

    try {
        const product = await productService.getItemByColumn("id", productId);
        if (!product) {
            return NextResponse.json(
                { error: "Този продукт не съществува." },
                { status: 404 },
            );
        }

        const baseName = isWithBaseName ? slugify(product.name) : "";

        let currentImages: string[] = [];
        if (Array.isArray(product.images)) {
            currentImages = product.images;
        } else if (typeof product.images === "string" && product.images) {
            try {
                currentImages = Array.isArray(product.images)
                    ? product.images
                    : [];
            } catch {
                currentImages = [];
            }
        }

        const uploadedUrls: string[] = [];
        for (const file of files) {
            const url = await saveUploadedFile(file, baseName);
            if (url) uploadedUrls.push(url);
        }

        const updatedProduct = await productService.updateItem(productId, {
            images: JSON.stringify([...currentImages, ...uploadedUrls]),
        });

        return NextResponse.json({
            success: true,
            urls: uploadedUrls,
            product: updatedProduct,
        });
    } catch (err: any) {
        console.error("Error uploading images:", err);
        return NextResponse.json(
            { error: err.message || "Грешка при качване на изображенията." },
            { status: 500 },
        );
    }
}

export async function DELETE(req: Request, { params }: Props) {
    const productId = Number((await params).id);
    
    if (isNaN(productId)) {
        return NextResponse.json(
            { error: "Невалиден идентификатор на продукт." },
            { status: 400 },
        );
    }

    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
        return NextResponse.json(
            { error: "Липсва imageUrl за изтриване." },
            { status: 400 },
        );
    }

    try {
        const product = await productService.getItemByColumn("id", productId);
        if (!product) {
            return NextResponse.json(
                { error: "Този продукт не съществува." },
                { status: 404 },
            );
        }

        let additionalImages: string[] = [];
        if (Array.isArray(product.images)) {
            additionalImages = product.images;
        } else if (typeof product.images === "string" && product.images) {
            try {
                additionalImages = Array.isArray(product.images)
                    ? product.images
                    : [];
            } catch {
                additionalImages = [];
            }
        }

        const updatedImages = additionalImages.filter(
            (img) => img !== imageUrl,
        );

        await deleteUploadedFile(imageUrl);

        const updatedProduct = await productService.updateItem(productId, {
            images: JSON.stringify(updatedImages),
        });

        return NextResponse.json({ success: true, product: updatedProduct });
    } catch (err: any) {
        console.error("Error deleting image:", err);
        return NextResponse.json(
            { error: err.message || "Грешка при изтриване на изображението." },
            { status: 500 },
        );
    }
}