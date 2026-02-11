import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { TagService } from "@/lib/services/tag-service";

const tagService = new TagService(getDb());

// CREATE - създаване на нов таг
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, slug, heading } = body;

        if (!name || !heading) {
            return NextResponse.json(
                { message: "Всички полета със звездичка са задължителни" },
                { status: 400 },
            );
        }

        const tag = await tagService.createItem({
            name,
            slug,
            heading,
        });

        return NextResponse.json({ tag }, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при създаване на таг" },
            { status: 500 },
        );
    }
}

// UPDATE - редакция на съществуващ таг
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, slug, heading } = body;

        if (!id) {
            return NextResponse.json({ message: "Липсва ID" }, { status: 400 });
        }

        const updated = await tagService.updateItem(id, {
            name,
            slug,
            heading,
        });

        if (!updated) {
            return NextResponse.json(
                { message: "тагът не е намерен" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при редакция на таг" },
            { status: 500 },
        );
    }
}

// DELETE - изтриване на таг по ID
export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = Number(url.searchParams.get("id"));

        if (!id) {
            return NextResponse.json({ message: "Липсва ID" }, { status: 400 });
        }

        const deleted = await tagService.deleteItem(id);

        if (!deleted) {
            return NextResponse.json(
                { message: "Тагът не е намерен" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при изтриване на таг" },
            { status: 500 },
        );
    }
}

// GET ALL - всички тагове
export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const idParam = url.searchParams.get("id");

        // Ако има id, връщаме един таг
        if (idParam) {
            const id = Number(idParam);
            const tag = await tagService.getItemById(id);

            if (!tag) {
                return NextResponse.json(
                    { message: "Тагът не е намерен" },
                    { status: 404 },
                );
            }

            return NextResponse.json({ tag });
        }

        // Връщаме всички тагове
        const tags = await tagService.getAllItems();
        return NextResponse.json({ tags });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при зареждане на тагите" },
            { status: 500 },
        );
    }
}
