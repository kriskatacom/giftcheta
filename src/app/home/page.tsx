import MainNavbar from "@/components/main-navbar";
import Hero from "@/app/home/hero";
import FeaturedProducts from "./featured-products";

export default function Home() {
    return (
        <main>
            <MainNavbar />
            <Hero />
            <FeaturedProducts />
        </main>
    );
}
