import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SizeService } from "@/lib/services/size-service";

const sizeService = new SizeService(getDb());

// CREATE - създаване на нов размер
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, width, height, depth, unit } = body;

        if (!name || width == null || height == null || depth == null) {
            return NextResponse.json(
                { message: "Името и размерите са задължителни" },
                { status: 400 },
            );
        }

        const size = await sizeService.createItem({
            name,
            width: Number(width),
            height: Number(height),
            depth: Number(depth),
            unit: unit || "cm",
        });

        return NextResponse.json({ size }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при създаване на размер" },
            { status: 500 },
        );
    }
}

// UPDATE - редакция на съществуващ размер
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, width, height, depth, unit } = body;

        if (!id) {
            return NextResponse.json({ message: "Липсва ID" }, { status: 400 });
        }

        const updated = await sizeService.updateItem(id, {
            name,
            width: width !== undefined ? Number(width) : undefined,
            height: height !== undefined ? Number(height) : undefined,
            depth: depth !== undefined ? Number(depth) : undefined,
            unit,
        });

        if (!updated) {
            return NextResponse.json(
                { message: "Размерът не е намерен" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при редакция на размер" },
            { status: 500 },
        );
    }
}

// DELETE - изтриване на размер по ID
export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = Number(url.searchParams.get("id"));

        if (!id) {
            return NextResponse.json({ message: "Липсва ID" }, { status: 400 });
        }

        const deleted = await sizeService.deleteItem(id);

        if (!deleted) {
            return NextResponse.json(
                { message: "Размерът не е намерен" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при изтриване на размер" },
            { status: 500 },
        );
    }
}

// GET ALL - всички размери
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const idParam = url.searchParams.get("id");

        // Ако има id, връщаме един размер
        if (idParam) {
            const id = Number(idParam);
            const size = await sizeService.getItemById(id);

            if (!size) {
                return NextResponse.json(
                    { message: "Размерът не е намерен" },
                    { status: 404 },
                );
            }

            return NextResponse.json({ size });
        }

        // Връщаме всички размери
        const sizes = await sizeService.getAllItems();
        return NextResponse.json({ sizes });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при зареждане на размерите" },
            { status: 500 },
        );
    }
}
