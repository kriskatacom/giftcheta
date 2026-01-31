import ProductGrid from "@/components/product-grid";
import { getDb } from "@/lib/db";
import { ProductService } from "@/lib/services/product-service";

const productService = new ProductService(getDb());

export default async function CategoryProducts() {
    const products = await productService.getItems({
        limit: 8,
    });

    return (
        <section className="container mx-auto max-md:px-5 my-5 md:my-10">
            <ProductGrid products={products} />
        </section>
    );
}