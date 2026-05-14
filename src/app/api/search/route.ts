import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '777maat6',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [] });
    }

    // Поиск по названию товара
    const results = await client.fetch(
      `*[_type == "product" && name match $searchQuery] | order(_createdAt desc) [0...20] {
        _id,
        name,
        "slug": slug.current,
        price,
        "image": images[0].asset->url,
        "category": category->name
      }`,
      { searchQuery: `*${query}*` }
    );

    return NextResponse.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json({ results: [], error: 'Search failed' }, { status: 500 });
  }
}
