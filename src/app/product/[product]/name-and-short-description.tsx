import { Product } from "@/lib/types";

type NameAndShortDescriptionProps = {
    product: Product;
};

export default function NameAndShortDescription({
    product,
}: NameAndShortDescriptionProps) {
    return (
        <div>
            <strong>Описание:</strong>
            {product.short_description && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: product.short_description,
                    }}
                ></div>
            )}
        </div>
    );
}