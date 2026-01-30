import { deleteUploadedFile } from "@/app/api/lib";
import { NextResponse } from "next/server";
import { ProductService } from "@/lib/services/product-service";
import { getDb } from "@/lib/db";

const productService = new ProductService(getDb());

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(_: Request, { params }: Props) {
    const productId = Number((await params).id);

    if (isNaN(productId)) {
        return NextResponse.json(
            { error: "Невалиден идентификатор на продукт." },
            { status: 400 },
        );
    }

    try {
        const product = await productService.getItemByColumn("id", productId);

        if (!product) {
            return NextResponse.json(
                { error: "Този продукт не е намерен." },
                { status: 404 },
            );
        }

        if (product.image) {
            await deleteUploadedFile(product.image);
        }
        
        const images: string[] = Array.isArray(product.images)
            ? product.images
            : [];

        if (images.length > 0) {
            await Promise.all(
                images.map(async (url: string) => {
                    try {
                        await deleteUploadedFile(url);
                    } catch (err) {
                        console.warn(`Неуспешно изтриване на файл ${url}`, err);
                    }
                }),
            );
        }

        await productService.deleteItemsBulk([productId]);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Неуспешно изтриване на продукта." },
            { status: 500 },
        );
    }
}