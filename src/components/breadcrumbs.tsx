"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";

export type BreadcrumbItem = {
    name: string;
    href?: string;
};

type BreadcrumbsProps = {
    items: BreadcrumbItem[];
    classes?: string;
};

export function Breadcrumbs({ items, classes }: BreadcrumbsProps) {
    if (!items || items.length === 0) return null;

    return (
        <nav
            className={cn(
                "mt-5 px-5 flex items-center flex-wrap space-x-1",
                classes,
            )}
            aria-label="breadcrumbs"
        >
            {items.map((item, index) => {
                const isLast = index === items.length - 1;

                return (
                    <span key={index} className="flex items-center">
                        {item.href && !isLast ? (
                            <Link
                                href={item.href}
                                className="hover:underline text-primary"
                            >
                                {item.name}
                            </Link>
                        ) : (
                            <span
                                className={
                                    isLast ? "font-medium" : "font-normal"
                                }
                                style={{ whiteSpace: "wrap" }}
                            >
                                {item.name}
                            </span>
                        )}

                        {!isLast && <span className="mx-1">/</span>}
                    </span>
                );
            })}
        </nav>
    );
}
