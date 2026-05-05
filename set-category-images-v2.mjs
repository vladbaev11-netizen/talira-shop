// set-category-images.mjs
// Takes first product image from each category and sets as category image
// Works with both Sanity images and external URLs
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

  const categories = await client.fetch('*[_type == "category"]{ _id, name }');
  console.log("Categories: " + categories.length);

  for (const cat of categories) {
    // Find first product with image
    const product = await client.fetch(
      '*[_type == "product" && category._ref == $catId && (defined(mainImage) || defined(externalImages))][0]{ mainImage, externalImages }',
      { catId: cat._id }
    );

    if (product && product.mainImage && product.mainImage.asset) {
      // Sanity image
      await client.patch(cat._id).set({
        image: { _type: "image", asset: product.mainImage.asset }
      }).commit();
      console.log("  + " + cat.name + " - sanity image set");
    } else if (product && product.externalImages && product.externalImages.length > 0) {
      // External URL - need to upload to Sanity
      const url = product.externalImages[0];
      try {
        const res = await fetch(url);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          const asset = await client.assets.upload("image", Buffer.from(buf), {
            filename: "category-" + cat._id + ".jpg",
          });
          await client.patch(cat._id).set({
            image: { _type: "image", asset: { _type: "reference", _ref: asset._id } }
          }).commit();
          console.log("  + " + cat.name + " - uploaded from external URL");
        } else {
          console.log("  - " + cat.name + " - failed to fetch image");
        }
      } catch (e) {
        console.log("  - " + cat.name + " - error: " + e.message);
      }
    } else {
      console.log("  - " + cat.name + " - no products with images");
    }
  }

  console.log("\n=== DONE ===");
}

run().catch(console.error);
