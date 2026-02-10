"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

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
    const activeFiltersCount = useProductStore((s) =>
        s.getActiveFiltersCount(),
    );
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);

        toggleSidebar();

        setLoading(false);
    };

    return (
        <div className="mt-5 flex items-center justify-between">
            <Button
                variant="outline"
                size="lg"
                onClick={handleClick}
                className="relative flex items-center gap-2"
                disabled={loading}
            >
                <span className="text-base flex items-center gap-2">
                    {loading ? (
                        <>
                            <Loader2 className="repeat-infinite animate-spin" />{" "}
                            <span>Зареждане...</span>
                        </>
                    ) : (
                        "Филтриране"
                    )}
                </span>

                {activeFiltersCount > 0 && !loading && (
                    <Badge className="absolute -right-2 -top-2 h-6 min-w-6 rounded-full px-1 text-xs">
                        {activeFiltersCount}
                    </Badge>
                )}
            </Button>

            <div className="text-muted-foreground">
                <span className="md:block hidden">
                    Показване на {products.length} продукта
                </span>
                <span className="md:hidden block">
                    {products.length} продукта
                </span>
            </div>
        </div>
    );
}
