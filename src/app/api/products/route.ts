import { NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '777maat6',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const PROM_API_TOKEN = process.env.PROM_API_TOKEN || '55eb63161e2e1650bff897b784dbac441688eee8';
const PROM_API_URL = 'https://my.prom.ua/api/v1/products/list';

interface PromProduct {
  id: number;
  name: string;
  sku?: string;
  price: number;
  discount_price?: number;
  main_image?: string;
  images?: string[];
  description?: string;
  presence: string;
  group?: {
    id: number;
    name: string;
  };
}

interface SanityProduct {
  _id: string;
  _type: 'product';
  promId: number;
  name: string;
  slug: { current: string; _type: 'slug' };
  price: number;
  oldPrice?: number;
  description?: string;
  mainImage?: { _type: 'image'; asset: { _type: 'reference'; _ref: string } };
  externalImages?: string[];
  inStock: boolean;
  category?: { _type: 'reference'; _ref: string };
  _createdAt?: string;
}

// Функция для получения товаров с Prom.ua
async function fetchPromProducts(): Promise<PromProduct[]> {
  try {
    const response = await fetch(`${PROM_API_URL}?limit=1000`, {
      headers: {
        'Authorization': `Bearer ${PROM_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Prom.ua API error: ${response.status}`);
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching from Prom.ua:', error);
    throw error;
  }
}

// Функция для создания slug из названия
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 96);
}

// Функция для загрузки изображения в Sanity
async function uploadImageToSanity(imageUrl: string): Promise<string | null> {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const asset = await sanityClient.assets.upload('image', Buffer.from(buffer), {
      filename: imageUrl.split('/').pop() || 'product-image.jpg',
    });
    return asset._id;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}

// Функция для поиска или создания категории
async function findOrCreateCategory(categoryName: string): Promise<string> {
  const slug = createSlug(categoryName);
  
  // Ищем существующую категорию
  const existingCategory = await sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]`,
    { slug }
  );

  if (existingCategory) {
    return existingCategory._id;
  }

  // Создаём новую категорию
  const newCategory = await sanityClient.create({
    _type: 'category',
    name: categoryName,
    slug: { _type: 'slug', current: slug },
  });

  return newCategory._id;
}

// Основная функция синхронизации
export async function GET() {
  try {
    console.log('🔄 Starting sync with Prom.ua...');

    // 1. Получаем товары с Prom.ua
    const promProducts = await fetchPromProducts();
    console.log(`📦 Fetched ${promProducts.length} products from Prom.ua`);

    // 2. Получаем существующие товары из Sanity
    const sanityProducts = await sanityClient.fetch<SanityProduct[]>(
      `*[_type == "product"]{ _id, promId, _createdAt }`
    );

    const sanityProductsMap = new Map(
      sanityProducts.map(p => [p.promId, p])
    );

    // 3. Обрабатываем товары
    const newProducts: PromProduct[] = [];
    const updatedProducts: PromProduct[] = [];

    for (const promProduct of promProducts) {
      const existingProduct = sanityProductsMap.get(promProduct.id);

      if (!existingProduct) {
        newProducts.push(promProduct);
      } else {
        updatedProducts.push(promProduct);
      }
    }

    console.log(`✨ New products: ${newProducts.length}`);
    console.log(`🔄 Products to update: ${updatedProducts.length}`);

    // 4. Добавляем новые товары
    const todayDate = new Date().toISOString().split('T')[0];
    
    for (const product of newProducts) {
      try {
        const slug = createSlug(product.name);
        
        // Загружаем главное изображение
        let mainImageRef = null;
        if (product.main_image) {
          mainImageRef = await uploadImageToSanity(product.main_image);
        }

        // Находим/создаём категорию
        let categoryRef = null;
        if (product.group?.name) {
          categoryRef = await findOrCreateCategory(product.group.name);
        }

        // Создаём товар в Sanity
        await sanityClient.create({
          _type: 'product',
          promId: product.id,
          name: product.name,
          slug: { _type: 'slug', current: slug },
          price: product.discount_price || product.price,
          oldPrice: product.discount_price ? product.price : undefined,
          description: product.description,
          mainImage: mainImageRef ? {
            _type: 'image',
            asset: { _type: 'reference', _ref: mainImageRef }
          } : undefined,
          externalImages: product.images || [],
          inStock: product.presence === 'available',
          category: categoryRef ? { _type: 'reference', _ref: categoryRef } : undefined,
        });

        console.log(`✅ Created: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error creating product ${product.id}:`, error);
      }
    }

    // 5. Обновляем существующие товары
    for (const product of updatedProducts) {
      try {
        const existingProduct = sanityProductsMap.get(product.id);
        if (!existingProduct) continue;

        await sanityClient
          .patch(existingProduct._id)
          .set({
            name: product.name,
            price: product.discount_price || product.price,
            oldPrice: product.discount_price ? product.price : undefined,
            inStock: product.presence === 'available',
          })
          .commit();

        console.log(`🔄 Updated: ${product.name}`);
      } catch (error) {
        console.error(`❌ Error updating product ${product.id}:`, error);
      }
    }

    // 6. Создаём запись "Поступление" если есть новые товары
    if (newProducts.length > 0) {
      try {
        await sanityClient.create({
          _type: 'arrival',
          date: todayDate,
          productCount: newProducts.length,
          products: newProducts.map(p => p.id),
        });
        console.log(`📅 Created arrival record for ${todayDate}`);
      } catch (error) {
        console.error('❌ Error creating arrival record:', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Sync completed',
      stats: {
        total: promProducts.length,
        new: newProducts.length,
        updated: updatedProducts.length,
      },
    });

  } catch (error) {
    console.error('❌ Sync error:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
