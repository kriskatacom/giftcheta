import AppImage from "@/components/AppImage";
import { Category } from "@/lib/services/category-service";

type Props = {
    category: Category;
};

export default function Hero({ category }: Props) {
    return (
        <section className="relative bg-gray-100 py-10 xl:p-20 space-y-5 overflow-hidden">
            {category.image && (
                <>
                    {/* Background image */}
                    <div className="absolute inset-0 z-0 h-full">
                        <AppImage
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 z-10 bg-black/50 h-full" />
                </>
            )}

            {/* Content */}
            <div className="relative z-20 max-w-2xl mx-auto w-full text-center space-y-5 text-white">
                <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold">
                    {category.name}
                </h1>
                <p className="text-lg">{category.excerpt}</p>
            </div>
        </section>
    );
}