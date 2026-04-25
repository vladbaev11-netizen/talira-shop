// fix-prices-v4.mjs
// Цена = файловая цена (уже с наценкой поставщика) + 15%
// Run: set SANITY_WRITE_TOKEN=your_token
//      node fix-prices-v4.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Original file prices (with supplier markup already included)
// Current prices in Sanity = file_price * 1.4
// We need: price = file_price * 1.15
// So: new_price = current_price / 1.4 * 1.15

async function run() {
  console.log("=== FIX PRICES V4 ===");
  console.log("Formula: file_price * 1.15 (15% markup on file price)");

  const products = await client.fetch('*[_type == "product"]{ _id, name, price, oldPrice }');
  console.log("Products: " + products.length);

  let fixed = 0;
  const batchSize = 50;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const transaction = client.transaction();

    for (const p of batch) {
      // Recover original file price: current price was file * 1.4
      const filePrice = Math.round(p.price / 1.4);
      
      // New sell price = file price + 15%
      const sellPrice = Math.round(filePrice * 1.15);
      
      // Old price = random 5-30% higher for visual discount
      const discountPct = 5 + Math.floor(Math.random() * 26);
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

  console.log("\n=== DONE: " + fixed + " fixed ===");
}

run().catch(console.error);
