import { NextResponse } from "next/server";
import {
    saveUserDataToSession,
    getUserDataFromSession,
    clearUserDataFromSession,
} from "@/lib/session";

export async function POST(req: Request) {
    const body = await req.json();

    await saveUserDataToSession(body);

    const data = await getUserDataFromSession();
    console.log(data);

    return NextResponse.json({ ok: true });
}

export async function GET() {
    const data = await getUserDataFromSession();

    return NextResponse.json({ data });
}

export async function DELETE() {
    await clearUserDataFromSession();

    return NextResponse.json({ ok: true });
}
