// fix-categories.mjs
// Reassigns categories and subcategories for all products based on smart mapping
// Run: set SANITY_WRITE_TOKEN=your_token
//      node fix-categories.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const mapping = JSON.parse(fs.readFileSync("smart-mapping.json", "utf-8"));

async function run() {
  console.log("=== FIX CATEGORIES ===");

  const products = await client.fetch('*[_type == "product"]{ _id, sku, name }');
  console.log("Products in CMS: " + products.length);

  let updated = 0, skipped = 0, deleted = 0;
  const batchSize = 50;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const transaction = client.transaction();
    let hasChanges = false;

    for (const p of batch) {
      if (!p.sku) { skipped++; continue; }
      const map = mapping[p.sku.toLowerCase()];
      if (!map) { skipped++; continue; }

      // Skip products (взуття, уцінка) — delete them
      if (map.skip) {
        transaction.delete(p._id);
        deleted++;
        hasChanges = true;
        continue;
      }

      const catId = "category-" + map.category;
      const subcatId = "subcategory-" + map.subcategory;

      transaction.patch(p._id, {
        set: {
          category: { _type: "reference", _ref: catId },
          subcategory: { _type: "reference", _ref: subcatId },
        }
      });
      hasChanges = true;
    }

    if (hasChanges) {
      try {
        await transaction.commit();
        updated += batch.length;
        console.log("  Updated: " + updated + "/" + products.length);
      } catch (e) {
        console.error("  Error: " + e.message);
      }
    }
  }

  console.log("\n=== DONE ===");
  console.log("Updated: " + updated);
  console.log("Skipped: " + skipped);
  console.log("Deleted (взуття/уцінка): " + deleted);
}

run().catch(console.error);
