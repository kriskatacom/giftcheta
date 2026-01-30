import { Metadata } from "next";
import Link from "next/link";
import { websiteName } from "@/lib/utils";
import { FiPlus } from "react-icons/fi";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import ClientPage from "@/app/admin/colors/client-page";
import { ColorService } from "@/lib/services/color-service";
import { getDb } from "@/lib/db";
import DeleteAll from "@/app/admin/colors/delete-all";

export const metadata: Metadata = {
    title: websiteName("Цветове"),
};

export default async function Colors() {
    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Цветове", href: "/admin/colors" },
    ];

    const colorService = new ColorService(getDb());
    const colors = await colorService.getAllItems();

    return (
        <div className="flex">
            <MainSidebarServer />

            <main className="flex-1">
                <div className="flex items-center gap-5 border-b">
                    <h1 className="text-2xl font-semibold p-5">Цветове</h1>

                    <div className="flex items-center gap-3">
                        <Link href="/admin/colors/new">
                            <Button variant={"outline"} size={"lg"}>
                                <FiPlus />
                                <span>Добавяне</span>
                            </Button>
                        </Link>
                        
                        {colors.length > 0 && <DeleteAll />}
                    </div>
                </div>

                <Breadcrumbs items={breadcrumbs} />
                <ClientPage data={colors} />
            </main>
        </div>
    );
}
