"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FaTimes } from "react-icons/fa";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import { useFiltersSidebarStore } from "@/stores/use-filters-sidebar";
import { useProductStore } from "@/stores/use-product-store";

import PriceFilter from "@/components/left-sidebar/filters/price-filter";
import LeftSidebarSearch from "@/components/left-sidebar/filters/search";
import Colors from "@/components/left-sidebar/filters/colors";
import Sizes from "@/components/left-sidebar/filters/sizes";

export default function LeftSidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { open, closeSidebar } = useFiltersSidebarStore();
    const resetFilters = useProductStore((s) => s.resetFilters);
    const activeFiltersCount = useProductStore((s) =>
        s.getActiveFiltersCount(),
    );

    const handleReset = () => {
        resetFilters();

        closeSidebar();

        const params = new URLSearchParams(searchParams.toString());
        params.delete("min");
        params.delete("max");
        params.delete("search");

        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <Sheet open={open} onOpenChange={(v) => !v && closeSidebar()}>
            <SheetContent
                side="left"
                className="w-[320px] sm:w-90 p-0"
                onOpenAutoFocus={(e) => e.preventDefault()}
            >
                <SheetHeader className="p-5 border-b flex flex-row items-center justify-between">
                    <SheetTitle>Филтри</SheetTitle>
                </SheetHeader>

                <div className="overflow-y-auto h-full">
                    <ul>
                        <LeftSidebarSearch />
                        <PriceFilter />
                        <Colors />
                        <Sizes />
                    </ul>
                    {activeFiltersCount > 0 && (
                        <div className="p-5">
                            <Button
                                className="w-full text-base"
                                variant="outline"
                                size={"lg"}
                                onClick={handleReset}
                            >
                                <FaTimes />
                                <span>Изчистване</span>
                            </Button>
                        </div>
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
}