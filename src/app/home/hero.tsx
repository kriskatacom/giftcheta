import Link from "next/link";
import Banner from "@/components/banner";

const CTA_DESKTOP = "Намерете най-добрия подарък!";
const CTA_MOBILE = "Намерете подаръци";

export default function Hero() {
    return (
        <Banner
            image="/images/8-mi-mart.webp"
            title="Промоция за 8-ми март!"
            subtitle="Най-добрите подаръци, цветя и изненади за дамите в живота ви."
            textSize="xl"
            height="lg"
            textAlign="center"
        >
            <Link
                href="/8-mi-mart"
                className="
                    inline-flex items-center justify-center
                    px-5 py-3 text-lg font-semibold
                    rounded-md
                    bg-primary text-white
                    transition-colors duration-300
                    hover:bg-primary/80
                    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
                "
            >
                <span className="hidden md:block">{CTA_DESKTOP}</span>
                <span className="block md:hidden">{CTA_MOBILE}</span>
            </Link>
        </Banner>
    );
}