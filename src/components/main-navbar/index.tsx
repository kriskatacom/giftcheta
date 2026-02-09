"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineShoppingCart, HiSearch } from "react-icons/hi";
import { BsFilter } from "react-icons/bs";
import {
    LOGO,
    MAIN_NAVBAR_ITEMS,
    NAVBAR_ICON_SIZES,
    WEBSITE_NAME,
} from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { NavbarItem } from "@/lib/types";
import AppImage from "@/components/AppImage";
import ActionIcons from "@/components/main-navbar/action-icons";
import MobileMenu from "@/components/main-navbar/mobile-menu";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart-store";
import { useFiltersSidebarStore } from "@/stores/use-filters-sidebar";

export default function MainNavbar() {
    const [mounted, setMounted] = useState(false);
    const cartItemsCount = useCartStore((state) => state.getItemCount());
    const openCart = useCartStore((state) => state.openCart);
    const openSidebar = useFiltersSidebarStore((state) => state.openSidebar);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className="sticky top-0 z-40 border-b bg-background">
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
                <div className="hidden xl:flex justify-center items-center">
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
                <ActionIcons />

                <div className="w-full flex items-center justify-end lg:hidden">
                    <Button
                        variant="ghost"
                        size="icon-xl"
                        onClick={openSidebar}
                    >
                        <BsFilter />
                    </Button>

                    <Button
                        variant="ghost"
                        size="icon-xl"
                        className="relative"
                        onClick={openCart}
                    >
                        <HiOutlineShoppingCart />
                        {mounted && cartItemsCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary text-sm text-primary-foreground flex items-center justify-center px-1">
                                {cartItemsCount}
                            </span>
                        )}
                    </Button>

                    {/* Mobile menu */}
                    <MobileMenu />
                </div>
            </div>
        </nav>
    );
}
