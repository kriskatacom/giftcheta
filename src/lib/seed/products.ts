import Product from "@/models/Product";
import productsData from "@/data/products.json";
import * as cliProgress from "cli-progress";

export async function seedProducts() {
    const progressBar = new cliProgress.SingleBar({
        format: "Продукти  | {bar} | {percentage}% | {value}/{total} Продукта",
        hideCursor: true,
    });

    await Product.sync({ force: true });

    const total = productsData.length;
    progressBar.start(total, 0);

    for (let i = 0; i < total; i++) {
        const item = productsData[i];

        const formattedData: any = {
            id: parseInt(item.id),
            name: item.name,
            slug: item.slug,
            description: item.description,
            shortDescription: item.short_description,
            price: parseFloat(item.price),
            salePrice: item.sale_price ? parseFloat(item.sale_price) : null,
            status: item.status === "active" ? "published" : item.status,
            stockQuantity: parseInt(item.stock_quantity) || 0,
            categoryId: item.category_id ? parseInt(item.category_id) : null,
            image: item.image,
            images:
                typeof item.images === "string"
                    ? JSON.parse(item.images)
                    : item.images,
            isFeatured: item.is_featured === "1",
            sortOrder: parseInt(item.sort_order) || 0,
            createdAt: item.created_at ? new Date(item.created_at) : new Date(),
            updatedAt: item.updated_at ? new Date(item.updated_at) : new Date(),
        };

        try {
            await Product.upsert(formattedData, { logging: false });
        } catch (error) {
            console.error(`\n❌ Грешка при продукт "${item.name}":`, error);
        }

        progressBar.update(i + 1);
    }

    progressBar.stop();
}
