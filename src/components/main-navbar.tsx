import Link from "next/link";
import {
    HiMenu,
    HiOutlineHeart,
    HiOutlineShoppingCart,
    HiOutlineUser,
    HiSearch,
} from "react-icons/hi";
import {
    LOGO,
    MAIN_NAVBAR_ITEMS,
    NAVBAR_ICON_SIZES,
    WEBSITE_NAME,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { NavbarItem } from "@/lib/types";
import AppImage from "@/components/AppImage";

export default function MainNavbar() {
    const cartItemsCount = 3;

    return (
        <nav className="border-b bg-background">
            <div className="container mx-auto flex items-center gap-5 px-5">
                {/* Logo */}
                <Link href="/" className="relative block w-60 h-20">
                    <AppImage
                        src={LOGO}
                        alt={WEBSITE_NAME}
                        fill
                        className="w-10 h-10"
                    />
                </Link>

                {/* Search */}
                <div className="hidden lg:flex flex-1 max-w-md ml-6">
                    <div className="relative w-full">
                        <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Търсене на продукти..."
                            className="pl-9"
                        />
                    </div>
                </div>

                {/* Desktop nav items */}
                <div className="hidden md:flex justify-center items-center">
                    {MAIN_NAVBAR_ITEMS.map((item: NavbarItem) => {
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-2 font-semibold text-lg hover:text-white hover:bg-primary py-3 px-5 rounded duration-300"
                            >
                                {Icon && (
                                    <Icon className={NAVBAR_ICON_SIZES.lg} />
                                )}
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                {/* Actions */}
                <div className="ml-auto hidden md:flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <HiOutlineHeart className={NAVBAR_ICON_SIZES.md} />
                    </Button>

                    <Button variant="ghost" size="icon-lg" className="relative">
                        <HiOutlineShoppingCart
                            className={NAVBAR_ICON_SIZES.md}
                        />
                        {cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 h-4 min-w-4 rounded-full bg-primary text-[10px] text-primary-foreground flex items-center justify-center px-1">
                                {cartItemsCount}
                            </span>
                        )}
                    </Button>

                    <Button variant="ghost" size="icon-lg">
                        <HiOutlineUser className={NAVBAR_ICON_SIZES.md} />
                    </Button>
                </div>

                {/* Mobile menu */}
                <div className="md:hidden ml-auto">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon-lg">
                                <HiMenu className={NAVBAR_ICON_SIZES.lg} />
                            </Button>
                        </SheetTrigger>

                        <SheetContent side="right" className="w-80">
                            <SheetHeader>
                                <SheetTitle>Меню</SheetTitle>
                            </SheetHeader>
                            <div className="flex flex-col gap-5">
                                {/* Search mobile */}
                                <div className="px-5 relative">
                                    <HiSearch className="absolute left-8 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Търсене на продукти..."
                                        className="pl-9"
                                    />
                                </div>

                                {/* Nav links */}
                                <div className="flex flex-col">
                                    {MAIN_NAVBAR_ITEMS.map(
                                        (item: NavbarItem) => {
                                            const Icon = item.icon;

                                            return (
                                                <a
                                                    key={item.href}
                                                    href={item.href}
                                                    className="flex items-center gap-2 font-semibold text-lg hover:text-white hover:bg-primary py-2 px-5 rounded duration-300"
                                                >
                                                    {Icon && (
                                                        <Icon
                                                            className={
                                                                NAVBAR_ICON_SIZES.lg
                                                            }
                                                        />
                                                    )}
                                                    {item.label}
                                                </a>
                                            );
                                        },
                                    )}
                                </div>

                                <div className="border-t pt-4 flex gap-2 px-5">
                                    <Button
                                        variant="outline"
                                        className="flex-1 text-lg"
                                        size={"icon-lg"}
                                    >
                                        Вход
                                    </Button>
                                    <Button
                                        className="flex-1 text-lg"
                                        size={"icon-lg"}
                                    >
                                        Регистрация
                                    </Button>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}