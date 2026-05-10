import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  console.log("=== CHECKING CATEGORIES ===\n");
  
  // Get all categories
  const cats = await client.fetch('*[_type == "category"] | order(name asc) { _id, name, "count": count(*[_type == "product" && category._ref == ^._id]) }');
  
  console.log("Categories:");
  cats.forEach(c => console.log(`  ${c.count.toString().padStart(4)} | ${c.name} (${c._id})`));
  
  console.log("\n=== SUBCATEGORIES WITH MOST PRODUCTS ===\n");
  const subs = await client.fetch('*[_type == "subcategory"] { _id, name, "count": count(*[_type == "product" && subcategory._ref == ^._id]), "parent": parentCategory->name } | order(count desc) [0...20]');
  
  subs.forEach(s => console.log(`  ${s.count.toString().padStart(4)} | ${s.name} (${s.parent})`));
  
  console.log("\n=== SAMPLE PRODUCTS FROM 'Інше для дому' ===\n");
  const samples = await client.fetch('*[_type == "product" && subcategory._ref == "sub-dim-inshe"][0...10] { name, price }');
  samples.forEach(p => console.log(`  ${p.name.slice(0, 80)}`));
}

run().catch(console.error);
