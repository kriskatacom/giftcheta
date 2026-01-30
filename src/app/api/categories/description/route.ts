import { NextRequest, NextResponse } from "next/server";
import { categoryDescriptionSchema } from "@/app/admin/categories/[id]/description-form/schema";
import { CategoryService } from "@/lib/services/category-service";
import { getDb } from "@/lib/db";

const categoryService = new CategoryService(getDb());

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        
        const parsed = categoryDescriptionSchema.safeParse(body);

        if (!parsed.success) {
            const errors: Record<string, string> = {};
            parsed.error.issues.forEach((issue) => {
                errors[issue.path[0] as string] = issue.message;
            });

            return NextResponse.json(
                { success: false, errors },
                { status: 400 },
            );
        }

        const { id, ...data } = parsed.data;

        if (!id) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Липсва ID на категорията",
                },
                { status: 400 },
            );
        }

        const category = await categoryService.updateItem(id, data);

        return NextResponse.json(
            {
                success: true,
                category,
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
