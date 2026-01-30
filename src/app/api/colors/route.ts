import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ColorService } from "@/lib/services/color-service";

const colorService = new ColorService(getDb());

// CREATE
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, code } = body;

        if (!name || !code) {
            return NextResponse.json(
                { message: "Името и кодът са задължителни" },
                { status: 400 },
            );
        }

        const color = await colorService.createItem({
            name,
            code,
        });

        return NextResponse.json({ color }, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при създаване на цвят" },
            { status: 500 },
        );
    }
}

// UPDATE
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, name, code, sort_order } = body;

        if (!id) {
            return NextResponse.json({ message: "Липсва ID" }, { status: 400 });
        }

        const updated = await colorService.updateItem(id, {
            name,
            code,
            sort_order,
        });

        if (!updated) {
            return NextResponse.json(
                { message: "Цветът не е намерен" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при редакция на цвят" },
            { status: 500 },
        );
    }
}

// GET ALL – всички цветове
export async function GET() {
    try {
        const colors = await colorService.getAllItems();
        return NextResponse.json({ colors });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при зареждане на цветовете" },
            { status: 500 },
        );
    }
}

// DELETE – изтриване на цвят по ID (?id=123)
export async function DELETE(req: Request) {
    try {
        const url = new URL(req.url);
        const id = Number(url.searchParams.get("id"));

        if (!id) {
            return NextResponse.json({ message: "Липсва ID" }, { status: 400 });
        }

        const deleted = await colorService.deleteItem(id);

        if (!deleted) {
            return NextResponse.json(
                { message: "Цветът не е намерен" },
                { status: 404 },
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при изтриване на цвят" },
            { status: 500 },
        );
    }
}
