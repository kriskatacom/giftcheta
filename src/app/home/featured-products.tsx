import ProductGrid from "@/components/product-grid";

export default function FeaturedProducts() {
    return (
        <section>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center py-5 lg:py-10">
                Избрани продукти
            </h2>
            <ProductGrid key={"heatured-products"} className="container mx-auto" />
        </section>
    );
}