"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FiTrash2 } from "react-icons/fi";
import { ChevronRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DeleteAll() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleDelete = async (withTruncate: boolean) => {
        setLoading(true);

        try {
            await axios.delete("/api/sizes/delete-all", {
                data: {
                    with_truncate: withTruncate,
                },
            });

            toast.success(
                withTruncate
                    ? "Всички размери бяха изтрити (TRUNCATE)"
                    : "Всички размери бяха изтрити",
            );

            router.refresh();
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Грешка при изтриване");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="lg" disabled={loading}>
                    <FiTrash2 className="mr-2" />
                    Изтриване
                </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
                <AlertDialogHeader className="mb-5">
                    <AlertDialogTitle className="mb-3">
                        Сигурни ли сте?
                    </AlertDialogTitle>

                    <div className="space-y-5">
                        <p>
                            Това действие ще{" "}
                            <strong>премахне всички размери</strong> от
                            системата.
                        </p>

                        <p>
                            След изтриването размерите{" "}
                            <strong>няма да могат да бъдат възстановени</strong>
                            .
                        </p>

                        <div className="space-y-2">
                            <p>Можете да изберете:</p>

                            <div className="flex items-start gap-2">
                                <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0" />
                                <p>
                                    <strong>Изтриване</strong> – стандартно
                                    премахване на размерите
                                </p>
                            </div>

                            <div className="flex items-start gap-2">
                                <ChevronRightIcon className="mt-1 h-4 w-4 shrink-0" />
                                <p>
                                    <strong>Пълно изчистване</strong> – напълно
                                    изчиства списъка с размери
                                </p>
                            </div>
                        </div>
                    </div>
                </AlertDialogHeader>

                <AlertDialogFooter className="gap-2">
                    <AlertDialogCancel disabled={loading}>
                        Отказ
                    </AlertDialogCancel>

                    <AlertDialogAction
                        disabled={loading}
                        className=""
                        variant={"destructive"}
                        onClick={() => handleDelete(false)}
                    >
                        Изтриване
                    </AlertDialogAction>

                    <AlertDialogAction
                        disabled={loading}
                        variant={"destructive"}
                        onClick={() => handleDelete(true)}
                    >
                        Пълно изчистване
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}