import { Metadata } from "next";
import { websiteName } from "@/lib/utils";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
    title: websiteName("Табло"),
};

export default function Dashboard() {
    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
    ];

    return (
        <div className="flex">
            <MainSidebarServer />

            <main className="flex-1">
                <h1 className="text-2xl font-semibold p-5 border-b">Табло</h1>
                <Breadcrumbs items={breadcrumbs} />
            </main>
        </div>
    );
}
