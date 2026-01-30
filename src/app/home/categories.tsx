import { CategoryService } from "@/lib/services/category-service";
import { getDb } from "@/lib/db";
import CategoryCards from "@/components/category-cards";

const categoryService = new CategoryService(getDb());

export default async function HomeCategories() {
    const categories = await categoryService.getAllItems();

    return (
        <section>
            <h2 className="text-2xl md:text-3xl lg:text-4xl uppercase font-semibold text-center py-5 lg:py-10">
                Категории
            </h2>
            <div className="container mx-auto max-sm:px-2 mb-5">
                <CategoryCards categories={categories} />
            </div>
        </section>
    );
}