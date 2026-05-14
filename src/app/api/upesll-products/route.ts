import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '777maat6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export async function GET() {
  try {
    // Получаем популярные недорогие товары для upsell
    const products = await client.fetch(
      `*[_type == "product" && price < 500] | order(_createdAt desc) [0...6] {
        _id,
        name,
        "slug": slug.current,
        price,
        "image": images[0].asset->url
      }`
    );

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Upsell API error:', error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
