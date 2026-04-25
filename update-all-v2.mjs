// update-all-v2.mjs
// Updates descriptions (clean), specs, and benefits for all products
// Run: set SANITY_WRITE_TOKEN=your_token
//      node update-all-v2.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const skuData = JSON.parse(fs.readFileSync("sku-fulldata-v2.json", "utf-8"));

function textToBlocks(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) return null;
  return paragraphs.map(text => ({
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    markDefs: [],
    children: [{
      _type: "span",
      _key: Math.random().toString(36).slice(2, 10),
      marks: [],
      text: text,
    }],
  }));
}

async function run() {
  console.log("=== UPDATE ALL V2 ===");
  console.log("Clean descriptions + specs + benefits");

  const products = await client.fetch('*[_type == "product"]{ _id, sku }');
  console.log("Products in CMS: " + products.length);

  let updated = 0, skipped = 0;
  const batchSize = 50;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const transaction = client.transaction();
    let hasChanges = false;

    for (const p of batch) {
      if (!p.sku) { skipped++; continue; }

      const data = skuData[p.sku.toLowerCase()];
      if (!data) { skipped++; continue; }

      const updates = {};

      // Clean description
      const blocks = textToBlocks(data.description);
      if (blocks && blocks.length > 0) {
        updates.description = blocks;
      }

      // Specs
      if (data.specs && data.specs.length > 0) {
        updates.specs = data.specs.map(s => ({
          _type: "object",
          _key: Math.random().toString(36).slice(2, 10),
          label: s.label,
          value: s.value,
        }));
      }

      // Benefits
      if (data.benefits && data.benefits.length > 0) {
        updates.benefits = data.benefits;
      }

      if (Object.keys(updates).length > 0) {
        transaction.patch(p._id, { set: updates });
        hasChanges = true;
      }
    }

    if (hasChanges) {
      try {
        await transaction.commit();
        updated += batch.length;
        console.log("  Updated: " + updated + "/" + products.length);
      } catch (e) {
        console.error("  Error: " + e.message);
      }
    } else {
      skipped += batch.length;
    }
  }

  console.log("\n=== DONE: " + updated + " updated, " + skipped + " skipped ===");
}

run().catch(console.error);
