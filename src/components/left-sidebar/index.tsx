"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import PriceFilter from "@/components/left-sidebar/filters/price-filter";
import { useProductStore } from "@/stores/use-product-store";

export default function LeftSidebar() {
    const setPriceRange = useProductStore((s) => s.setPriceRange);
    const { priceBounds, priceRange } = useProductStore();
    const searchParams = useSearchParams();
    const router = useRouter();

    const onPriceChange = (min: number, max: number) => {
        setPriceRange(min, max);

        const params = new URLSearchParams(searchParams.toString());
        params.set("min", String(min));
        params.set("max", String(max));
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    useEffect(() => {
        const min = parseInt(
            searchParams.get("min") || String(priceBounds.min),
            10,
        );
        const max = parseInt(
            searchParams.get("max") || String(priceBounds.max),
            10,
        );
        setPriceRange(min, max);
    }, [searchParams, setPriceRange, priceBounds]);

    return (
        <aside>
            <div className="max-md:px-5 my-5">
                <div className="group relative flex flex-col overflow-hidden rounded-lg border bg-background shadow-sm hover:shadow-md transition-shadow">
                    <ul className="space-y-5">
                        <PriceFilter
                            minPrice={priceBounds.min}
                            maxPrice={priceBounds.max}
                            currentMin={priceRange.min}
                            currentMax={priceRange.max}
                            onChange={onPriceChange}
                        />
                    </ul>
                </div>
            </div>
        </aside>
    );
}