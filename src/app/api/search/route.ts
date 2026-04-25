import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/client";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json({ products: [] });
  }

  try {
    const searchQuery = q + "*";
    const products = await client.fetch(
      `*[_type == "product" && (name match $searchQuery || sku match $searchQuery)] | order(name asc) [0...10] {
        name, slug, price, oldPrice, mainImage,
        "category": category->{ name }
      }`,
      { searchQuery } as any
    );

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}