import { Metadata } from "next";
import { redirect } from "next/navigation";

import { getDb } from "@/lib/db";
import { getFullUrl, websiteName } from "@/lib/utils";

import { ProductService } from "@/lib/services/product-service";

import MainNavbar from "@/components/main-navbar";
import ProductGallery from "@/components/product-gallery";
import { Slide } from "yet-another-react-lightbox";

type Props = {
    params: Promise<{
        product: string;
    }>;
};

const productService = new ProductService(getDb());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const productSlug = (await params).product;

    const product = await productService.getItemByColumn("slug", productSlug);

    if (!product) {
        return {
            title: "Категория не намерена",
            description: "Категорията не съществува",
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
            <div className="container mx-auto grid lg:grid-cols-2 gap-5">
                <ProductGallery images={imagesArray} alt={product.name} />
            </div>
        </main>
    );
}
