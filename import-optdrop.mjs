// import-optdrop.mjs
// Imports products from opt-drop.com into Sanity CMS
// Run: set SANITY_WRITE_TOKEN=your_token
//      node import-optdrop.mjs

import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const data = JSON.parse(fs.readFileSync("import-optdrop.json", "utf-8"));

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
  console.log("=== IMPORT OPT-DROP ===");
  console.log("Products: " + data.products.length);

  let ok = 0, fail = 0;

  for (let i = 0; i < data.products.length; i++) {
    const p = data.products[i];
    const catId = "category-" + p.category_slug;
    const subcatId = "subcategory-" + p.subcategory_slug;

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
        subcategory: { _type: "reference", _ref: subcatId },
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
      if (ok % 10 === 0 || ok === 1) console.log("  [" + ok + "/" + data.products.length + "] " + p.name.slice(0, 50));
    } catch (e) {
      fail++;
      if (fail <= 10) console.error("  x " + p.name.slice(0, 40) + ": " + e.message);
    }
  }

  console.log("\n=== DONE: " + ok + " ok, " + fail + " fail ===");
}

run().catch(console.error);
