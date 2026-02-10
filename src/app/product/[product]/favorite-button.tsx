import { Heart } from "react-feather";
import { TbHeartFilled } from "react-icons/tb";
import { toast } from "sonner";
import IconButtonWithTooltip from "@/components/ui/icon-button-with-tooltip";
import { useFavoritesStore } from "@/stores/use-favorites-store";

interface FavoriteButtonProps {
    productId: number;
}

export default function FavoriteButton({ productId }: FavoriteButtonProps) {
    const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
    const isFavorite = useFavoritesStore((state) =>
        state.favorites.includes(productId),
    );

    const handleToogleFavorite = () => {
        const message = isFavorite
            ? "Продуктът е премахнат в секция Любими!"
            : "Продуктът е добавен в секция Любими!";
        toast.success(message, { position: "top-center" });
        toggleFavorite(productId);
    };

    return (
        <IconButtonWithTooltip
            tooltip={isFavorite ? "Премахване от любими" : "Добави в любими"}
            onClick={handleToogleFavorite}
            variant="ghost"
            size="icon-xl"
            icon={
                isFavorite ? (
                    <TbHeartFilled
                        className="fill-primary stroke-primary stroke-1"
                        size={30}
                    />
                ) : (
                    <Heart size={30} style={{ strokeWidth: 1 }} />
                )
            }
        />
    );
}
