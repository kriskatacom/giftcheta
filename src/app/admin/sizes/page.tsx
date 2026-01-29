import { Metadata } from "next";
import Link from "next/link";
import { websiteName } from "@/lib/utils";
import { FiPlus } from "react-icons/fi";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import ClientPage from "@/app/admin/sizes/client-page";
import { SizeService } from "@/lib/services/size-service";
import { getDb } from "@/lib/db";

export const metadata: Metadata = {
    title: websiteName("Размери"),
};

export default async function Sizes() {
    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Размери", href: "/admin/sizes" },
    ];

    const sizeService = new SizeService(getDb());
    const sizes = await sizeService.getAllSizes();

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
                <ClientPage data={sizes} />
            </main>
        </div>
    );
}
