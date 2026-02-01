"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useProductStore } from "@/stores/use-product-store";

export default function LeftSidebarSearch() {
    const { searchQuery, setSearchQuery } = useProductStore();
    const searchParams = useSearchParams();
    const router = useRouter();

    const handleChange = (value: string) => {
        setSearchQuery(value);

        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set("search", value);
        } else {
            params.delete("search");
        }
        router.replace(`?${params.toString()}`, { scroll: false });
    };

    return (
        <li className="border-b p-5 space-y-5">
            <h3 className="text-2xl font-semibold">Търсене</h3>
            <input
                type="text"
                placeholder="Търсене на продукти..."
                value={searchQuery}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
            />
        </li>
    );
}
