import fs from "fs/promises";
import path from "path";
import * as XLSX from "xlsx";
import archiver from "archiver";
import { existsSync } from "fs";
import { NextResponse } from "next/server";

function capitalize(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function safeName(name: string) {
    return name.replace(/[\/\\:*?"<>|]/g, "").trim();
}

export async function exportProductsToExcel(rows: any[]) {
    if (!rows.length) return null;

    const excelData = rows.map((row: any) => {
        const transformed: any = {};

        for (const key of Object.keys(row)) {
            transformed[capitalize(key)] = row[key];
        }

        return transformed;
    });

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

    const excelBuffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
    });

    const exportRoot = "/tmp/exports";
    const imagesRoot = path.join(exportRoot, "images");

    await fs.mkdir(imagesRoot, { recursive: true });

    for (const product of rows) {
        if (!product.name) continue;

        const productDir = path.join(imagesRoot, safeName(product.name));
        await fs.mkdir(productDir, { recursive: true });

        if (product.image) {
            await copyImage(product.image, productDir);
        }

        if (product.images) {
            try {
                const images: string[] = Array.isArray(product.images)
                    ? product.images
                    : [];
                
                for (const img of images) {
                    await copyImage(img, productDir);
                }
            } catch {}
        }
    }

    return {
        excelBuffer,
        imagesPath: imagesRoot,
    };
}

export async function exportProductsWithImagesZip(rows: any[]) {
    if (!rows.length) return null;

    const result = await exportProductsToExcel(rows);

    if (!result) {
        return NextResponse.json(
            { message: "Няма данни за експорт" },
            { status: 404 },
        );
    }

    const { excelBuffer } = result;

    const zipPath = `/tmp/products.zip`;

    const output = await fs.open(zipPath, "w");
    const archive = archiver("zip", { zlib: { level: 9 } });

    archive.on("error", (err) => {
        throw err;
    });

    archive.pipe(output.createWriteStream());

    archive.append(excelBuffer, { name: "products.xlsx" });

    for (const product of rows) {
        if (!product.name) continue;

        const folderName = safeName(product.name);

        if (product.image) {
            const imagePath = path.join(process.cwd(), "public", product.image);
            if (existsSync(imagePath)) {
                archive.file(imagePath, {
                    name: `Изображения/${folderName}/${path.basename(imagePath)}`,
                });
            } else {
                console.warn("Single image not found:", imagePath);
            }
        }

        if (product.images) {
            try {
                const images: string[] = Array.isArray(product.images)
                    ? product.images
                    : [];
                
                if (Array.isArray(images)) {
                    for (const img of images) {
                        const imgPath = path.join(process.cwd(), "public", img);
                        if (existsSync(imgPath)) {
                            archive.file(imgPath, {
                                name: `Изображения/${folderName}/${path.basename(imgPath)}`,
                            });
                        } else {
                            console.warn("Multi image not found:", imgPath);
                        }
                    }
                }
            } catch {
                console.warn("Invalid JSON in product.images:", product.images);
            }
        }
    }

    await archive.finalize();

    return zipPath;
}

async function copyImage(imagePath: string, targetDir: string) {
    try {
        const fileName = path.basename(imagePath);
        const destination = path.join(targetDir, fileName);

        await fs.copyFile(imagePath, destination);
    } catch {}
}
