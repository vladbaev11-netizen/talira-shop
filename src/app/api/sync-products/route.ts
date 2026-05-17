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

// Функция для загрузки изображения в Sanity (отключена для ускорения)
async function uploadImageToSanity(imageUrl: string): Promise<string | null> {
  // Пропускаем загрузку - используем внешние ссылки
  return null;
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

    // 4. Добавляем новые товары (batch)
    const todayDate = new Date().toISOString().split('T')[0];
    
    if (newProducts.length > 0) {
      console.log(`🚀 Creating ${newProducts.length} products in batches...`);
      
      const batchSize = 50;
      for (let i = 0; i < newProducts.length; i += batchSize) {
        const batch = newProducts.slice(i, i + batchSize);
        
        const transaction = sanityClient.transaction();
        
        for (const product of batch) {
          const slug = createSlug(product.name);
          
          // Находим/создаём категорию
          let categoryRef = null;
          if (product.group?.name) {
            categoryRef = await findOrCreateCategory(product.group.name);
          }

          // Создаём товар
          transaction.create({
            _type: 'product',
            promId: product.id,
            name: product.name,
            slug: { _type: 'slug', current: slug },
            price: product.discount_price || product.price,
            oldPrice: product.discount_price ? product.price : undefined,
            description: product.description,
            externalImages: product.images || (product.main_image ? [product.main_image] : []),
            inStock: product.presence === 'available',
            category: categoryRef ? { _type: 'reference', _ref: categoryRef } : undefined,
          });
        }

        await transaction.commit();
        console.log(`✅ Created batch ${i / batchSize + 1} (${batch.length} products)`);
      }
    }

    // 5. Обновляем существующие товары (batch)
    if (updatedProducts.length > 0) {
      console.log(`🔄 Updating ${updatedProducts.length} products in batches...`);
      
      const batchSize = 50;
      for (let i = 0; i < updatedProducts.length; i += batchSize) {
        const batch = updatedProducts.slice(i, i + batchSize);
        
        const transaction = sanityClient.transaction();
        
        for (const product of batch) {
          const existingProduct = sanityProductsMap.get(product.id);
          if (!existingProduct) continue;

          transaction.patch(existingProduct._id, {
            set: {
              name: product.name,
              price: product.discount_price || product.price,
              oldPrice: product.discount_price ? product.price : undefined,
              inStock: product.presence === 'available',
              externalImages: product.images || (product.main_image ? [product.main_image] : []),
            }
          });
        }

        await transaction.commit();
        console.log(`🔄 Updated batch ${i / batchSize + 1} (${batch.length} products)`);
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
