import { client } from "@/sanity/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { urlFor } from "@/sanity/image";
import type { Metadata } from "next";
import PromoClient from "./PromoClient";

export const metadata: Metadata = {
  title: "Масажер N7 з підігрівом — Знижка сьогодні | TALIRA",
  description: "Бездротовий масажер N7 з інфрачервоним підігрівом та 10 режимами. Знімає біль та напругу за 15 хвилин. Безкоштовна доставка, оплата при отриманні.",
};

export const revalidate = 60;

async function getProduct() {
  return client.fetch(`*[_type == "product" && slug.current == "kompaktnyy-bezdrotovyy-masazher-n7-z-pidihrivom-i-10-rezhymamy"][0] {
    name, slug, price, oldPrice, mainImage, gallery,
    shortDescription, benefits, specs,
    "reviews": reviews[!defined(approved) || approved]
  }`);
}

export default async function PromoN7Page() {
  const product = await getProduct();
  if (!product) return <div>{"Товар не знайдено"}</div>;

  const allImages = [product.mainImage, ...(product.gallery || [])].filter((img: any) => img && img.asset);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const mainImageUrl = allImages[0] ? urlFor(allImages[0]).width(800).height(800).url() : "";

  return (
    <>
      <Header />
      <PromoClient product={JSON.parse(JSON.stringify(product))} />
      <Footer />
    </>
  );
}
