import { Menu, Search } from "react-feather";
import { NavbarItem } from "@/lib/types";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MAIN_NAVBAR_ITEMS, NAVBAR_ICON_SIZES } from "@/lib/constants";
import { websiteName } from "@/lib/utils";

export default function MobileMenu() {
    return (
        <div className="md:hidden">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon-xl">
                        <Menu size={25} style={{ strokeWidth: 1 }} />
                    </Button>
                </SheetTrigger>

                <SheetContent side="right" className="w-80">
                    <SheetHeader className="border-b">
                        <SheetTitle>{websiteName()}</SheetTitle>
                    </SheetHeader>
                    <div className="flex flex-col gap-5">
                        {/* Search mobile */}
                        <div className="px-5 relative">
                            <Search
                                style={{ strokeWidth: 1 }}
                                className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                            />
                            <Input
                                placeholder="Търсене на продукти..."
                                className="pl-9"
                            />
                        </div>

                        {/* Nav links */}
                        <div className="flex flex-col">
                            {MAIN_NAVBAR_ITEMS.map((item: NavbarItem) => {
                                const Icon = item.icon;

                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className="flex items-center gap-2 font-semibold text-lg hover:text-white hover:bg-primary py-2 px-5 rounded duration-300"
                                    >
                                        {Icon && (
                                            <Icon
                                                className={NAVBAR_ICON_SIZES.lg}
                                            />
                                        )}
                                        {item.label}
                                    </a>
                                );
                            })}
                        </div>

                        <div className="border-t pt-4 flex gap-2 px-5">
                            <Button
                                variant="outline"
                                className="flex-1 text-lg"
                                size={"icon-xl"}
                            >
                                Вход
                            </Button>
                            <Button className="flex-1 text-lg" size={"icon-xl"}>
                                Регистрация
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
