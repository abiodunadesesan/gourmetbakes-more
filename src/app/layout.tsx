import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext";
import { NoupeChatbot } from "@/components/NoupeChatbot";
import { NoupeOrderHint } from "@/components/NoupeOrderHint";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GourmetBakes & More | Authentic Nigerian Delicacies",
  description:
    "Premium Nigerian baked goods and delicacies — Meat Pies, Agege Bread, Cakes and more, delivered fresh to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-white text-slate-900`}
      >
        <CartProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </CartProvider>
        <NoupeChatbot />
        <NoupeOrderHint />
        <Analytics />
      </body>
    </html>
  );
}
