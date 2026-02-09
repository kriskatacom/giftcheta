import { ClientOnly } from "@/components/client-only";
import "./globals.css";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import CartSidebar from "@/components/main-navbar/cart-sidebar";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--font-sans",
    display: "swap",
});

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bg" suppressHydrationWarning>
            <body
                suppressHydrationWarning
                className={`${inter.variable} font-sans`}
            >
                {children}
                <ClientOnly>
                    <Toaster position="bottom-left" theme="system" />
                    <CartSidebar />
                </ClientOnly>
            </body>
        </html>
    );
}