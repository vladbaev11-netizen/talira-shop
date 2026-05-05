import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const KEEP_CATS = ["cat-kuhnia","cat-dim","cat-elektronika","cat-osvitlennya","cat-krasa","cat-zdorovia","cat-dytiachi","cat-pobutova","cat-turyzm","cat-zoo","cat-avto","cat-instrumenty","cat-bezpeka","cat-telefony"];

async function run() {
  console.log("=== DELETE DUPLICATE CATEGORIES ===\n");

  const allCats = await client.fetch('*[_type == "category"]{ _id, name, slug, "count": count(*[_type == "product" && category._ref == ^._id]) }');
  console.log("Categories: " + allCats.length);

  const toDelete = allCats.filter(c => !KEEP_CATS.includes(c._id));
  console.log("To delete: " + toDelete.length);

  for (const cat of toDelete) {
    console.log(`  ${cat.count} | ${cat.name} (${cat._id})`);
  }

  if (toDelete.length === 0) { console.log("\nNothing to delete"); return; }

  // Move products from old cats to "dim" category as fallback
  for (const cat of toDelete) {
    if (cat.count > 0) {
      console.log(`\nReassigning ${cat.count} products from "${cat.name}" to "Дім та інтер'єр"...`);
      const products = await client.fetch('*[_type == "product" && category._ref == $catId]{ _id }', { catId: cat._id });
      for (let i = 0; i < products.length; i += 100) {
        const tx = client.transaction();
        products.slice(i, i + 100).forEach(p => tx.patch(p._id, { set: { category: { _type: "reference", _ref: "cat-dim" }, subcategory: { _type: "reference", _ref: "sub-dim-inshe" } } }));
        await tx.commit();
      }
    }
  }

  // Delete the old categories
  for (let i = 0; i < toDelete.length; i += 50) {
    const tx = client.transaction();
    toDelete.slice(i, i + 50).forEach(c => tx.delete(c._id));
    try { await tx.commit(); console.log("  Deleted batch"); } catch(e) { console.log("  Skip: " + e.message); }
  }

  console.log("\n=== DONE ===");
}

run().catch(console.error);
