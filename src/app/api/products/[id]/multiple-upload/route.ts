import { deleteUploadedFile, saveUploadedFile } from "@/app/api/lib";
import {
    getProductByColumn,
    updateProduct,
} from "@/lib/services/product-service";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{ id: string }>;
};

// POST: добавя много снимки в additionalImages
export async function POST(req: Request, { params }: Params) {
    const { id } = await params;

    const formData = await req.formData();
    const files = formData.getAll("images") as File[]; // множествени файлове

    if (!files.length) {
        return NextResponse.json(
            { error: "Няма файлове за качване" },
            { status: 400 },
        );
    }

    try {
        const product = await getProductByColumn("id", id);

        if (!product) {
            return NextResponse.json(
                { error: "Този продукт не съществува." },
                { status: 404 },
            );
        }

        const currentImages: string[] = Array.isArray(product.images)
            ? (product.images as string[]).filter(
                  (img): img is string => typeof img === "string",
              )
            : [];

        const uploadedUrls: string[] = [];
        for (const file of files) {
            const url = await saveUploadedFile(file);
            uploadedUrls.push(url);
        }

        const updatedImages = [...currentImages, ...uploadedUrls];

        const updatedProduct = await updateProduct(Number(id), {
            images: JSON.stringify(updatedImages),
        });

        return NextResponse.json({
            success: true,
            urls: uploadedUrls,
            product: updatedProduct,
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Грешка при качване" },
            { status: 400 },
        );
    }
}

export async function DELETE(req: Request, { params }: Params) {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
        return NextResponse.json(
            { error: "Invalid product id" },
            { status: 400 },
        );
    }

    const { searchParams } = new URL(req.url);
    const imageUrl = searchParams.get("imageUrl");

    if (!imageUrl) {
        return NextResponse.json(
            { error: "Липсва imageUrl за изтриване" },
            { status: 400 },
        );
    }

    try {
        const product = await getProductByColumn("id", productId);

        if (!product) {
            return NextResponse.json(
                { error: "Посолството не съществува" },
                { status: 404 },
            );
        }

        let additionalImages: string[] = [];

        if (Array.isArray(product.images)) {
            additionalImages = product.images;
        } else if (typeof product.images === "string") {
            try {
                additionalImages = JSON.parse(product.images);
            } catch {
                additionalImages = [];
            }
        }

        const updatedImages = additionalImages.filter(
            (img) => img !== imageUrl,
        );

        await deleteUploadedFile(imageUrl);

        const productUpdated = await updateProduct(productId, {
            images: JSON.stringify(updatedImages),
        });

        return NextResponse.json({ success: true, product: productUpdated });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Грешка при изтриване" },
            { status: 500 },
        );
    }
}
