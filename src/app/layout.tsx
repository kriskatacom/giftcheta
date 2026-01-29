import "./globals.css";
import { Inter } from "next/font/google";

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
            </body>
        </html>
    );
}
