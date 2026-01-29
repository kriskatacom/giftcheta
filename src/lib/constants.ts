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

import { FiUsers } from "react-icons/fi";
import { IoColorFillSharp, IoSettingsOutline } from "react-icons/io5";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineDashboard } from "react-icons/md";
import { BsCartCheck } from "react-icons/bs";
import { TbCategory } from "react-icons/tb";

export const mainSidebarItems: NavbarItem[] = [
    {
        label: "Табло",
        icon: MdOutlineDashboard,
        href: "/admin/dashboard",
    },
    {
        label: "Потребители",
        icon: FiUsers,
        href: "/admin/users",
    },
    {
        label: "Продукти",
        icon: AiOutlineProduct,
        href: "/admin/products",
    },
    {
        label: "Поръчки",
        icon: BsCartCheck,
        href: "/admin/orders",
    },
    {
        label: "Категории",
        icon: TbCategory,
        href: "/admin/categories",
    },
    {
        label: "Цветове",
        icon: IoColorFillSharp,
        href: "/admin/colors",
    },
    {
        label: "Настройки",
        icon: IoSettingsOutline,
        href: "/admin/settings",
    },
];

export const ALLOWED_IMAGE_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
];

export const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
