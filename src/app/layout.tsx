import type { Metadata, Viewport } from "next";
import "./globals.css";
import FacebookPixel from "@/components/FacebookPixel";
import { CartProvider } from "@/components/CartContext";
import FloatingCart from "@/components/FloatingCart";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1a1612",
};

export const metadata: Metadata = {
  title: {
    default: "TALIRA — Преміум-товари для дому, краси та здоров'я",
    template: "%s | TALIRA",
  },
  description: "Інтернет-магазин преміум-товарів для дому, краси та здоров'я. Меблі з підсвіткою, масажери, електроніка, б'юті-рішення. Доставка Новою Поштою, оплата при отриманні.",
  keywords: [
    "інтернет-магазин", "товари для дому", "меблі з підсвіткою",
    "масажери", "електроніка", "краса", "LED меблі",
    "купити онлайн", "Нова Пошта", "оплата при отриманні",
    "Talira", "преміум товари", "Україна",
  ],
  authors: [{ name: "TALIRA" }],
  creator: "TALIRA",
  publisher: "TALIRA",
  metadataBase: new URL("https://talira-shop.vercel.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "uk_UA",
    url: "https://talira-shop.vercel.app",
    siteName: "TALIRA",
    title: "TALIRA — Преміум-товари для дому, краси та здоров'я",
    description: "Ретельно підібрана колекція меблів з підсвіткою, масажерів, електроніки та б'юті-рішень. Доставка по Україні.",
  },
  twitter: {
    card: "summary_large_image",
    title: "TALIRA — Преміум-товари для дому, краси та здоров'я",
    description: "Інтернет-магазин преміум-товарів. Доставка Новою Поштою, оплата при отриманні.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-HP1NGWPK5G"></script>
<script dangerouslySetInnerHTML={{ __html: "window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','G-HP1NGWPK5G')" }} />
        <meta name="google-site-verification" content="CEO2PrkPXv-ELO6n4OycsHxD62VRF6781KwlyXY6gLY" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "TALIRA",
              url: "https://talira-shop.vercel.app",
              description: "Інтернет-магазин преміум-товарів для дому, краси та здоров'я",
              currenciesAccepted: "UAH",
              paymentAccepted: "Cash on Delivery",
              areaServed: {
                "@type": "Country",
                name: "Ukraine",
              },
              potentialAction: {
                "@type": "SearchAction",
                target: "https://talira-shop.vercel.app/catalog?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
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
