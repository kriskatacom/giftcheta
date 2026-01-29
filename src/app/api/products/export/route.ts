import fs from "fs/promises";
import { NextResponse } from "next/server";
import { exportProductsWithImagesZip } from "@/app/api/lib/exports";
import { ProductService } from "@/lib/services/product-service";
import { getDb } from "@/lib/db";

export const runtime = "nodejs";

const productService = new ProductService(getDb());

export async function GET() {
    const products = await productService.getItems();
    if (!products?.length)
        return NextResponse.json({ message: "Няма данни за експорт" }, { status: 404 });

    const zipPath = await exportProductsWithImagesZip(products);

    const buffer = await fs.readFile(zipPath as string);

    return new NextResponse(buffer, {
        headers: {
            "Content-Type": "application/zip",
            "Content-Disposition": 'attachment; filename="products.zip"',
        },
    });
}
