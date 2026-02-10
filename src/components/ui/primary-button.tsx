import { ButtonHTMLAttributes, ReactNode } from "react";
import { FiLoader } from "react-icons/fi";
import { cn } from "@/lib/utils";

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    isLoading?: boolean;
    icon?: ReactNode;
    loadingIcon?: ReactNode;
    children: ReactNode;
}

const buttonBase =
    "flex-1 flex items-center justify-center gap-2 text-white font-semibold py-4 px-5 rounded-lg transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary cursor-pointer";

export default function PrimaryButton({
    isLoading = false,
    icon,
    loadingIcon = <FiLoader className="animate-spin" size={25} />,
    disabled,
    className,
    children,
    ...props
}: PrimaryButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={cn(buttonBase, className)}
            {...props}
        >
            {isLoading ? loadingIcon : icon}
            <span>{children}</span>
        </button>
    );
}