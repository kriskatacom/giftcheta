import { Metadata } from "next";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/db";
import { getFullUrl, websiteName } from "@/lib/utils";
import { ProductService } from "@/lib/services/product-service";
import { CategoryService } from "@/lib/services/category-service";
import MainNavbar from "@/components/main-navbar";
import { BreadcrumbItem } from "@/components/breadcrumbs";
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

    const title = `${product.name} - Ръчно изработени подаръци и вечни рози | ${websiteName()}`;
    const description =
        product.short_description ||
        `Купи ${product.name} – уникален ръчно изработен подарък, включително вечни, сапунени и фоамени рози.`;

    let imagesArray: string[] = [];
    if (Array.isArray(product.images)) {
        imagesArray = product.images.map(getFullUrl);
    } else if (product.image) {
        imagesArray = [getFullUrl(product.image)];
    }

    return {
        title,
        description,
        applicationName: websiteName(),
        authors: [{ name: "Кристиан Костадинов", url: "https://kriskata.com" }],
        alternates: { canonical: `/${product.slug}` },
        openGraph: {
            title,
            description,
            type: "website",
            url: getFullUrl(`/${product.slug}`),
            siteName: websiteName(),
            images: imagesArray.map((url) => ({ url })),
            locale: "bg_BG",
            phoneNumbers: ["0878766697"],
            countryName: "Bulgaria",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: imagesArray,
        },
        icons: { icon: "/favicon.ico" },
        metadataBase: getFullUrl(),
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

    // JSON-LD за продукта
    const structuredData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.name,
        image: imagesArray.map(getFullUrl),
        description: product.short_description,
        sku: product.id,
        offers: {
            "@type": "Offer",
            url: getFullUrl(`/${product.slug}`),
            priceCurrency: "EUR",
            price: Number(product.price).toFixed(2) || "0.00",
            availability: "https://schema.org/InStock",
        },
    };

    return (
        <main>
            <MainNavbar />

            {/* JSON-LD за SEO */}
            <script
                type="application/ld+json"
                // @ts-ignore
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />

            <ProductContent
                product={product}
                breadcrumbs={breadcrumbs}
                imagesArray={imagesArray}
            />
            <CartSidebar />
        </main>
    );
}