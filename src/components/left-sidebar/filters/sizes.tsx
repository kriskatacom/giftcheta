"use client";

import { Size } from "@/lib/services/size-service";
import { useProductStore } from "@/stores/use-product-store";

export default function Sizes() {
    const sizes = useProductStore((s) => s.sizes);
    const selectedSizes = useProductStore((s) => s.selectedSizes);
    const setSelectedSizes = useProductStore((s) => s.setSelectedSizes);

    const toggleSize = (size: Size) => {
        const alreadySelected = selectedSizes.some((s) => s.id === size.id);
        const newSelection = alreadySelected
            ? selectedSizes.filter((s) => s.id !== size.id)
            : [...selectedSizes, size];
        setSelectedSizes(newSelection);
    };

    const sortedSizes = [...sizes].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    return (
        <li className="border-b p-5 space-y-5">
            <h3 className="text-2xl font-semibold">Размери</h3>

            <div className="flex flex-wrap gap-2">
                {sortedSizes.map((size) => {
                    const isSelected = selectedSizes.some((s) => s.id === size.id);
                    return (
                        <button
                            key={size.id}
                            onClick={() => toggleSize(size)}
                            title={`${size.width}×${size.height}×${size.depth} ${size.unit}`}
                            className={`
                                px-3 py-1 rounded-md border cursor-pointer
                                ${isSelected ? "bg-primary text-white" : "bg-gray-100 text-gray-700"}
                                transition-all duration-150
                            `}
                        >
                            {`${size.width}×${size.height}×${size.depth} ${size.unit}`}
                        </button>
                    );
                })}
            </div>
        </li>
    );
}