"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createDragHandleColumn } from "@/components/data-table";
import { Size } from "@/lib/services/size-service";

export const columns: ColumnDef<Size>[] = [
    createDragHandleColumn<Size>(),
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },

    // Име
    {
        accessorKey: "name",
        meta: { label: "Име" },
        header: ({ column }) => (
            <button
                className="flex items-center hover:bg-background duration-300 cursor-pointer w-full px-2 py-1"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                <span>Име</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => (
            <Link
                href={`/admin/sizes/${row.original.id}`}
                className="hover:underline"
            >
                {row.getValue("name")}
            </Link>
        ),
    },

    // Width
    {
        accessorKey: "width",
        meta: { label: "Ширина" },
        header: ({ column }) => (
            <button
                className="flex items-center hover:bg-background duration-300 cursor-pointer w-full px-2 py-1"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                <span>Ширина</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => <span>{row.getValue("width")}</span>,
    },

    // Height
    {
        accessorKey: "height",
        meta: { label: "Височина" },
        header: ({ column }) => (
            <button
                className="flex items-center hover:bg-background duration-300 cursor-pointer w-full px-2 py-1"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                <span>Височина</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => <span>{row.getValue("height")}</span>,
    },

    // Depth
    {
        accessorKey: "depth",
        meta: { label: "Дълбочина" },
        header: ({ column }) => (
            <button
                className="flex items-center hover:bg-background duration-300 cursor-pointer w-full px-2 py-1"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                <span>Дълбочина</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => <span>{row.getValue("depth")}</span>,
    },

    // Unit
    {
        accessorKey: "unit",
        meta: { label: "Единица" },
        header: ({ column }) => (
            <button
                className="flex items-center hover:bg-background duration-300 cursor-pointer w-full px-2 py-1"
                onClick={() =>
                    column.toggleSorting(column.getIsSorted() === "asc")
                }
            >
                <span>Единица</span>
                <ArrowUpDown className="ml-2 h-4 w-4" />
            </button>
        ),
        cell: ({ row }) => <span>{row.getValue("unit")}</span>,
    },

    // Actions
    {
        id: "actions",
        meta: {
            label: "Опции",
        },
        header: "Опции",
        cell: ({ row }) => {
            const size = row.original;
            const router = useRouter();

            const handleDelete = async () => {
                try {
                    const res = await axios.delete(`/api/sizes?id=${size.id}`);

                    if (res.data.success) {
                        router.refresh();
                        toast.success("Този размер беше премахнат.");
                    } else {
                        if (res.status === 403 && res.data.code === "slug") {
                            toast.error(res.data.error);
                        }
                    }
                } catch (err: any) {
                    if (err.response) {
                        toast.error(
                            err.response.data.error || "Грешка при изпращане",
                        );
                    } else {
                        console.error(err);
                        toast.error("Грешка при изпращане");
                    }
                }
            };

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuLabel>Опции</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                router.push(`/admin/sizes/${size.id}`)
                            }
                        >
                            Редактиране
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600"
                            onClick={handleDelete}
                        >
                            Изтриване
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
