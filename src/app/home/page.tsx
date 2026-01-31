import { Metadata } from "next";
import MainNavbar from "@/components/main-navbar";
import Hero from "@/app/home/hero";
import HomeFeaturedProducts from "@/app/home/featured-products";
import HomeCategories from "@/app/home/categories";
import HomeNewProducts from "@/app/home/new-products";
import { getFullUrl, websiteName } from "@/lib/utils";

export function generateMetadata(): Metadata {
    return {
        title: websiteName(),
        description: "",
        applicationName: websiteName(),
        authors: [
            {
                name: "Кристиан Костадинов",
                url: "https://kriskata.com",
            },
        ],
        alternates: {
            canonical: getFullUrl(),
        },
        openGraph: {
            title: websiteName(),
            description: "",
            images: [
                {
                    url: getFullUrl("/images/giftcheta-logo.png"),
                    alt: "Giftcheta Logo",
                },
            ],
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
        </main>
    );
}
