import { Metadata } from "next";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { websiteName } from "@/lib/utils";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import CreateAndUpdateForm from "./name-form";
import { ColorService } from "@/lib/services/color-service";
import { getDb } from "@/lib/db";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const colorService = new ColorService(getDb());

    if (id !== "new") {
        const color =
            id !== "new" && parseInt(id)
                ? await colorService.getItemById(Number(id))
                : null;

        if (color) {
            return {
                title: websiteName("Редактиране на цвета"),
            };
        }
    }

    return {
        title: websiteName("Добавяне на нов цвят"),
    };
}

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export default async function updateItem({ params }: Params) {
    const { id } = await params;

    const colorService = new ColorService(getDb());
    const color =
        id !== "new" && parseInt(id)
            ? await colorService.getItemById(Number(id))
            : null;

    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Цветове", href: "/admin/colors" },
        {
            name: `${id !== "new" ? "Редактиране" : "Добавяне"}`,
        },
    ];

    return (
        <div className="flex">
            <MainSidebarServer />

            <main className="flex-1">
                <div className="border-b flex items-center gap-5">
                    <h1 className="text-2xl font-semibold p-5">
                        {color
                            ? "Редактиране на цвета"
                            : "Добавяне на нов цвят"}
                    </h1>

                    <Link href="/admin/colors/new">
                        <Button variant={"outline"} size={"lg"}>
                            <FiPlus />
                            <span>Добавяне</span>
                        </Button>
                    </Link>
                </div>

                <Breadcrumbs items={breadcrumbs} />

                <div className="p-5">
                    <CreateAndUpdateForm color={color} />
                </div>
            </main>
        </div>
    );
}