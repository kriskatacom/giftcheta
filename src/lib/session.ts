// @/lib/session.ts
import { cookies } from "next/headers";

export interface UserOrderData {
    fullname: string;
    email: string;
    address: string;
    phone: string;
    allow_marketing?: boolean;
    is_priority?: boolean;
}

const COOKIE_NAME = "giftcheta";

export async function saveUserDataToSession(data: UserOrderData) {
    const cookieStore = await cookies();

    cookieStore.set(COOKIE_NAME, JSON.stringify(data), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
    });
}

export async function getUserDataFromSession(): Promise<
    UserOrderData | undefined
> {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(COOKIE_NAME);
    if (!cookie) return undefined;

    try {
        return JSON.parse(cookie.value) as UserOrderData;
    } catch {
        return undefined;
    }
}

export async function clearUserDataFromSession() {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}