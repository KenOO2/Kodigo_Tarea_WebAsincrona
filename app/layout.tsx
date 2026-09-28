import type { Metadata } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart-store";
import Navbar from "@/components/ui/Navbar";

const pixelFont = Press_Start_2P({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-pixel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pixel Shop — Catálogo",
  description: "Frontend en Next.js para la API de e-commerce (Laravel + Stripe).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body
        className={`${pixelFont.variable} ${inter.variable} bg-paper font-body text-ink antialiased`}
      >
        <CartProvider>
          <Navbar />
          <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
