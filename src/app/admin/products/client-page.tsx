"use client";

import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { columns } from "@/app/admin/products/columns";
import { DataTable } from "@/components/data-table";
import { Product } from "@/lib/types";

type ClientPageProps = {
    data: Product[];
};

export default function ClientPage({ data }: ClientPageProps) {

    const router = useRouter();

    async function onBulkDelete(selectedIds: (string | number)[]) {
        try {
            const res = await axios.post("/api/products/bulk-delete", { ids: selectedIds });

            if (res.status === 200) {
                const message = parseInt(res.data.deletedCount) === 1 ? "Беше премахнат 1 продукт." : `Бяха премахнати ${res.data.deletedCount} продукта.`;
                toast.success(message);
                router.refresh();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <DataTable
            columns={columns}
            data={data}
            onBulkDelete={(selectedIds) => onBulkDelete(selectedIds)}
        />
    );
}
