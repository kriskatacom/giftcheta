import ProductGrid from "@/components/product-grid";
import { Product } from "@/models";

export default async function HomeNewProducts() {
    const products = await Product.findAll({
        where: { status: "published" },
        order: [["createdAt", "DESC"]],
        limit: 8,
        raw: true,
    });

    return (
        <section>
            <h2 className="text-2xl md:text-3xl lg:text-4xl uppercase font-semibold text-center py-5 lg:py-10">
                Нови продукти
            </h2>
            <ProductGrid
                key={"new-products"}
                filteredProducts={products}
                className="container mx-auto max-sm:px-2 mb-5"
            />
        </section>
    );
}