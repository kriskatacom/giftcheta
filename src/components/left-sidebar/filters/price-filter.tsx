"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { useProductStore } from "@/stores/use-product-store";

export default function PriceFilter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const { priceBounds, priceRange, setPriceRange } = useProductStore();

    const { min: minPrice, max: maxPrice } = priceBounds;
    const { min: storeMin, max: storeMax } = priceRange;

    const [minInput, setMinInput] = useState(storeMin);
    const [maxInput, setMaxInput] = useState(storeMax);

    useEffect(() => {
        const min = searchParams.get("min");
        const max = searchParams.get("max");

        if (min || max) {
            const safeMin = min ? Number(min) : minPrice;
            const safeMax = max ? Number(max) : maxPrice;

            setMinInput(safeMin);
            setMaxInput(safeMax);
            setPriceRange(safeMin, safeMax);
        }
    }, []);

    useEffect(() => {
        setMinInput(storeMin);
        setMaxInput(storeMax);
    }, [storeMin, storeMax]);

    const update = (min: number, max: number) => {
        const safeMin = Math.max(Math.min(min, max), minPrice);
        const safeMax = Math.min(Math.max(min, max), maxPrice);

        setMinInput(safeMin);
        setMaxInput(safeMax);

        setPriceRange(safeMin, safeMax);

        const params = new URLSearchParams(searchParams.toString());
        params.set("min", String(safeMin));
        params.set("max", String(safeMax));
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <li className="border-b p-5 space-y-5">
            <h3 className="text-2xl font-semibold">Цена</h3>

            <div className="flex items-center gap-3">
                <input
                    type="number"
                    min={minPrice}
                    max={maxInput}
                    value={minInput}
                    onChange={(e) => update(Number(e.target.value), maxInput)}
                    className="w-full border rounded-md px-3 py-2"
                />
                <span className="text-gray-400">–</span>
                <input
                    type="number"
                    min={minInput}
                    max={maxPrice}
                    value={maxInput}
                    onChange={(e) => update(minInput, Number(e.target.value))}
                    className="w-full border rounded-md px-3 py-2"
                />
            </div>

            <div className="relative h-8">
                <div className="absolute inset-y-1/2 -translate-y-1/2 w-full h-2 bg-gray-200 rounded" />
                <div
                    className="absolute inset-y-1/2 -translate-y-1/2 h-2 bg-primary rounded"
                    style={{
                        left: `${((minInput - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        right: `${100 - ((maxInput - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    }}
                />
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={minInput}
                    onChange={(e) => update(Number(e.target.value), maxInput)}
                    className="price-range absolute w-full z-20"
                />
                <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={maxInput}
                    onChange={(e) => update(minInput, Number(e.target.value))}
                    className="price-range absolute w-full z-30"
                />
            </div>

            <div className="text-sm text-gray-600">
                {formatPrice(minInput)} – {formatPrice(maxInput)}
            </div>
        </li>
    );
}