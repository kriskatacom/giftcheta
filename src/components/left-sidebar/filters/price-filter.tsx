"use client";

import { formatPrice } from "@/lib/utils";

type Props = {
    minPrice: number;
    maxPrice: number;
    currentMin: number;
    currentMax: number;
    onChange?: (min: number, max: number) => void;
};

export default function PriceFilter({
    minPrice,
    maxPrice,
    currentMin,
    currentMax,
    onChange,
}: Props) {
    const handleChange = (min: number, max: number) => {
        if (onChange) onChange(min, max);
    };

    return (
        <li className="border-b">
            <h3 className="text-2xl font-semibold p-5">Цена</h3>
            <div className="px-5 pb-6 space-y-4">
                {/* Inputs */}
                <div className="flex items-center gap-3">
                    <input
                        type="number"
                        min={minPrice}
                        max={currentMax}
                        value={currentMin}
                        onChange={(e) =>
                            handleChange(
                                Math.min(Number(e.target.value), currentMax),
                                currentMax,
                            )
                        }
                        className="w-full border rounded-md px-3 py-2"
                    />
                    <span className="text-gray-400">–</span>
                    <input
                        type="number"
                        min={currentMin}
                        max={maxPrice}
                        value={currentMax}
                        onChange={(e) =>
                            handleChange(
                                currentMin,
                                Math.max(Number(e.target.value), currentMin),
                            )
                        }
                        className="w-full border rounded-md px-3 py-2"
                    />
                </div>

                {/* Slider */}
                <div className="relative h-8">
                    <div className="absolute top-1/2 -translate-y-1/2 w-full h-2 rounded-full bg-gray-200" />
                    <div
                        className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-primary"
                        style={{
                            left: `${((currentMin - minPrice) / (maxPrice - minPrice)) * 100}%`,
                            right: `${100 - ((currentMax - minPrice) / (maxPrice - minPrice)) * 100}%`,
                        }}
                    />
                    <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={currentMin}
                        onChange={(e) =>
                            handleChange(
                                Math.min(Number(e.target.value), currentMax),
                                currentMax,
                            )
                        }
                        className="price-range absolute w-full z-20"
                    />
                    <input
                        type="range"
                        min={minPrice}
                        max={maxPrice}
                        value={currentMax}
                        onChange={(e) =>
                            handleChange(
                                currentMin,
                                Math.max(Number(e.target.value), currentMin),
                            )
                        }
                        className="price-range absolute w-full z-30"
                    />
                </div>

                <div className="text-sm text-gray-600">
                    {formatPrice(currentMin)} – {formatPrice(currentMax)}
                </div>
            </div>
        </li>
    );
}
