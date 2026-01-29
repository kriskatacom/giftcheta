import { Metadata } from "next";
import Link from "next/link";
import { websiteName } from "@/lib/utils";
import { FiPlus } from "react-icons/fi";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import ClientPage from "@/app/admin/categories/client-page";
import { getDb } from "@/lib/db";
import { CategoryService } from "@/lib/services/category-service";
import { redirect } from "next/navigation";
import DeleteAll from "./delete-all";

export const metadata: Metadata = {
    title: websiteName("Категории"),
};

type Props = {
    searchParams: Promise<{
        parent_id?: string;
    }>;
};

export default async function Categories({ searchParams }: Props) {
    const { parent_id } = await searchParams;

    const parentId = parent_id ? parseInt(parent_id, 10) : null;

    let breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Категории", href: "/admin/categories" },
    ];

    const categoryService = new CategoryService(getDb());

    if (parentId) {
        const parentCategory = await categoryService.getItemById(parentId);
        if (!parentCategory) return redirect("/admin/categories");
        breadcrumbs.push({ name: parentCategory.name });
    }

    const categories = await categoryService.getAllItems(parentId);

    return (
        <div className="flex">
            <MainSidebarServer />

            <main className="flex-1">
                <div className="flex items-center gap-5 border-b">
                    <h1 className="text-2xl font-semibold p-5">Категории</h1>

                    <div className="flex items-center gap-3">
                        <Link href="/admin/categories/new">
                            <Button variant={"outline"} size={"lg"}>
                                <FiPlus />
                                <span>Добавяне</span>
                            </Button>
                        </Link>
                        {categories.length > 0 && <DeleteAll />}
                    </div>
                </div>

                <Breadcrumbs items={breadcrumbs} />
                <ClientPage data={categories} />
            </main>
        </div>
    );
}
