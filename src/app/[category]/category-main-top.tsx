"use client";

import { ListFilterPlusIcon } from "lucide-react";

import { Product } from "@/lib/types";
import { useFiltersSidebarStore } from "@/stores/use-filters-sidebar";
import { useProductStore } from "@/stores/use-product-store";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Props = {
    products: Product[];
};

export default function CategoryMainTop({ products }: Props) {
    const toggleSidebar = useFiltersSidebarStore((s) => s.toggleSidebar);
    const activeFiltersCount = useProductStore((s) => s.getActiveFiltersCount());

    return (
        <div className="mt-5 flex items-center justify-between">
            <Button
                variant="outline"
                size="lg"
                onClick={toggleSidebar}
                className="relative flex items-center gap-2"
            >
                <ListFilterPlusIcon className="h-5 w-5" />
                <span className="text-base">Филтриране</span>

                {activeFiltersCount > 0 && (
                    <Badge className="absolute -right-2 -top-2 h-6 min-w-6 rounded-full px-1 text-xs">
                        {activeFiltersCount}
                    </Badge>
                )}
            </Button>

            <div className="text-muted-foreground">
                Показване на {products.length} продукта
            </div>
        </div>
    );
}
