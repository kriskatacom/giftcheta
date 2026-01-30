import { CategoryService } from "@/lib/services/category-service";
import { getDb } from "@/lib/db";
import CategoryCards from "@/components/category-cards";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const categoryService = new CategoryService(getDb());

export default async function HomeCategories() {
    const categories = await categoryService.getAllItems(null, { limit: 4 });

    return (
        <section>
            <h2 className="text-2xl md:text-3xl lg:text-4xl uppercase font-semibold text-center py-5 lg:py-10">
                Категории
            </h2>

            <div className="container mx-auto max-sm:px-2 mb-5">
                <CategoryCards categories={categories} />

                <div className="flex justify-center mt-5">
                    <Link
                        href={`/categories`}
                        title="Преглед на всички категории"
                        className="py-3 px-5 text-lg font-semibold rounded-md text-white bg-primary hover:bg-primary/50 duration-300"
                    >
                        Всички категории
                    </Link>
                </div>
            </div>
        </section>
    );
}
