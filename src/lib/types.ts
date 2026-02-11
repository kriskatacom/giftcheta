import { IconType } from "react-icons";
import { Color } from "@/lib/services/color-service";
import { Size } from "@/lib/services/size-service";
import { Tag } from "@/lib/services/tag-service";

export type IconSize = "sm" | "md" | "lg";

export type NavbarItem = {
    label: string;
    href: string;
    icon?: IconType;
};

export type ProductStatus = "active" | "inactive" | "draft";

export interface Product {
    id: number;
    name: string;
    slug?: string;
    description?: string;
    short_description?: string;
    price?: number;
    sale_price?: number | null;
    stock_quantity?: number;
    is_featured?: boolean;
    status?: ProductStatus;
    category_id?: number;
    sizes?: Size[];
    size_ids?: number[];
    colors?: Color[];
    color_ids?: number[];
    tag_ids?: number[];
    tags?: Tag[];
    images?: string;
    image?: string;
    created_at?: string;
    updated_at?: string;
}
