import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/sequelize";
import { User, Category, Product, Size, Tag, Color } from "@/models";

// Импорт на данни
import usersData from "@/data/users.json";
import categoriesData from "@/data/categories.json";
import productsData from "@/data/products.json";
import sizesData from "@/data/sizes.json";
import tagsData from "@/data/tags.json";
import colorsData from "@/data/colors.json";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { tables } = body;

        await db.query('SET FOREIGN_KEY_CHECKS = 0');

        if (!tables || !Array.isArray(tables)) {
            return NextResponse.json(
                { error: "Моля, подайте масив от таблици в полето 'tables'" },
                { status: 400 },
            );
        }

        await db.authenticate();
        const results = [];

        // 1. Потребители
        if (tables.includes("users")) {
            await User.sync({ force: true });
            await User.bulkCreate(usersData, { individualHooks: true });
            results.push("Users");
        }

        // 2. Категории
        if (tables.includes("categories")) {
            await Category.sync({ force: true });
            await Category.bulkCreate(categoriesData);
            results.push("Categories");
        }

        // 3. Тагове
        if (tables.includes("tags")) {
            await Tag.sync({ force: true });
            await Tag.bulkCreate(tagsData);
            results.push("Tags");
        }

        // 4. Цветове
        if (tables.includes("colors")) {
            await Color.sync({ force: true });
            await Color.bulkCreate(colorsData);
            results.push("Colors");
        }

        // 5. Размери
        if (tables.includes("sizes")) {
            await Size.sync({ force: true });
            await Size.bulkCreate(sizesData);
            results.push("Sizes");
        }

        // 6. Продукти (Винаги след категориите!)
        if (tables.includes("products")) {
            await Product.sync({ force: true });

            // Мапваме данните от JSON към интерфейса на модела
            const formattedProducts = productsData.map((p: any) => ({
                id: p.id ? Number(p.id) : undefined,
                name: p.name,
                slug: p.slug,
                description: p.description,
                shortDescription: p.short_description, // от snake_case към camelCase
                price: parseFloat(p.price), // от string към number
                salePrice: p.sale_price ? parseFloat(p.sale_price) : null,
                status: p.status,
                stockQuantity: parseInt(p.stock_quantity) || 0,
                categoryId: p.category_id ? Number(p.category_id) : 0,
                image: p.image,
                isFeatured: Boolean(p.is_featured),
                sortOrder: parseInt(p.sort_order) || 0,
            }));

            // Сега TypeScript ще е доволен, защото типовете съвпадат
            await Product.bulkCreate(formattedProducts as any);
            results.push("Products");
        }

        await db.query('SET FOREIGN_KEY_CHECKS = 1');

        return NextResponse.json({
            message: `✅ Успешно синхронизирани: ${results.join(", ")}`,
        });
    } catch (err) {
        console.error("Setup Error:", err);
        return NextResponse.json(
            { error: (err as Error).message },
            { status: 500 },
        );
    }
}
