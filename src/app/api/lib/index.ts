import path from "path";
import fsPromises from "fs/promises";
import { ALLOWED_EXTENSIONS, ALLOWED_IMAGE_TYPES } from "@/lib/constants";

export async function saveUploadedFile(file: File, baseName: string = "", byDate = true) {
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return;
    }

    const ext = path.extname(file.name).toLowerCase();

    if (!ALLOWED_EXTENSIONS.includes(ext)) {
        return;
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let uploadDir = path.join(process.cwd(), "public/uploads");

    if (byDate) {
        const now = new Date();
        uploadDir = path.join(
            uploadDir,
            now.getFullYear().toString(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        );
    }

    await fsPromises.mkdir(uploadDir, { recursive: true });

    if (!baseName) {
        baseName = path.parse(file.name).name.replace(/[^a-z0-9-_]/gi, "_");
    }

    let fileName = `${baseName}${ext}`;
    let filePath = path.join(uploadDir, fileName);

    let counter = 1;
    while (true) {
        try {
            await fsPromises.access(filePath);
            fileName = `${baseName}-${counter}${ext}`;
            filePath = path.join(uploadDir, fileName);
            counter++;
        } catch {
            break;
        }
    }

    await fsPromises.writeFile(filePath, buffer);

    const relativePath = path
        .relative(path.join(process.cwd(), "public"), filePath)
        .replace(/\\/g, "/");

    return `/${relativePath}`;
}

export async function deleteUploadedFile(fileUrl: string) {
    if (!fileUrl) return;

    const relativePath = fileUrl.startsWith("/") ? fileUrl.slice(1) : fileUrl;

    const filePath = path.join(process.cwd(), "public", relativePath);

    try {
        return await fsPromises.unlink(filePath);
    } catch (err: any) {
        if (err.code === "ENOENT") {
            console.warn(`Файлът не съществува: ${filePath}`);
        } else {
            console.error(`Грешка при изтриване:`, err);
            throw err;
        }
    }
}

export async function getTodayFolder(baseDir: string) {
    const today = new Date();
    const year = today.getFullYear().toString();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const folder = path.join(baseDir, year, month, day);
    await fsPromises.mkdir(folder, { recursive: true });

    return { folder, year, month, day };
}