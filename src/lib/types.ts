import { IconType } from "react-icons";

export type IconSize = "sm" | "md" | "lg";

export type NavbarItem = {
    label: string;
    href: string;
    icon?: IconType;
};
