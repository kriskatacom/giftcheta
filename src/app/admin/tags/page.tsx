import { Metadata } from "next";
import Link from "next/link";
import { websiteName } from "@/lib/utils";
import { FiPlus } from "react-icons/fi";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import ClientPage from "@/app/admin/tags/client-page";
import { getDb } from "@/lib/db";
import { TagService } from "@/lib/services/tag-service";
import DeleteAll from "@/app/admin/tags/delete-all";

export const metadata: Metadata = {
    title: websiteName("Тагове"),
};

export default async function Tags() {
    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Тагове", href: "/admin/tags" },
    ];

    const tagService = new TagService(getDb());
    const tags = await tagService.getAllItems();

    return (
        <div className="flex">
            <MainSidebarServer />

            <main className="flex-1">
                <div className="flex items-center gap-5 border-b">
                    <h1 className="text-2xl font-semibold p-5">Тагове</h1>

                    <div className="flex items-center gap-3">
                        <Link href="/admin/tags/new">
                            <Button variant={"outline"} size={"lg"}>
                                <FiPlus />
                                <span>Добавяне</span>
                            </Button>
                        </Link>
                        {tags.length > 0 && <DeleteAll />}
                    </div>
                </div>

                <Breadcrumbs items={breadcrumbs} />
                <ClientPage data={tags} />
            </main>
        </div>
    );
}