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
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const priceMin = parseInt(searchParams.get('priceMin') || '0');
    const priceMax = parseInt(searchParams.get('priceMax') || '999999');
    const inStock = searchParams.get('inStock') === 'true';
    const onSale = searchParams.get('onSale') === 'true';
    const isNew = searchParams.get('isNew') === 'true';
    const isHit = searchParams.get('isHit') === 'true';

    // Строим фильтры
    let filters = ['_type == "product"'];

    if (category) {
      filters.push(`category->slug.current == "${category}"`);
    }

    if (search) {
      filters.push(`name match "*${search}*"`);
    }

    if (priceMin > 0 || priceMax < 999999) {
      filters.push(`price >= ${priceMin} && price <= ${priceMax}`);
    }

    if (inStock) {
      filters.push(`inStock == true`);
    }

    if (onSale) {
      filters.push(`defined(oldPrice) && oldPrice > price`);
    }

    if (isNew) {
      filters.push(`isNew == true`);
    }

    if (isHit) {
      filters.push(`isHit == true`);
    }

    const filterQuery = filters.join(' && ');
    const start = (page - 1) * limit;
    const end = start + limit;

    // Получаем товары
    const products = await client.fetch(
      `*[${filterQuery}] | order(_createdAt desc) [${start}...${end}] {
        _id,
        name,
        "slug": slug.current,
        price,
        oldPrice,
        badge,
        mainImage,
        externalImages,
        "category": category->{ name }
      }`
    );

    // Проверяем есть ли ещё товары
    const totalCount = await client.fetch(`count(*[${filterQuery}])`);
    const hasMore = end < totalCount;

    return NextResponse.json({ 
      products, 
      hasMore,
      total: totalCount,
      page,
      limit
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json({ 
      products: [], 
      hasMore: false,
      error: 'Failed to fetch products' 
    }, { status: 500 });
  }
}
