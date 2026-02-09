import { Truck, ShieldCheck, RefreshCcw, Headphones } from "lucide-react";

type Advantage = {
    icon: React.ReactNode;
    title: string;
    description: string;
};

const advantages: Advantage[] = [
    {
        icon: <Truck className="h-6 w-6" />,
        title: "Бърза доставка",
        description: "Доставка до 48 часа в цялата страна",
    },
    {
        icon: <ShieldCheck className="h-6 w-6" />,
        title: "Гарантирано качество",
        description: "Проверени продукти с високо качество",
    },
    {
        icon: <RefreshCcw className="h-6 w-6" />,
        title: "Лесно връщане",
        description: "14 дни право на връщане",
    },
    {
        icon: <Headphones className="h-6 w-6" />,
        title: "Поддръжка",
        description: "Бърза и любезна помощ",
    },
];

export default function CompetitiveAdvantages() {
    return (
        <section className="grid grid-cols-2 gap-4 bg-background md:grid-cols-4">
            {advantages.map((item, index) => (
                <div
                    key={index}
                    className="flex flex-col items-center gap-2 text-center"
                >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        {item.icon}
                    </div>

                    <h4 className="text-base font-semibold">{item.title}</h4>

                    <p className="text-sm text-muted-foreground">
                        {item.description}
                    </p>
                </div>
            ))}
        </section>
    );
}
