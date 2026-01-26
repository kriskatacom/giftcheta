"use client";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarToggle } from "./sidebar-toggle";
import { SidebarMap } from "./sidebar-map";
import { useSidebar } from "./sidebar-context";
import { mainSidebarItems } from "@/lib/constants";

type Props = {
    pathname: string;
};

export function SidebarClient({ pathname }: Props) {
    const items = mainSidebarItems;
    const { collapsed } = useSidebar();

    return (
        <aside
            className={cn(
                "min-h-screen border-r bg-background transition-all duration-300",
                collapsed ? "w-20" : "w-72",
            )}
        >
            <div className="flex items-center justify-between p-4 border-b">
                <span
                    className={cn(
                        "text-2xl font-semibold transition-all duration-300 whitespace-nowrap overflow-hidden",
                        collapsed ? "opacity-0 w-0" : "opacity-100",
                    )}
                >
                    Табло
                </span>

                <SidebarToggle />
            </div>

            <ScrollArea className="flex-1 overflow-auto p-2">
                <SidebarMap items={items} pathname={pathname} />
            </ScrollArea>
        </aside>
    );
}
