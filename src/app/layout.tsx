import type { Metadata } from "next";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
import { CartProvider } from "@/components/CartContext";
import FloatingCart from "@/components/FloatingCart";

export const metadata: Metadata = {
  title: "TALIRA — Преміум-товари для дому, краси та здоров'я",
  description: "Ретельно підібрана колекція меблів з підсвіткою, масажерів, електроніки та б'юті-рішень з європейською якістю.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body>
        <CartProvider>
          {children}
          <FloatingCart />
        </CartProvider>
        <FacebookPixel />
      </body>
    </html>
  );
}
