import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { Metadata } from "next";
import { ClientOnly } from "@/components/client-only";
import CartSidebar from "@/components/main-navbar/cart-sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getFullUrl, websiteName } from "@/lib/utils";
import "./globals.css";

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--font-sans",
    display: "swap",
});

export function generateMetadata(): Metadata {
    return {
        title: websiteName(),
        description: "",
        applicationName: websiteName(),
        authors: [
            {
                name: "Кристиан Костадинов",
                url: "https://kriskata.com",
            },
        ],
        alternates: {
            canonical: getFullUrl(),
        },
        openGraph: {
            title: websiteName(),
            description: "",
            images: [
                {
                    url: getFullUrl("/images/giftcheta-logo.png"),
                    alt: "Giftcheta Logo",
                },
            ],
        },
    };
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="bg" suppressHydrationWarning>
            <body
                className={`${inter.variable} font-sans`}
                suppressHydrationWarning
            >
                <ClientOnly>
                    <TooltipProvider>{children}</TooltipProvider>
                    <Toaster position="bottom-left" theme="system" />
                    <CartSidebar />
                </ClientOnly>
            </body>
        </html>
    );
}