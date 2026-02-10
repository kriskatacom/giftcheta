import { Metadata } from "next";
import MainNavbar from "@/components/main-navbar";
import FavoriteProductGrid from "@/app/favorites/favorites-product-grid";
import { websiteName, getFullUrl } from "@/lib/utils";

export const metadata: Metadata = {
    title: websiteName("Моите любими продукти"),
    description: `Разгледайте любимите си продукти от ${websiteName()}. Вечни рози, ръчни букети и уникални подаръци за жени. Съхранявайте и споделяйте своите любими продукти лесно.`,
    keywords: [
        "любими продукти",
        "вечни рози",
        "ръчни подаръци",
        "букети за подарък",
        "уникални подаръци за жени",
    ].join(", "),
    openGraph: {
        title: websiteName("Моите любими продукти"),
        description: `Разгледайте любимите си продукти от ${websiteName()}. Вечни рози, ръчни букети и уникални подаръци за жени.`,
        type: "website",
        url: getFullUrl("/favorites"),
        siteName: websiteName(),
        locale: "bg_BG",
        phoneNumbers: ["0878766697"],
        countryName: "Bulgaria",
    },
    twitter: {
        card: "summary_large_image",
        title: `${websiteName()} - Моите любими продукти`,
        description: `Разгледайте любимите си продукти от ${websiteName()}. Вечни рози, ръчни букети и уникални подаръци за жени.`,
    },
    icons: { icon: "/favicon.ico" },
    metadataBase: getFullUrl(),
};

export default function FavoritesPage() {
    return (
        <main>
            <MainNavbar />
            <div className="container mx-auto pt-10 text-center min-h-screen space-y-10">
                <h1 className="text-2xl font-semibold">
                    Моите любими продукти
                </h1>
                <FavoriteProductGrid />
            </div>
        </main>
    );
}