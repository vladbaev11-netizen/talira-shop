// set-category-images.mjs
// Takes main image from first product in each category and sets it as category image
// Run: set SANITY_WRITE_TOKEN=your_token
//      node set-category-images.mjs

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  console.log("=== SET CATEGORY IMAGES ===");

  // Get all categories
  const categories = await client.fetch('*[_type == "category"]{ _id, name, slug, image }');
  console.log("Categories: " + categories.length);

  for (const cat of categories) {
    // Find first product in this category that has an image
    const product = await client.fetch(
      '*[_type == "product" && category._ref == $catId && defined(mainImage)][0]{ mainImage }',
      { catId: cat._id }
    );

    if (product && product.mainImage && product.mainImage.asset) {
      // Copy the image reference to category
      await client.patch(cat._id).set({
        image: {
          _type: "image",
          asset: product.mainImage.asset,
        }
      }).commit();
      console.log("  + " + cat.name + " - image set");
    } else {
      console.log("  - " + cat.name + " - no products with images found");
    }
  }

  console.log("\n=== DONE ===");
}

run().catch(console.error);
