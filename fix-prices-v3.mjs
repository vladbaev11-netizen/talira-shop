// fix-prices-v3.mjs
// Run: set SANITY_WRITE_TOKEN=your_token
//      node fix-prices-v3.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const skuPrices = JSON.parse(fs.readFileSync("sku-prices-fixed.json", "utf-8"));

async function run() {
  console.log("=== FIX PRICES V3 ===");

  const products = await client.fetch('*[_type == "product"]{ _id, name, sku, price, oldPrice }');
  console.log("Products: " + products.length);

  let fixed = 0, skipped = 0;
  const batchSize = 50;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const transaction = client.transaction();
    let batchHasChanges = false;

    for (const p of batch) {
      if (!p.sku) { skipped++; continue; }
      
      const dropPrice = skuPrices[p.sku.toLowerCase()];
      if (!dropPrice) { skipped++; continue; }

      const sellPrice = Math.round(dropPrice * 1.4);
      const discountPct = 5 + Math.floor(Math.random() * 36);
      const oldPrice = Math.round(sellPrice / (1 - discountPct / 100));

      transaction.patch(p._id, {
        set: { price: sellPrice, oldPrice: oldPrice }
      });
      batchHasChanges = true;
    }

    if (batchHasChanges) {
      try {
        await transaction.commit();
        fixed += batch.length;
        console.log("  Fixed: " + fixed + "/" + products.length);
      } catch (e) {
        console.error("  Error: " + e.message);
      }
    }
  }

  console.log("\n=== DONE: " + fixed + " fixed, " + skipped + " skipped ===");
}

run().catch(console.error);
