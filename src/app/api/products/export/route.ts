import fs from "fs/promises";
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/product-service";
import { exportProductsWithImagesZip } from "../../lib/exports";

export const runtime = "nodejs";

export async function GET() {
    const products = await getProducts();
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
