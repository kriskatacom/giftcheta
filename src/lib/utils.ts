import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FormatPriceOptions = {
    currency?: string;
    locale?: string;
    symbolPosition?: "start" | "end";
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
};

export const websiteName = (prefix: string = "") => {
    const websiteName = "Аз Мигрантът";
    return prefix ? `${prefix} - ${websiteName}` : websiteName;
};

export function formatPrice(
    price: number | string,
    options: FormatPriceOptions = {},
) {
    const {
        currency = "EUR",
        locale = "bg-BG",
        symbolPosition = "start",
        minimumFractionDigits = 2,
        maximumFractionDigits = 2,
    } = options;

    const value = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(value)) return "";

    const formattedNumber = new Intl.NumberFormat(locale, {
        style: "decimal",
        minimumFractionDigits,
        maximumFractionDigits,
    }).format(value);

    const currencySymbols: Record<string, string> = {
        EUR: "€",
        USD: "$",
        GBP: "£",
        BGN: "лв.",
    };
    const symbol = currencySymbols[currency.toUpperCase()] ?? currency;

    return symbolPosition === "start"
        ? `${symbol} ${formattedNumber}`
        : `${formattedNumber} ${symbol}`;
}

export function slugify(text: string): string {
    const map: Record<string, string> = {
        а: "a",
        б: "b",
        в: "v",
        г: "g",
        д: "d",
        е: "e",
        ж: "zh",
        з: "z",
        и: "i",
        й: "y",
        к: "k",
        л: "l",
        м: "m",
        н: "n",
        о: "o",
        п: "p",
        р: "r",
        с: "s",
        т: "t",
        у: "u",
        ф: "f",
        х: "h",
        ц: "ts",
        ч: "ch",
        ш: "sh",
        щ: "sht",
        ъ: "a",
        ь: "",
        ю: "yu",
        я: "ya",
    };

    return text
        .toLowerCase()
        .split("")
        .map((char) => map[char] ?? char)
        .join("")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

export function getFullUrl(path: string = ""): string {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://giftcheta.com");

    const cleanPath = path.startsWith("/") ? path : `/${path}`;

    return `${baseUrl}${cleanPath}`;
}