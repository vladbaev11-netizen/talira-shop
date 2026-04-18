import type { Metadata } from "next";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";

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
        {children}
        <FacebookPixel />
      </body>
    </html>
  );
}
