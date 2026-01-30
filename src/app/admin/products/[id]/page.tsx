import { Metadata } from "next";
import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import { websiteName } from "@/lib/utils";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import NameAndSlugForm from "@/app/admin/products/[id]/name-and-slug-form";
import MainSidebarServer from "@/components/main-sidebar/main-sidebar-server";
import PricingForm from "@/app/admin/products/[id]/pricing";
import DescriptionForm from "@/app/admin/products/[id]/description";
import TagsForm from "@/app/admin/products/[id]/tags";
import ImageForm from "@/app/admin/products/[id]/image";
import ImagesForm from "@/app/admin/products/[id]/images";
import InventoryForm from "@/app/admin/products/[id]/inventory";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

import { getDb } from "@/lib/db";
import { ProductService } from "@/lib/services/product-service";
import { SizeService } from "@/lib/services/size-service";
import SizesForm from "@/app/admin/products/[id]/sizes";
import ColorsForm from "./colors";
import { ColorService } from "@/lib/services/color-service";
import DraggableForms from "../../../../components/draggable-forms";

const productService = new ProductService(getDb());
const sizeService = new SizeService(getDb());
const colorService = new ColorService(getDb());

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;

    if (id !== "new") {
        const product = await productService.getItemByColumn("id", id);

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

export default async function updateItem({ params }: Params) {
    const { id } = await params;
    let product = null;

    if (id !== "new") {
        product = await productService.getItemByColumn("id", id);
    }

    const sizes = await sizeService.getAllItems();
    const colors = await colorService.getAllItems();

    const breadcrumbs: BreadcrumbItem[] = [
        { name: "Табло", href: "/admin/dashboard" },
        { name: "Продукти", href: "/admin/products" },
        { name: `${id !== "new" ? "Редактиране" : "Добавяне"}` },
    ];

    const images: string[] = Array.isArray(product?.images)
        ? product?.images
        : [];

    const sections = {
        image: product && <ImageForm product={product} />,
        images: product && (
            <ImagesForm images={images} productId={product.id} />
        ),
        nameSlug: <NameAndSlugForm product={product} />,
        pricing: product && <PricingForm product={product} />,
        inventory: product && <InventoryForm product={product} />,
        description: product && <DescriptionForm product={product} />,
        tags: product && <TagsForm product={product} />,
        colors: product && <ColorsForm product={product} colors={colors} />,
        sizes: product && <SizesForm product={product} sizes={sizes} />,
    };

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

                <DraggableForms
                    storageKey="product-form-order"
                    sections={sections}
                />
            </main>
        </div>
    );
}