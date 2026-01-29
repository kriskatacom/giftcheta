import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { ColorService } from "@/lib/services/color-service";

const colorService = new ColorService(getDb());

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { message: "Не са подадени ID-та за изтриване" },
                { status: 400 },
            );
        }

        for (const id of ids) {
            await colorService.deleteColor(Number(id));
        }

        return NextResponse.json({
            success: true,
            deletedIds: ids,
            deletedCount: ids.length,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при масово изтриване на цветове" },
            { status: 500 },
        );
    }
}
