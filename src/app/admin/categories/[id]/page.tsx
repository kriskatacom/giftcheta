import { Metadata } from "next";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { websiteName } from "@/lib/utils";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import NameForm from "@/app/admin/categories/[id]/name-and-slug-form";
import { CategoryService } from "@/lib/services/category-service";
import { getDb } from "@/lib/db";
import DraggableForms from "@/components/draggable-forms";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    const colorService = new CategoryService(getDb());

    if (id !== "new") {
        const color =
            id !== "new" && parseInt(id)
                ? await colorService.getItemById(Number(id))
                : null;

        if (color) {
            return {
                title: websiteName("Редактиране на категорията"),
            };
        }
    }

    return {
        title: websiteName("Добавяне на нова категория"),
    };
}

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export default async function UpdateCategory({ params }: Params) {
    const { id } = await params;

    const categoryService = new CategoryService(getDb());
    const category =
        id !== "new" && parseInt(id)
            ? await categoryService.getItemById(Number(id))
            : null;

    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Категории", href: "/admin/categories" },
        { name: `${id !== "new" ? "Редактиране" : "Добавяне"}` },
    ];

    const sections = {
        nameSlug: <NameForm category={category} />,
    };

    return (
        <div className="flex">
            <MainSidebarServer />

            <main className="flex-1">
                <div className="border-b flex items-center gap-5">
                    <h1 className="text-2xl font-semibold p-5">
                        {category
                            ? "Редактиране на категорията"
                            : "Добавяне на нова категория"}
                    </h1>

                    <Link href="/admin/categories/new">
                        <Button variant={"outline"} size={"lg"}>
                            <FiPlus />
                            <span>Добавяне</span>
                        </Button>
                    </Link>
                </div>

                <Breadcrumbs items={breadcrumbs} />

                <DraggableForms
                    sections={sections}
                    storageKey="category-form-order"
                />
            </main>
        </div>
    );
}