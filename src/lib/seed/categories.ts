import Category from "@/models/Category";
import categoriesData from "@/data/categories.json";
import * as cliProgress from "cli-progress";

export async function seedCategories() {
    const progressBar = new cliProgress.SingleBar({
        format: "Прогрес | {bar} | {percentage}% | {value}/{total} Категории",
    });

    const total = categoriesData.length;
    progressBar.start(total, 0);

    for (let i = 0; i < total; i++) {
        await Category.upsert(categoriesData[i], { logging: false });
        progressBar.update(i + 1);
    }

    progressBar.stop();
}
