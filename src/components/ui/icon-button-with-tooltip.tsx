"use client";

import { ReactNode, MouseEventHandler } from "react";
import { FiLoader } from "react-icons/fi";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
    TooltipProvider,
} from "@/components/ui/tooltip";

interface IconButtonWithTooltipProps {
    tooltip: string;
    icon: ReactNode;
    onClick?: MouseEventHandler;
    loading?: boolean;
    disabled?: boolean;
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link";
    size?:
        | "default"
        | "xs"
        | "sm"
        | "lg"
        | "icon"
        | "icon-sm"
        | "icon-lg"
        | "icon-xl"; // Button sizes
}

/**
 * Преизползваем бутон с икона и tooltip
 */
export default function IconButtonWithTooltip({
    tooltip,
    icon,
    onClick,
    loading = false,
    disabled = false,
    variant = "default",
    size = "default",
}: IconButtonWithTooltipProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={onClick}
                        disabled={disabled || loading}
                        variant={variant}
                        size={size}
                    >
                        {loading ? (
                            <FiLoader className="animate-spin" size={25} />
                        ) : (
                            icon
                        )}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                    {tooltip}
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}