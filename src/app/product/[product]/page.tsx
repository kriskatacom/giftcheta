import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getFullUrl, websiteName } from "@/lib/utils";
import { ProductService } from "@/lib/services/product-service";
import MainNavbar from "@/components/main-navbar";
import { BreadcrumbItem } from "@/components/breadcrumbs";
import { CategoryService } from "@/lib/services/category-service";
import ProductContent from "@/app/product/[product]/product-content";
import CartSidebar from "@/components/main-navbar/cart-sidebar";

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
            <ProductContent
                product={product}
                breadcrumbs={breadcrumbs}
                imagesArray={imagesArray}
            />
            <CartSidebar />
        </main>
    );
}
