import CheckoutForm from "@/app/checkout/checkout-form";
import MainNavbar from "@/components/main-navbar";
import { getUserDataFromSession } from "@/lib/session";

export default async function CheckoutPage() {
    const sessionData = await getUserDataFromSession();
    
    return (
        <>
            <MainNavbar />
            <main className="container mx-auto max-w-2xl py-10 max-md:px-5">
                <h1 className="text-2xl font-semibold mb-6">
                    Данни за поръчка
                </h1>

                <CheckoutForm initialValues={sessionData} />
            </main>
        </>
    );
}