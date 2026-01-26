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
