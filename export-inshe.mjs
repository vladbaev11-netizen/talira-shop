import { createClient } from "@sanity/client";
import fs from "fs";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function run() {
  const products = await client.fetch('*[_type == "product" && subcategory._ref == "sub-dim-inshe"] { name }');
  
  console.log(`Exporting ${products.length} products from "Інше для дому"...`);
  
  const output = products.map(p => p.name).join('\n');
  fs.writeFileSync('inshe-products.txt', output, 'utf8');
  
  console.log('Saved to inshe-products.txt');
}

run().catch(console.error);
