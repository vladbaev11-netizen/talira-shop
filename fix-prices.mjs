// fix-prices.mjs
// Run: set SANITY_WRITE_TOKEN=your_token
//      node fix-prices.mjs

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  console.log("=== FIX PRICES ===");
  
  // Fetch all products
  const products = await client.fetch(`*[_type == "product"]{ _id, name, price, oldPrice }`);
  console.log("Products found: " + products.length);

  let fixed = 0;
  const batchSize = 50;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const transaction = client.transaction();

    for (const p of batch) {
      // Current price is drop * 1.4, but oldPrice was calculated wrong
      // price is correct (drop * 1.4)
      // oldPrice should be price * (1 + random 5-40%)
      // We recalculate oldPrice from current price
      
      const discountPct = 5 + Math.floor(Math.random() * 36); // 5-40%
      const newOldPrice = Math.round(p.price * (1 + discountPct / 100));

      transaction.patch(p._id, {
        set: { oldPrice: newOldPrice }
      });
    }

    try {
      await transaction.commit();
      fixed += batch.length;
      console.log("  Fixed: " + fixed + "/" + products.length);
    } catch (e) {
      console.error("  Batch error: " + e.message);
    }
  }

  console.log("\n=== DONE: " + fixed + " prices fixed ===");
}

run().catch(console.error);
