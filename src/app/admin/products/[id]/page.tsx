import { Metadata } from "next";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { websiteName } from "@/lib/utils";
import ImageUpload from "@/components/image-upload";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { getProductByColumn } from "@/lib/services/product-service";
import NameAndSlugForm from "@/app/admin/products/[id]/name-and-slug-form";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import { Alert } from "@/components/alert";
import PricingForm from "./pricing";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    if (id !== "new") {
        const product = await getProductByColumn("id", id);

        if (product) {
            return {
                title: websiteName("Редактиране на продукта"),
            };
        }
    }

    return {
        title: websiteName("Добавяне на нов продукт"),
    };
}

type Params = {
    params: Promise<{
        id: string;
    }>;
};

export default async function UpdateProduct({ params }: Params) {
    const { id } = await params;
    let product = null;

    if (id !== "new") {
        product = await getProductByColumn("id", id);
    }

    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Продукти", href: "/admin/products" },
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
                        {product
                            ? "Редактиране на продукта"
                            : "Добавяне на нов продукт"}
                    </h1>

                    <Link href="/admin/products/new">
                        <Button variant={"outline"} size={"lg"}>
                            <FiPlus />
                            <span>Добавяне</span>
                        </Button>
                    </Link>
                </div>

                <Breadcrumbs items={breadcrumbs} />

                {(!product || !product.id) && (
                    <Alert title="Важно!" variant="info" className="m-5">
                        Всички полета със звездичка (*) са задължителни!
                    </Alert>
                )}

                <div className="grid xl:grid-cols-2 gap-5 p-5">
                    <NameAndSlugForm product={product} />
                    <PricingForm product={product} />
                </div>

                {product?.id && (
                    <>
                        <h2 className="px-5 text-xl font-semibold">
                            Изображение
                        </h2>
                        <ImageUpload
                            imageUrl={product.image as string}
                            url={
                                product?.id
                                    ? `/api/products/${product.id}/upload`
                                    : ""
                            }
                        />
                    </>
                )}
            </main>
        </div>
    );
}
