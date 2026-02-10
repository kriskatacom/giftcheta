import CheckoutForm from "@/app/checkout/checkout-form";
import MainNavbar from "@/components/main-navbar";

export default function CheckoutPage() {
    return (
        <>
            <MainNavbar />
            <main className="container mx-auto max-w-2xl py-10">
                <h1 className="text-2xl font-semibold mb-6">
                    Данни за поръчка
                </h1>

                <CheckoutForm />
            </main>
        </>
    );
}