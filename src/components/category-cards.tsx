import { Category } from "@/lib/services/category-service";
import Link from "next/link";

interface CategoryCardsProps {
    categories: Category[];
}

export default function CategoryCards({ categories }: CategoryCardsProps) {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 lg:gap-5">
            {categories.map((category) => (
                <Link
                    href={`/${category.slug}`}
                    key={category.id}
                    className="cursor-pointer rounded-md lg:rounded-xl border border-gray-200 bg-white p-3 lg:p-5 shadow-sm transition hover:shadow-md hover:-translate-y-1"
                >
                    <h3 className="font-semibold text-gray-900 mb-2">
                        {category.heading || category.name}
                    </h3>

                    {category.excerpt && (
                        <p className="text-sm text-gray-600 leading-relaxed">
                            {category.excerpt}
                        </p>
                    )}
                </Link>
            ))}
        </div>
    );
}