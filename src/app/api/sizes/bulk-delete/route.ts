import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { SizeService } from "@/lib/services/size-service";

const sizeService = new SizeService(getDb());

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
            await sizeService.deleteSize(Number(id));
        }

        return NextResponse.json({ success: true, deletedIds: ids });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { message: "Грешка при изтриване на размерите" },
            { status: 500 },
        );
    }
}
