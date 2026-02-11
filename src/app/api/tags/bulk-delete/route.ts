import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { TagService } from "@/lib/services/tag-service";

const tagService = new TagService(getDb());

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ids } = body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json(
                { message: "Не са предоставени IDs за изтриване" },
                { status: 400 },
            );
        }

        for (const id of ids) {
            await tagService.deleteItem(Number(id));
        }

        return NextResponse.json({
            success: true,
            deletedIds: ids,
            deletedCount: ids.length,
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при изтриване на таговете" },
            { status: 500 },
        );
    }
}
