"use client";

import ProductCard from "@/components/product-card";

const products = [
    {
        image: "/images/product1.jpg",
        title: "Стилна чанта",
        price: 120,
        badge: "Sale",
    },
    {
        image: "/images/product2.jpg",
        title: "Елегантни обувки",
        price: 150,
    },
    {
        image: "/images/product3.jpg",
        title: "Слънчеви очила",
        price: 80,
        badge: "New",
    },
];

type ProductGridProps = {
    className?: string;
};

export default function ProductGrid({ className }: ProductGridProps) {
    return (
        <div className={className}>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product, index) => (
                    <ProductCard
                        key={index}
                        image={product.image}
                        title={product.title}
                        price={product.price}
                        badge={product.badge}
                        onAddToCart={() => alert(`Added ${product.title}`)}
                    />
                ))}
            </div>
        </div>
    );
}
