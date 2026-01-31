"use client";

import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import axios from "axios";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/lib/types";
import AppImage from "@/components/AppImage";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export default function Search() {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [trigger, setTrigger] = useState(0);

    const search = async () => {
        if (!query.trim()) return;

        try {
            setLoading(true);

            const res = await axios.get("/api/products/search", {
                params: {
                    q: query,
                    limit: 8,
                },
            });

            setProducts(res.data);
        } catch (err) {
            console.error("Грешка при търсене", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!query.trim()) {
            setProducts([]);
            return;
        }

        const timeout = setTimeout(() => {
            search();
        }, 400);

        return () => clearTimeout(timeout);
    }, [query, trigger]);

    return (
        <div className="bg-white relative max-w-3xl mx-auto max-md:px-5 mt-5 md:mt-10">
            <div className="flex gap-2 rounded-md">
                <div className="relative w-full">
                    <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

                    <Input
                        placeholder="Търсене на продукти..."
                        className="pl-9"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                setTrigger((t) => t + 1);
                            }
                        }}
                    />
                </div>
            </div>

            {query && (
                <div className="absolute left-0 top-full bg-white mt-5 w-full z-50 rounded-lg border shadow-lg space-y-2 p-2 max-h-96 overflow-y-auto">
                    {loading && (
                        <p className="text-sm text-muted-foreground px-2 py-1">
                            Търсене...
                        </p>
                    )}

                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center gap-3 rounded-lg hover:bg-muted transition cursor-pointer"
                        >
                            {product.image && (
                                <div className="relative w-20 h-20 shrink-0">
                                    <AppImage
                                        src={product.image}
                                        alt={product.name}
                                        fill
                                        className="object-cover rounded w-full h-full"
                                    />
                                </div>
                            )}

                            <div className="flex-1">
                                <p className="font-medium leading-tight">
                                    {product.name}
                                </p>
                                {product.price && (
                                    <p className="text-muted-foreground">
                                        {formatPrice(product.price)}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}

                    {loading && (
                        <div className="p-5">
                            <Loader2 className="text-primary animate-spin" />
                        </div>
                    )}

                    {!loading && products.length === 0 && (
                        <p className="text-sm text-muted-foreground px-2 py-1">
                            Няма намерени продукти
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}