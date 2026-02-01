"use client";

import { useProductStore } from "@/stores/use-product-store";
import { Color } from "@/lib/services/color-service";

export default function Colors() {
    const colors = useProductStore((s) => s.colors);
    const selectedColors = useProductStore((s) => s.selectedColors);
    const setSelectedColors = useProductStore((s) => s.setSelectedColors);

    const toggleColor = (color: Color) => {
        const alreadySelected = selectedColors.some((c) => c.id === color.id);
        let newSelection: Color[];
        if (alreadySelected) {
            newSelection = selectedColors.filter((c) => c.id !== color.id);
        } else {
            newSelection = [...selectedColors, color];
        }
        setSelectedColors(newSelection);
    };

    return (
        <li className="border-b p-5 space-y-5">
            <h3 className="text-2xl font-semibold">Цветове</h3>

            <div className="flex flex-wrap gap-2">
                {colors.map((color) => {
                    const isSelected = selectedColors.some(
                        (c) => c.id === color.id,
                    );
                    return (
                        <button
                            key={color.id}
                            onClick={() => toggleColor(color)}
                            title={color.name}
                            style={{ backgroundColor: color.code }}
                            className={`
                                w-8 h-8 rounded-full shadow-black/50 cursor-pointer
                                ${isSelected ? "ring-2 ring-offset-1" : "shadow-sm"}
                                transition-all duration-150
                            `}
                        />
                    );
                })}
            </div>
        </li>
    );
}
