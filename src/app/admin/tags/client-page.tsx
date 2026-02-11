"use client";

import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { columns } from "@/app/admin/tags/columns";
import { DataTable } from "@/components/data-table";
import { Tag } from "@/lib/services/tag-service";

type ClientPageProps = {
    data: Tag[];
};

export default function ClientPage({ data }: ClientPageProps) {

    const router = useRouter();

    async function onBulkDelete(selectedIds: (string | number)[]) {
        try {
            const res = await axios.post("/api/tags/bulk-delete", { ids: selectedIds });

            if (res.status === 200) {
                const message = parseInt(res.data.deletedCount) === 1 ? "Беше премахнат 1 размер." : `Бяха премахнати ${res.data.deletedCount} размера.`;
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
