// fix-prices-v2.mjs
// Пересчитывает ОБЕ цены от оригинальной дроп-цены
// Run: set SANITY_WRITE_TOKEN=your_token
//      node fix-prices-v2.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Load original drop prices by SKU
const skuPrices = JSON.parse(fs.readFileSync("sku-prices.json", "utf-8"));

async function run() {
  console.log("=== FIX PRICES V2 ===");

  const products = await client.fetch('*[_type == "product"]{ _id, name, sku, price, oldPrice }');
  console.log("Products: " + products.length);

  let fixed = 0, skipped = 0;
  const batchSize = 50;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const transaction = client.transaction();

    for (const p of batch) {
      const dropPrice = skuPrices[p.sku];
      if (!dropPrice) {
        skipped++;
        continue;
      }

      // Correct price = drop * 1.4
      const sellPrice = Math.round(dropPrice * 1.4);

      // Old price = sell price + random 5-40% markup for visual discount
      const discountPct = 5 + Math.floor(Math.random() * 36);
      const oldPrice = Math.round(sellPrice / (1 - discountPct / 100));

      transaction.patch(p._id, {
        set: { price: sellPrice, oldPrice: oldPrice }
      });
    }

    try {
      await transaction.commit();
      fixed += batch.length;
      console.log("  Fixed: " + fixed + "/" + products.length);
    } catch (e) {
      console.error("  Error: " + e.message);
    }
  }

  console.log("\n=== DONE: " + fixed + " fixed, " + skipped + " skipped ===");
}

run().catch(console.error);
