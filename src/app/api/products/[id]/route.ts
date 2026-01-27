import {
    deleteProduct,
    getProductByColumn,
} from "@/lib/services/product-service";
import { deleteUploadedFile } from "@/app/api/lib";
import { NextResponse } from "next/server";

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export async function DELETE(_: Request, { params }: Params) {
    const { id } = await params;
    const productId = Number(id);

    if (isNaN(productId)) {
        return NextResponse.json(
            { error: "Невалиден идентификатор на продукт." },
            { status: 400 },
        );
    }

    try {
        const product = await getProductByColumn("id", productId);
        if (!product) {
            return NextResponse.json(
                { error: "Този продукт не е намерен." },
                { status: 404 },
            );
        }

        if (product.image) {
            await deleteUploadedFile(product.image);
        }

        await deleteProduct(productId);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Cannot delete product" },
            { status: 500 },
        );
    }
}
