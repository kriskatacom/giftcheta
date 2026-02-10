import Link from "next/link";
import { redirect } from "next/navigation";
import { FiCheckCircle } from "react-icons/fi";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getDb } from "@/lib/db";
import { OrderService } from "@/lib/services/order-service";
import { formatPrice } from "@/lib/utils";
import MainNavbar from "@/components/main-navbar";
import AppImage from "@/components/AppImage";
import { Badge } from "@/components/ui/badge";
import { ORDER_STATUSES, PAYMENT_STATUSES } from "@/lib/constants";

type OrderThankYouProps = {
    params: Promise<{
        order_number: string;
    }>;
};

const orderService = new OrderService(getDb());

export default async function OrderThankYou({ params }: OrderThankYouProps) {
    const { order_number } = await params;

    const order = await orderService.getOrderByColumn(
        "order_number",
        order_number,
    );

    if (!order) {
        return redirect("/");
    }

    return (
        <main>
            <MainNavbar />
            <div className="min-h-screen flex items-center justify-center bg-gray-50 md:p-5">
                <div className="bg-white rounded-2xl shadow-md p-5 lg:p-10 max-w-4xl text-center space-y-5">
                    <div className="flex justify-center">
                        <FiCheckCircle className="text-green-500 w-16 h-16" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Поръчката е потвърдена!
                    </h1>
                    <p className="text-gray-600">
                        Благодарим за поръчката! Вашата поръчка е успешно
                        приета.
                    </p>
                    <div className="space-y-2 text-left">
                        <p className="font-semibold text-gray-700">
                            Номер на поръчка:{" "}
                            <span className="text-primary">
                                {order.order_number}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-700">
                                Статус на поръчката:
                            </span>{" "}
                            <span className="text-gray-800">
                                {ORDER_STATUSES[order.status]}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-700">
                                Статус на плащане:
                            </span>{" "}
                            <span className="text-gray-800">
                                {PAYMENT_STATUSES[order.payment_status]}
                            </span>
                        </p>
                        {order.payment_method && (
                            <p>
                                <span className="font-semibold text-gray-700">
                                    Метод на плащане:
                                </span>{" "}
                                <span className="text-gray-800">
                                    {order.payment_method}
                                </span>
                            </p>
                        )}
                        {order.tracking_number && (
                            <p>
                                <span className="font-semibold text-gray-700">
                                    Номер за проследяване:
                                </span>{" "}
                                <span className="text-gray-800">
                                    {order.tracking_number}
                                </span>
                            </p>
                        )}
                        <p>
                            <span className="font-semibold text-gray-700">
                                Доставка:
                            </span>{" "}
                            <span className="text-gray-800">
                                {order.shipping_provider
                                    ? `${order.shipping_provider} (${formatPrice(order.shipping_cost)})`
                                    : "Не е зададено"}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold text-gray-700">
                                Обща сума:
                            </span>{" "}
                            <span className="text-gray-800">
                                {formatPrice(order.total_amount)}
                            </span>
                        </p>
                        {order.notes && (
                            <p>
                                <span className="font-semibold text-gray-700">
                                    Бележка от клиента:
                                </span>{" "}
                                <span className="text-gray-800">
                                    {order.notes}
                                </span>
                            </p>
                        )}
                    </div>

                    <div className="w-full max-w-[90vw] overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="text-left">
                                        Продукт
                                    </TableHead>
                                    <TableHead className="text-left hidden md:table-cell">
                                        Описание
                                    </TableHead>
                                    <TableHead className="text-left">
                                        Количество
                                    </TableHead>
                                    <TableHead className="text-left">
                                        Цена
                                    </TableHead>
                                    <TableHead className="text-left">
                                        Общо
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {order.items.map((item) => (
                                    <TableRow
                                        key={item.productId}
                                        className="hover:bg-gray-50"
                                    >
                                        <TableCell className="flex items-center gap-2">
                                            {item.image && (
                                                <AppImage
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={60}
                                                    height={60}
                                                    className="min-w-16 min-h-16 object-cover rounded"
                                                />
                                            )}
                                            <span className="min-w-xs text-left font-medium text-gray-700">
                                                {item.name}
                                            </span>
                                        </TableCell>
                                        <TableCell className="min-w-40 text-left text-gray-500 hidden md:table-cell">
                                            {item.description || "-"}
                                        </TableCell>
                                        <TableCell className="min-w-40 text-left text-gray-700">
                                            {item.quantity}
                                        </TableCell>
                                        <TableCell className="min-w-40 text-left text-gray-700">
                                            {formatPrice(item.price)}
                                        </TableCell>
                                        <TableCell className="min-w-40 text-left text-gray-700">
                                            {formatPrice(
                                                item.quantity * item.price,
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>

                    <Link
                        href="/"
                        className="inline-block mt-5 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition"
                    >
                        Върни се в магазина
                    </Link>
                </div>
            </div>
        </main>
    );
}