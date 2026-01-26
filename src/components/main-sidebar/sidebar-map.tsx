"use client";

import { NavbarItem } from "@/lib/types";
import { SidebarItem } from "./sidebar-item";

type SidebarMapProps = {
    items: NavbarItem[];
    pathname: string;
};

export function SidebarMap({ items, pathname }: SidebarMapProps) {
    return (
        <ul className="flex flex-col gap-1">
            {items.map((item, index) => (
                <SidebarItem
                    key={index}
                    item={item}
                    active={pathname?.includes(item.href || "")}
                />
            ))}
        </ul>
    );
}
