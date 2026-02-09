import { Product } from "@/lib/types";
import { BreadcrumbItem, Breadcrumbs } from "@/components/breadcrumbs";
import ProductGallery from "@/app/product/[product]/product-gallery";
import NameAndShortDescription from "@/app/product/[product]/name-and-short-description";
import QuantitySelector from "@/app/product/[product]/quantity-selector";
import PricingWithCart from "@/app/product/[product]/pricing-with-cart";
import AnimatedCartButtons from "@/app/product/[product]/cart-buttons";
import CustomProductTextarea from "@/app/product/[product]/custom-product-textarea";
import CompetitiveAdvantages from "@/app/product/[product]/competitive-advantages";

type ProductContentProps = {
    product: Product;
    breadcrumbs: BreadcrumbItem[];
    imagesArray: string[];
};

export default function ProductContent({
    product,
    breadcrumbs,
    imagesArray,
}: ProductContentProps) {
    return (
        <div className="container mx-auto grid lg:grid-cols-2">
            <div>
                <Breadcrumbs items={breadcrumbs} classes="md:px-0" />
                <ProductGallery images={imagesArray} alt={product.name} />
            </div>
            <div className="p-5 space-y-5 lg:mt-10">
                <h1 className="text-lg md:text-2xl font-semibold">
                    {product.name}
                </h1>
                <NameAndShortDescription product={product} />
                <PricingWithCart product={product} />
                <QuantitySelector productId={product.id} />
                <AnimatedCartButtons product={product} />
                <CustomProductTextarea productId={product.id} />
                <CompetitiveAdvantages />
            </div>
        </div>
    );
}
