import { IconType } from "react-icons";

export type IconSize = "sm" | "md" | "lg";

export type NavbarItem = {
    label: string;
    href: string;
    icon?: IconType;
};

export interface Product {
    id: number;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    price: number;
    sale_price: number | null;
    stock_quantity?: number;
    is_active?: boolean;
    category_id?: number;
    tags?: string;
    images?: string;
    image?: string;
    created_at?: string;
    updated_at?: string;
}