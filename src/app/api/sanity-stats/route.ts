import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '777maat6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function GET() {
  try {
    // Общее количество товаров
    const totalProducts = await sanityClient.fetch(
      `count(*[_type == "product"])`
    );

    // Товары с promId
    const productsWithPromId = await sanityClient.fetch(
      `count(*[_type == "product" && defined(promId)])`
    );

    // Товары без promId (старые)
    const productsWithoutPromId = await sanityClient.fetch(
      `count(*[_type == "product" && !defined(promId)])`
    );

    // Проверка на дубли по promId
    const duplicates = await sanityClient.fetch(
      `*[_type == "product" && defined(promId)] | order(promId) {
        promId,
        "count": count(*[_type == "product" && promId == ^.promId])
      } [count > 1][0...10]`
    );

    // Последние 10 товаров
    const latestProducts = await sanityClient.fetch(
      `*[_type == "product"] | order(_createdAt desc) [0...10] {
        _id,
        name,
        promId,
        _createdAt
      }`
    );

    return NextResponse.json({
      success: true,
      stats: {
        total: totalProducts,
        withPromId: productsWithPromId,
        withoutPromId: productsWithoutPromId,
        duplicatesFound: duplicates.length,
      },
      duplicates: duplicates,
      latestProducts: latestProducts,
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
