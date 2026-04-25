import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const products = await client.fetch(
      `*[_type == "product" && (
        name match $query ||
        sku match $query
      )] | order(name asc) [0...10] {
        name, slug, price, oldPrice, mainImage,
        "category": category->{ name }
      }`,
      { query: q + "*" }
    );

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
