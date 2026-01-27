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
import PricingForm from "@/app/admin/products/[id]/pricing";
import DescriptionForm from "@/app/admin/products/[id]/description";
import AdditionalImages from "@/components/additional-images";
import TagsForm from "@/app/admin/products/[id]/tags";
import ImageForm from "@/app/admin/products/[id]/image";
import ImagesForm from "./images";

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

    const additionalImages = product?.images
        ? JSON.parse(product.images)
        : null;

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

                <div className="grid gap-5 p-5">
                    <div className="grid xl:grid-cols-2 gap-5">
                        <NameAndSlugForm product={product} />
                        <PricingForm product={product} />
                    </div>
                    <DescriptionForm product={product} />
                    <TagsForm product={product} />
                    {product?.id && <ImageForm product={product} />}
                    {product?.id && product.images && (
                        <ImagesForm
                            images={additionalImages}
                            productId={product.id}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
