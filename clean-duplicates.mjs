// clean-duplicates.mjs
// Finds and removes duplicate products (same SKU)
// Run: set SANITY_WRITE_TOKEN=your_token
//      node clean-duplicates.mjs

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  console.log("=== CLEAN DUPLICATES ===");

  const products = await client.fetch('*[_type == "product"]{ _id, sku, name, _createdAt } | order(_createdAt asc)');
  console.log("Total products: " + products.length);

  // Group by SKU
  const skuMap = {};
  for (const p of products) {
    const key = (p.sku || "").toLowerCase();
    if (!key) continue;
    if (!skuMap[key]) skuMap[key] = [];
    skuMap[key].push(p);
  }

  // Find duplicates (keep the latest, delete older ones)
  const toDelete = [];
  for (const [sku, items] of Object.entries(skuMap)) {
    if (items.length > 1) {
      // Keep the last one (most recent), delete the rest
      const sorted = items.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));
      for (let i = 0; i < sorted.length - 1; i++) {
        toDelete.push(sorted[i]);
      }
    }
  }

  console.log("Duplicates to delete: " + toDelete.length);

  if (toDelete.length === 0) {
    console.log("No duplicates found!");
    return;
  }

  // Delete in batches
  const batchSize = 50;
  let deleted = 0;

  for (let i = 0; i < toDelete.length; i += batchSize) {
    const batch = toDelete.slice(i, i + batchSize);
    const transaction = client.transaction();

    for (const p of batch) {
      transaction.delete(p._id);
    }

    try {
      await transaction.commit();
      deleted += batch.length;
      console.log("  Deleted: " + deleted + "/" + toDelete.length);
    } catch (e) {
      console.error("  Error: " + e.message);
    }
  }

  console.log("\n=== DONE: " + deleted + " duplicates removed ===");
  
  // Verify
  const remaining = await client.fetch('count(*[_type == "product"])');
  console.log("Products remaining: " + remaining);
}

run().catch(console.error);
