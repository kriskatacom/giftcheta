"use client";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useEffect, useMemo, useState } from "react";
import { RiDragMove2Fill } from "react-icons/ri";
import { NAVBAR_ICON_SIZES } from "@/lib/constants";

type Props = {
    storageKey: string;
    sections: Record<string, React.ReactNode>;
};

export default function ProductForms({ storageKey, sections }: Props) {
    const [hasMounted, setHasMounted] = useState(false);
    
    const componentsMap: Record<string, React.ReactNode> = useMemo(() => ({
        ...sections
    }), []);

    const [order, setOrder] = useState<string[]>(Object.keys(componentsMap));

    useEffect(() => {
        const savedOrder = localStorage.getItem(storageKey);
        if (savedOrder) {
            try {
                const parsedOrder = JSON.parse(savedOrder);
                const allKeysExist = parsedOrder.every((key: string) => key in componentsMap);
                
                if (allKeysExist && parsedOrder.length === Object.keys(componentsMap).length) {
                    setOrder(parsedOrder);
                }
            } catch (e) {
                console.error("Failed to parse order from local storage", e);
            }
        }
        setHasMounted(true);
    }, [componentsMap]);

    const onDragEnd = (result: any) => {
        if (!result.destination) return;

        const newOrder = Array.from(order);
        const [reordered] = newOrder.splice(result.source.index, 1);
        newOrder.splice(result.destination.index, 0, reordered);

        setOrder(newOrder);
        localStorage.setItem(storageKey, JSON.stringify(newOrder));
    };

    if (!hasMounted) return null;

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="forms">
                {(provided) => (
                    <div
                        className="grid gap-5 p-5"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                    >
                        {order.map((id, index) => {
                            if (!componentsMap[id]) return null;

                            return (
                                <Draggable key={id} draggableId={id} index={index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            className={`rounded shadow border ${
                                                snapshot.isDragging ? "ring-2 ring-blue-500 z-50" : "border-background"
                                            }`}
                                            style={provided.draggableProps.style}
                                        >
                                            <div className="flex items-center gap-5">
                                                <div {...provided.dragHandleProps} className="max-w-10 cursor-grab active:cursor-grabbing">
                                                    <RiDragMove2Fill size={NAVBAR_ICON_SIZES.md} className="text-gray-400" />
                                                </div>
                                                <div className="flex-1">
                                                    {componentsMap[id]}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Draggable>
                            );
                        })}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}