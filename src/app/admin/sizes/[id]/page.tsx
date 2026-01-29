import { Metadata } from "next";
import Link from "next/link";
import { websiteName } from "@/lib/utils";
import { FiPlus } from "react-icons/fi";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { SizeService } from "@/lib/services/size-service";
import { getDb } from "@/lib/db";
import CreateAndUpdateSizeForm from "@/app/admin/sizes/[id]/create-and-update-form";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const sizeService = new SizeService(getDb());

    if (id !== "new") {
        const size =
            id !== "new" && parseInt(id)
                ? await sizeService.getSizeById(Number(id))
                : null;

        if (size) {
            return {
                title: websiteName("Редактиране на размера"),
            };
        }
    }

    return {
        title: websiteName("Добавяне на нов размер"),
    };
}

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export default async function Sizes({ params }: Params) {
    const { id } = await params;

    const sizeService = new SizeService(getDb());
    const size =
        id !== "new" && parseInt(id)
            ? await sizeService.getSizeById(Number(id))
            : null;

    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Размери", href: "/admin/sizes" },
        {
            name: `${id !== "new" ? "Редактиране" : "Добавяне"}`,
        },
    ];

    return (
        <div className="flex">
            <MainSidebarServer />

            <main className="flex-1">
                <div className="flex items-center gap-5 border-b">
                    <h1 className="text-2xl font-semibold p-5">Размери</h1>

                    <div className="flex items-center gap-3">
                        <Link href="/admin/sizes/new">
                            <Button variant={"outline"} size={"lg"}>
                                <FiPlus />
                                <span>Добавяне</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                <Breadcrumbs items={breadcrumbs} />

                <div className="p-5">
                    <CreateAndUpdateSizeForm size={size} />
                </div>
            </main>
        </div>
    );
}