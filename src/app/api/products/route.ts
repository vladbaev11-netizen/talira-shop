import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '777maat6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50); // Макс 50!
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const priceMin = searchParams.get('priceMin');
    const priceMax = searchParams.get('priceMax');
    const inStock = searchParams.get('inStock') === 'true';

    const offset = (page - 1) * limit;

    // Построение фильтра
    let filter = '_type == "product"';
    
    if (category && category !== 'all') {
      filter += ` && category->slug.current == "${category}"`;
    }

    if (search) {
      filter += ` && name match "${search}*"`;
    }

    if (priceMin) {
      filter += ` && price >= ${priceMin}`;
    }

    if (priceMax) {
      filter += ` && price <= ${priceMax}`;
    }

    if (inStock) {
      filter += ` && inStock == true`;
    }

    // Запрос с пагинацией
    const query = `{
      "products": *[${filter}] | order(_createdAt desc) [${offset}...${offset + limit}] {
        _id,
        name,
        slug,
        price,
        oldPrice,
        badge,
        mainImage,
        externalImages,
        "category": category->{name},
        inStock
      },
      "total": count(*[${filter}])
    }`;

    const data = await sanityClient.fetch(query);

    return NextResponse.json({
      products: data.products,
      total: data.total,
      page,
      limit,
      hasMore: offset + limit < data.total,
    });

  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
