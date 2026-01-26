import { NavbarItem } from "@/lib/types";

export const MAIN_NAVBAR_ITEMS: NavbarItem[] = [
    {
        label: "Начало",
        href: "/",
    },
    {
        label: "За нас",
        href: "/about-us",
    },
    {
        label: "Продукти",
        href: "/products",
    },
    {
        label: "Контакти",
        href: "/contacts",
    },
];

export const NAVBAR_ICON_SIZES = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
} as const;

export const LOGO: string = "/images/giftcheta-logo.png";
export const WEBSITE_NAME: string = "GIFTCHETA.COM";
