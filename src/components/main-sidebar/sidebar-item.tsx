"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useSidebar } from "./sidebar-context";
import { NavbarItem } from "@/lib/types";

type Props = {
    item: NavbarItem;
    active: boolean;
};

export function SidebarItem({ item, active }: Props) {
    const { collapsed } = useSidebar();
    const Icon = item.icon;

    return (
        <li>
            <Link
                href={`/admin/${item.href}`}
                className={cn(
                    "flex items-center gap-3 rounded-md py-3 px-4 hover:bg-accent hover:text-accent-foreground transition-colors",
                    active && "bg-accent text-accent-foreground",
                )}
            >
                <span className="w-8 flex justify-center shrink-0">
                    {Icon && <Icon className="h-5 w-5 duration-300" />}
                </span>

                <span
                    className={cn(
                        "text-lg font-medium transition-all duration-300 whitespace-nowrap",
                        collapsed
                            ? "opacity-0 -translate-x-4 pointer-events-none w-0"
                            : "opacity-100 translate-x-0",
                    )}
                >
                    {item.label}
                </span>
            </Link>
        </li>
    );
}
