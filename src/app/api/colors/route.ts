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

        const color = await colorService.createColor({
            name,
            code,
        });

        return NextResponse.json(color, { status: 201 });
    } catch (error: any) {
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

        const updated = await colorService.updateColor(id, {
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
    } catch (error: any) {
        console.error(error);

        return NextResponse.json(
            { message: "Грешка при редакция на цвят" },
            { status: 500 },
        );
    }
}
