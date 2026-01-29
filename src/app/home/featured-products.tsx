import { ProductService } from "@/lib/services/product-service";
import ProductGrid from "@/components/product-grid";
import { getDb } from "@/lib/db";
import { ProductStatus } from "@/lib/types";

const productService = new ProductService(getDb());

export default async function FeaturedProducts() {
    const products = await productService.getItems({
        column: "status",
        value: "active" as ProductStatus,
    });

    return (
        <section>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold text-center py-5 lg:py-10">
                Избрани продукти
            </h2>
            <ProductGrid
                key={"heatured-products"}
                products={products}
                className="container mx-auto mb-5"
            />
        </section>
    );
}
