import { Metadata } from "next";
import Link from "next/link";
import { websiteName } from "@/lib/utils";
import { FiPlus } from "react-icons/fi";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { getDb } from "@/lib/db";
import DraggableForms from "@/components/draggable-forms";
import { TagService } from "@/lib/services/tag-service";
import CreateAndUpdateItemForm from "@/app/admin/tags/[id]/create-and-update-form";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

const tagService = new TagService(getDb());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    if (id !== "new") {
        const tag =
            id !== "new" && parseInt(id)
                ? await tagService.getItemById(Number(id))
                : null;

        if (tag) {
            return {
                title: websiteName("Редактиране на тага"),
            };
        }
    }

    return {
        title: websiteName("Добавяне на нов таг"),
    };
}

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export default async function CreateAndUpdateTag({ params }: Params) {
    const { id } = await params;

    const tag =
        id !== "new" && parseInt(id)
            ? await tagService.getItemById(Number(id))
            : null;

    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Тагове", href: "/admin/tags" },
        {
            name: `${id !== "new" ? "Редактиране" : "Добавяне"}`,
        },
    ];

    const sections = {
        nameSlug: <CreateAndUpdateItemForm tag={tag} />,
    };

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
                    </div>
                </div>

                <Breadcrumbs items={breadcrumbs} />

                <DraggableForms
                    storageKey="tag-form-order"
                    sections={sections}
                />
            </main>
        </div>
    );
}
