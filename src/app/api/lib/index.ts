import path from "path";
import fsPromises from "fs/promises";

export async function saveUploadedFile(file: File, byDate: boolean = true) {
    if (!file) throw new Error("Няма файл");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let uploadDir = path.join(process.cwd(), "public/uploads");

    if (byDate) {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        uploadDir = path.join(uploadDir, year.toString(), month, day);
    }

    // Създаваме директорията, ако не съществува
    await fsPromises.mkdir(uploadDir, { recursive: true });

    const ext = path.extname(file.name);
    const baseName = path.parse(file.name).name;

    let fileName = `${baseName}${ext}`;
    let filePath = path.join(uploadDir, fileName);

    // 👇 проверка за съществуващ файл и добавяне на -1, -2 и т.н.
    let counter = 1;
    while (true) {
        try {
            await fsPromises.access(filePath); // проверява дали файлът съществува
            // Ако съществува, генерираме ново име
            fileName = `${baseName}-${counter}${ext}`;
            filePath = path.join(uploadDir, fileName);
            counter++;
        } catch {
            // Ако файлът не съществува, можем да го използваме
            break;
        }
    }

    await fsPromises.writeFile(filePath, buffer);

    // Връщаме URL относително към /public
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