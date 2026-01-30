import { ProductService } from "@/lib/services/product-service";
import ProductGrid from "@/components/product-grid";
import { getDb } from "@/lib/db";
import { ProductStatus } from "@/lib/types";

const productService = new ProductService(getDb());

export default async function HomeNewProducts() {
    const products = await productService.getItems({
        column: "status",
        value: "active" as ProductStatus,
        order_by: "created_at",
        limit: 8,
    });

    return (
        <section>
            <h2 className="text-2xl md:text-3xl lg:text-4xl uppercase font-semibold text-center py-5 lg:py-10">
                Нови продукти
            </h2>
            <ProductGrid
                key={"new-products"}
                products={products}
                className="container mx-auto max-sm:px-2 mb-5"
            />
        </section>
    );
}
