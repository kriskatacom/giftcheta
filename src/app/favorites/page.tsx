import MainNavbar from "@/components/main-navbar";
import FavoriteProductGrid from "@/app/favorites/favorites-product-grid";

export default function FavoritesPage() {
    return (
        <main>
            <MainNavbar />
            <div className="container mx-auto pt-10 text-center min-h-screen space-y-10">
                <h1 className="text-2xl font-semibold">Моите любими продукти</h1>
                <FavoriteProductGrid />
            </div>
        </main>
    );
}