import MainNavbar from "@/components/main-navbar";
import Hero from "@/app/home/hero";
import HomeFeaturedProducts from "@/app/home/featured-products";
import HomeCategories from "@/app/home/categories";
import HomeNewProducts from "@/app/home/new-products";

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