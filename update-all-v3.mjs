import { createClient } from "@sanity/client";
import fs from "fs";
const client = createClient({ projectId: "777maat6", dataset: "production", apiVersion: "2024-01-01", token: process.env.SANITY_WRITE_TOKEN, useCdn: false });
const skuData = JSON.parse(fs.readFileSync("sku-fulldata-v3.json", "utf-8"));
function textToBlocks(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) return null;
  return paragraphs.map(text => ({ _type: "block", _key: Math.random().toString(36).slice(2, 10), style: "normal", markDefs: [], children: [{ _type: "span", _key: Math.random().toString(36).slice(2, 10), marks: [], text }] }));
}
async function run() {
  console.log("=== UPDATE ALL V3 ===");
  const products = await client.fetch('*[_type == "product"]{ _id, sku }');
  console.log("Products: " + products.length);
  let updated = 0, skipped = 0;
  const bs = 50;
  for (let i = 0; i < products.length; i += bs) {
    const batch = products.slice(i, i + bs);
    const tx = client.transaction();
    let has = false;
    for (const p of batch) {
      if (!p.sku) { skipped++; continue; }
      const d = skuData[p.sku.toLowerCase()];
      if (!d) { skipped++; continue; }
      const u = {};
      const bl = textToBlocks(d.description);
      if (bl && bl.length > 0) u.description = bl;
      if (d.specs && d.specs.length > 0) u.specs = d.specs.map(s => ({ _type: "object", _key: Math.random().toString(36).slice(2,10), label: s.label, value: s.value }));
      if (d.benefits && d.benefits.length > 0) u.benefits = d.benefits;
      if (Object.keys(u).length > 0) { tx.patch(p._id, { set: u }); has = true; }
    }
    if (has) {
      try { await tx.commit(); updated += batch.length; console.log("  " + updated + "/" + products.length); }
      catch (e) { console.error("  Error: " + e.message); }
    } else { skipped += batch.length; }
  }
  console.log("\n=== DONE: " + updated + " updated ===");
}
run().catch(console.error);
