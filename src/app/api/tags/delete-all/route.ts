import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { TagService } from "@/lib/services/tag-service";

const tagService = new TagService(getDb());

export async function DELETE(req: NextRequest) {
    try {
        const body = await req.json();
        const withTruncate = Boolean(body?.with_truncate);

        const deletedCount = await tagService.deleteAllItems(withTruncate);

        return NextResponse.json(
            {
                success: true,
                deletedCount,
                truncated: withTruncate,
            },
            { status: 200 },
        );
    } catch (err: any) {
        console.error("API error:", err);

        return NextResponse.json(
            {
                success: false,
                error: "Сървърна грешка.",
            },
            { status: 500 },
        );
    }
}
