import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";
import { getFullUrl, websiteName } from "@/lib/utils";

import { CategoryService } from "@/lib/services/category-service";
import { ProductService } from "@/lib/services/product-service";

import MainNavbar from "@/components/main-navbar";
import LeftSidebar from "@/components/left-sidebar";

import Hero from "@/app/[category]/hero";
import CategoryMainTop from "@/app/[category]/category-main-top";
import CategoryProducts from "@/app/[category]/category-products";
import { ColorService } from "@/lib/services/color-service";
import { SizeService } from "@/lib/services/size-service";

type Props = {
    params: Promise<{
        category: string;
    }>;
};

const categoryService = new CategoryService(getDb());
const colorService = new ColorService(getDb());
const productService = new ProductService(getDb());
const sizeService = new SizeService(getDb());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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
        redirect("/categories");
    }

    const products = await productService.getItems({
        limit: 8,
    });
    const colors = await colorService.getAllItems();
    const sizes = await sizeService.getAllItems();

    return (
        <main>
            <MainNavbar />

            <Hero category={category} />

            <div className="container mx-auto">
                <aside className="bg-white">
                    <LeftSidebar />
                </aside>

                <div className="flex-1 bg-white max-md:px-5">
                    <CategoryMainTop products={products} />
                    <CategoryProducts
                        products={products}
                        colors={colors}
                        sizes={sizes}
                    />
                </div>
            </div>
        </main>
    );
}
