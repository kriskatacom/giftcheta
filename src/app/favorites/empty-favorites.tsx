import Link from "next/link";
import { Heart } from "lucide-react";
import PrimaryButton from "@/components/ui/primary-button";

export default function EmptyFavorites() {
    return (
        <div className="flex flex-col items-center justify-center text-center px-6 py-16 max-w-xl mx-auto rounded-2xl border border-dashed border-pink-200 bg-pink-50/40">
            {/* Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-pink-100">
                <Heart className="h-10 w-10 text-pink-500" strokeWidth={1.5} />
            </div>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-800 mb-3">
                Тук ще съхраняваме твоите любими подаръци 💖
            </h2>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
                Все още нямаш добавени любими продукти.
                <br />
                Разгледай нашата колекция от вечни рози, ръчно изработени букети
                и уникални подаръци — и запази онези, които те карат да се
                усмихнеш.
            </p>

            {/* CTA */}
            <Link href="/">
                <PrimaryButton>Разгледайте подаръците</PrimaryButton>
            </Link>
        </div>
    );
}
