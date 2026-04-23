import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

export async function GET() {
  try {
    const products = await client.fetch(
      `*[_type == "product"] | order(name asc) { _id, name, slug }`
    );
    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ products: [] });
  }
}
