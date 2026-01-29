import { Metadata } from "next";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { websiteName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import ClientPage from "@/app/admin/products/client-page";
import { getProducts } from "@/lib/services/product-service";
import Export from "@/app/admin/products/export";

export const metadata: Metadata = {
    title: websiteName("Продукти"),
};

export default async function ProductsPage() {
    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Продукти", href: "/admin/products" },
    ];

    const products = await getProducts();

    return (
        <div className="flex">
            <MainSidebarServer />

            <main className="flex-1">
                <div className="flex items-center gap-5 border-b">
                    <h1 className="text-2xl font-semibold p-5">Продукти</h1>

                    <div className="flex items-center gap-3">
                        <Link href="/admin/products/new">
                            <Button variant={"outline"} size={"lg"}>
                                <FiPlus />
                                <span>Добавяне</span>
                            </Button>
                        </Link>

                        <Export />
                    </div>
                </div>

                <Breadcrumbs items={breadcrumbs} />
                <ClientPage data={products} />
            </main>
        </div>
    );
}
