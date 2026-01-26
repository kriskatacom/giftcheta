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
    shortDescription?: string;
    price: number;
    oldPrice?: number;
    currency?: "EUR" | "USD" | "BGN";
    stockQuantity?: number;
    isActive?: boolean;
    categoryId?: number;
    tags?: string[];
    images?: string[];
    createdAt?: string;
    updatedAt?: string;
}