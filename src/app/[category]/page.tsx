import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { CategoryService } from "@/lib/services/category-service";
import MainNavbar from "@/components/main-navbar";
import Search from "@/app/[category]/search";
import Hero from "@/app/[category]/hero";
import CategoryProducts from "@/app/[category]/category-products";
import { getFullUrl, websiteName } from "@/lib/utils";
import LeftSidebar from "@/components/left-sidebar";
import { ProductService } from "@/lib/services/product-service";

type Props = {
    params: Promise<{
        category: string;
    }>;
};

const categoryService = new CategoryService(getDb());
const productService = new ProductService(getDb());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const categoryService = new CategoryService(getDb());
    const categorySlug = (await params).category;

    const category = await categoryService.getItemByColumn(
        "slug",
        categorySlug,
    );

    if (!category) {
        return {
            title: "Категория не намерена",
            description: "Категорията не съществува",
        };
    }

    return {
        title: websiteName(category.name),
        description: category.excerpt,
        applicationName: websiteName(),
        authors: [
            {
                name: "Кристиан Костадинов",
                url: "https://kriskata.com",
            },
        ],
        alternates: {
            canonical: `/${category.slug}`,
        },
        openGraph: {
            title: websiteName(category.name),
            description: category.excerpt,
            images: category.image ? [{ url: getFullUrl(category.image) }] : [],
        },
    };
}

export default async function CategoryPage({ params }: Props) {
    const categorySlug = (await params).category;

    const category = await categoryService.getItemByColumn(
        "slug",
        categorySlug,
    );

    if (!category) {
        return redirect("/categories");
    }

    const products = await productService.getItems({
        limit: 8,
    });

    return (
        <main>
            <MainNavbar />
            <Hero category={category} />
            <div className="container mx-auto flex gap-5">
                <aside className="bg-white w-1/4">
                    <LeftSidebar />
                </aside>
                <div className="bg-white w-3/4">
                    <CategoryProducts products={products} />
                </div>
            </div>
        </main>
    );
}
