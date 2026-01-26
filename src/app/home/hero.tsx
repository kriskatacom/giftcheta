import Link from "next/link";
import Banner from "@/components/banner";

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
                href={"/8-mi-mart"}
                className="py-3 px-5 text-lg font-semibold rounded-md text-white bg-primary hover:bg-primary/50 duration-300"
            >
                Намерете най-добрия подарък!
            </Link>
        </Banner>
    );
}