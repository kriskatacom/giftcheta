import { Metadata } from "next";
import MainNavbar from "@/components/main-navbar";
import Hero from "@/app/home/hero";
import HomeFeaturedProducts from "@/app/home/featured-products";
import HomeCategories from "@/app/home/categories";
import HomeNewProducts from "@/app/home/new-products";
import { getFullUrl, websiteName } from "@/lib/utils";
import CartSidebar from "@/components/main-navbar/cart-sidebar";

export function generateMetadata(): Metadata {
    const title = `${websiteName()} - Ръчно изработени подаръци и вечни рози за жени`;
    const description = `Открий уникални ръчно изработени подаръци за жени: вечни рози, сапунени рози, фоамени рози, букети и аксесоари. Перфектни подаръци за рожден ден, годишнина или специален повод.`;
    const keywords = [
        "вечни рози",
        "сапунени рози",
        "фоамени рози",
        "ръчни подаръци за жени",
        "букети за подарък",
        "уникални подаръци",
        "подарък за рожден ден",
        "подарък за годишнина",
    ].join(", ");

    return {
        title,
        description,
        keywords,
        openGraph: {
            title,
            description,
            siteName: websiteName(),
            locale: "bg_BG",
            phoneNumbers: ["0878766697"],
            countryName: "Bulgaria",
            images: [
                {
                    url: getFullUrl("/images/giftcheta-logo.png"),
                    alt: "Giftcheta Logo",
                    width: 1200,
                    height: 630,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            images: {
                url: getFullUrl("/images/giftcheta-logo.png"),
                alt: "Giftcheta Logo",
            },
            title,
            description,
        },
    };
}

export default function Home() {
    return (
        <main>
            <MainNavbar />
            <Hero />
            <HomeFeaturedProducts />
            <HomeCategories />
            <HomeNewProducts />
            <CartSidebar />
        </main>
    );
}