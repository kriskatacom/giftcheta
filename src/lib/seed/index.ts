import db from "@/lib/sequelize";
import { seedCategories } from "@/lib/seed/categories";
import { seedColors } from "@/lib/seed/colors";
import { seedSizes } from "@/lib/seed/sizes";
import { seedTags } from "@/lib/seed/tags";
import { seedProducts } from "@/lib/seed/products";

async function runSeed() {
    try {
        console.log("🚀 Стартиране на Database Seed...");

        await db.authenticate();
        console.log("📡 Връзката с БД е стабилна.");

        await seedCategories();
        await seedColors();
        await seedSizes();
        await seedTags();
        await seedProducts();
        console.log("🏁 Всички сийдъри приключиха успешно!");
    } catch (error) {
        console.error("❌ ГРЕШКА по време на сийдване:", error);
        process.exit(1);
    } finally {
        await db.close();
    }
}

runSeed();
