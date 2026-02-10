import mitt from "mitt";

type Events = {
    toggleFavorite: { productId: number; isFavorite: boolean };
};

export const eventBus = mitt<Events>();