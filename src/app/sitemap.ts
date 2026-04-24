import { client } from "@/sanity/client";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://talira-shop.vercel.app";

  // Fetch all products
  const products = await client.fetch(
    `*[_type == "product"] { slug, _updatedAt }`
  );

  // Fetch all categories
  const categories = await client.fetch(
    `*[_type == "category"] { slug, _updatedAt }`
  );

  // Static pages
  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily" as const, priority: 1.0 },
    { url: baseUrl + "/catalog", lastModified: new Date(), changeFrequency: "daily" as const, priority: 0.9 },
    { url: baseUrl + "/reviews", lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 },
    { url: baseUrl + "/about", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: baseUrl + "/delivery", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: baseUrl + "/contacts", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
    { url: baseUrl + "/cart", lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.3 },
  ];

  // Product pages
  const productPages = products.map((product: any) => ({
    url: baseUrl + "/product/" + product.slug.current,
    lastModified: new Date(product._updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticPages, ...productPages];
}
