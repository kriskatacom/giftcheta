import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";
import { getFullUrl, websiteName } from "@/lib/utils";

import { ProductService } from "@/lib/services/product-service";

import MainNavbar from "@/components/main-navbar";
import ProductGallery from "@/app/product/[product]/product-gallery";
import NameAndShortDescription from "./name-and-short-description";
import CartButtons from "./cart-buttons";
import Pricing from "./pricing";
import QuantitySelector from "./quantity-selector";
import CustomProductTextarea from "./custom-product-textarea";
import CompetitiveAdvantages from "./competitive-advantages";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { CategoryService } from "@/lib/services/category-service";

type Props = {
    params: Promise<{
        product: string;
    }>;
};

const productService = new ProductService(getDb());
const categoryService = new CategoryService(getDb());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const productSlug = (await params).product;

    const product = await productService.getItemByColumn("slug", productSlug);

    if (!product) {
        return {
            title: "Този продукт не е намерен",
            description: "Продуктът не съществува",
        };
    }

    return {
        title: websiteName(product.name),
        description: product.short_description,
        applicationName: websiteName(),
        authors: [
            {
                name: "Кристиан Костадинов",
                url: "https://kriskata.com",
            },
        ],
        alternates: {
            canonical: `/${product.slug}`,
        },
        openGraph: {
            title: websiteName(product.name),
            description: product.short_description,
            images: product.image ? [{ url: getFullUrl(product.image) }] : [],
        },
    };
}

export default async function ProductPage({ params }: Props) {
    const productSlug = (await params).product;

    const product = await productService.getItemByColumn("slug", productSlug);

    if (!product) {
        redirect("/");
    }

    const category = product.category_id
        ? await categoryService.getItemByColumn("id", product.category_id)
        : null;

    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Начало", href: "/" },
        ...(category
            ? [{ name: category.name, href: `/${category.slug}` }]
            : []),
        { name: product.name, href: `/${product.slug}` },
    ];

    let imagesArray: string[] = [];

    if (Array.isArray(product.images)) {
        imagesArray = product.images;
    } else if (product.images) {
        imagesArray = [product.image as string, product.images];
    } else {
        imagesArray = [];
    }

    return (
        <main>
            <MainNavbar />

            <div className="container mx-auto grid lg:grid-cols-2">
                <div>
                    <Breadcrumbs items={breadcrumbs} classes="md:px-0" />
                    <ProductGallery images={imagesArray} alt={product.name} />
                </div>
                <div className="p-5 space-y-5 lg:mt-10">
                    <h1 className="text-lg md:text-2xl font-semibold">
                        {product.name}
                    </h1>
                    <NameAndShortDescription product={product} />
                    <Pricing product={product} />
                    <QuantitySelector />
                    <CartButtons productId={product.id} />
                    <CustomProductTextarea />
                    <CompetitiveAdvantages />
                </div>
            </div>
        </main>
    );
}
