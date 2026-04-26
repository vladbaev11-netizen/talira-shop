// restore-missing.mjs
// Compares import file with CMS and uploads only missing products
// Run: set SANITY_WRITE_TOKEN=your_token
//      node restore-missing.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const data = JSON.parse(fs.readFileSync("import-restore.json", "utf-8"));

async function uploadImage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const asset = await client.assets.upload("image", Buffer.from(buf), {
      filename: url.split("/").pop() || "img.jpg",
    });
    return asset._id;
  } catch { return null; }
}

async function run() {
  console.log("=== RESTORE MISSING PRODUCTS ===");

  // Get all existing SKUs from CMS
  const existing = await client.fetch('*[_type == "product"]{ sku }');
  const existingSkus = new Set(existing.map(p => (p.sku || "").toLowerCase()));
  console.log("Products in CMS: " + existingSkus.size);

  // Find missing products
  const missing = data.products.filter(p => !existingSkus.has(p.sku.toLowerCase()));
  console.log("Missing products to restore: " + missing.length);

  if (missing.length === 0) {
    console.log("Nothing to restore!");
    return;
  }

  // Category IDs
  const catIds = {};
  for (const [slug, name] of Object.entries(data.categories)) {
    const id = "category-" + slug;
    catIds[slug] = id;
  }

  let ok = 0, fail = 0;

  for (let i = 0; i < missing.length; i++) {
    const p = missing[i];
    const catId = catIds[p.category_slug];
    if (!catId) { fail++; continue; }

    try {
      let mainImage;
      if (p.mainImage) {
        const aid = await uploadImage(p.mainImage);
        if (aid) mainImage = { _type: "image", asset: { _type: "reference", _ref: aid } };
      }

      const gallery = [];
      for (const url of (p.gallery || []).slice(0, 4)) {
        const aid = await uploadImage(url);
        if (aid) gallery.push({ _type: "image", _key: Math.random().toString(36).slice(2,10), asset: { _type: "reference", _ref: aid } });
      }

      await client.create({
        _type: "product",
        name: p.name,
        sku: p.sku,
        slug: { _type: "slug", current: p.slug },
        category: { _type: "reference", _ref: catId },
        price: p.price,
        oldPrice: p.oldPrice,
        inStock: true,
        badge: p.badge || undefined,
        shortDescription: p.shortDescription || undefined,
        mainImage,
        gallery: gallery.length ? gallery : undefined,
        reviews: p.reviews.map(r => ({ _type: "object", _key: Math.random().toString(36).slice(2,10), name: r.name, city: r.city, rating: r.rating, text: r.text, approved: r.approved })),
      });

      ok++;
      if (ok % 10 === 0 || ok === 1) console.log("  [" + ok + "/" + missing.length + "] " + p.name.slice(0, 50));
    } catch (e) {
      fail++;
      if (fail <= 5) console.error("  x " + p.name.slice(0, 40) + ": " + e.message);
    }
  }

  console.log("\n=== DONE: " + ok + " restored, " + fail + " failed ===");
}

run().catch(console.error);
