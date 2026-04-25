// update-descriptions.mjs
// Добавляет полные описания и характеристики к существующим товарам
// Run: set SANITY_WRITE_TOKEN=your_token
//      node update-descriptions.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const skuData = JSON.parse(fs.readFileSync("sku-fulldata.json", "utf-8"));

function htmlToBlocks(html) {
  if (!html || html.length < 10) return null;

  // Split HTML into paragraphs
  const parts = html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .split(/\n+/)
    .map(s => s.trim())
    .filter(s => s.length > 2);

  if (parts.length === 0) return null;

  return parts.map(text => ({
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    markDefs: [],
    children: [
      {
        _type: "span",
        _key: Math.random().toString(36).slice(2, 10),
        marks: [],
        text: text,
      },
    ],
  }));
}

async function run() {
  console.log("=== UPDATE DESCRIPTIONS & SPECS ===");

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

      // Description
      const blocks = htmlToBlocks(data.description);
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
