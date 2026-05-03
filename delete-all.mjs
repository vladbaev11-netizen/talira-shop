// delete-all.mjs
// Deletes ALL products, categories and subcategories from Sanity CMS
// Run: set SANITY_WRITE_TOKEN=your_token
//      node delete-all.mjs

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function deleteAll(type, label) {
  const items = await client.fetch(`*[_type == "${type}"]{ _id }`);
  console.log(`${label}: ${items.length} to delete`);
  
  if (items.length === 0) return;
  
  const batchSize = 100;
  let deleted = 0;
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const transaction = client.transaction();
    for (const item of batch) {
      transaction.delete(item._id);
    }
    try {
      await transaction.commit();
      deleted += batch.length;
      console.log(`  Deleted: ${deleted}/${items.length}`);
    } catch (e) {
      console.error(`  Error: ${e.message}`);
    }
  }
}

async function run() {
  console.log("=== DELETE ALL ===");
  console.log("WARNING: This will delete ALL products, categories and subcategories!\n");
  
  // Delete products first (they reference categories)
  await deleteAll("product", "Products");
  
  // Delete customer reviews
  await deleteAll("customerReview", "Customer Reviews");
  
  // Delete subcategories (they reference categories)
  await deleteAll("subcategory", "Subcategories");
  
  // Delete categories
  await deleteAll("category", "Categories");
  
  // Also delete orphaned images (optional - saves space)
  // await deleteAll("sanity.imageAsset", "Images");
  
  console.log("\n=== DONE - CMS is clean ===");
}

run().catch(console.error);
