import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sequelize";
import User from "@/models/User";
import usersData from "@/data/users.json";

export async function POST(req: NextRequest) {
    try {
        await db.authenticate();
        await db.sync({ force: true });

        await User.bulkCreate(usersData);

        return NextResponse.json({
            message: "✅ Моделът беше обновен без загуба на данни!",
        });
    } catch (err) {
        return NextResponse.json(
            { error: (err as Error).message },
            { status: 500 },
        );
    }
}