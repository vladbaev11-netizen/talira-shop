import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: "sk9XISqw0EVMeS1KX1frzrDQXGRJswHGK4KpGTbKEGmmSVpApMn3qkc0Qa5x4sSx6TszK2GDjs2fmmlHuyylWdCvt6fdYdPitKZQyIc1QRcEofF1h4k3MLRbDr7QkCVhXvV4ZyLE90PNofJKWQH905DplvgSDYlHVO9F8F5kYh68PVuRU08P",
  useCdn: false,
});

async function addTestProduct() {
  console.log("Додаю тестовий товар...");

  const product = {
    _type: "product",
    name: "⚠️ ТЕСТОВИЙ ТОВАР — НЕ КУПЛЯТИ",
    slug: { _type: "slug", current: "test-product-1uah" },
    price: 1,
    oldPrice: null,
    inStock: true,
    badge: null,
    description: "Цей товар створено для тестування онлайн оплати MonoPay. Не купляйте його!",
    category: { _type: "reference", _ref: "cat-dim" },
    subcategory: { _type: "reference", _ref: "sub-dim-inshe" },
    externalImages: [],
  };

  try {
    const result = await client.create(product);
    console.log("✅ Тестовий товар додано!");
    console.log("📦 Назва:", result.name);
    console.log("💰 Ціна:", result.price, "₴");
    console.log("🔗 URL: https://talira-shop.vercel.app/product/test-product-1uah");
  } catch (error) {
    console.error("❌ Помилка:", error);
  }
}

addTestProduct();
