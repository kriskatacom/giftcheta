"use client";

import { TbTableExport } from "react-icons/tb";
import { Button } from "@/components/ui/button";

export default function Export() {
    const onExport = () => {
        window.location.href = "/api/products/export";
    };

    return (
        <Button variant={"outline"} className="bg-green-500" size={"lg"} onClick={onExport}>
            <TbTableExport />
            <span>Експорт (XLSX)</span>
        </Button>
    );
}