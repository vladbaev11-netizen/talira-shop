// setup-subcategories.mjs
// Creates subcategories and assigns products to them based on name keywords
// Run: set SANITY_WRITE_TOKEN=your_token
//      node setup-subcategories.mjs

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// Subcategories definition: parent category ID -> subcategories with keywords
const SUBCATEGORIES = {
  "category-kuhnia": [
    { slug: "posud", name: "Посуд", keywords: ["сковор", "каструл", "казан", "жаров", "набір каструл", "набір посуд", "миск", "тарілк", "чашк", "каструля", "сотейн"] },
    { slug: "nozhi", name: "Ножі та приладдя", keywords: ["ніж", "ножі", "ножів", "лопат", "дошк", "різ"] },
    { slug: "chayniky", name: "Чайники", keywords: ["чайник", "електрочайник"] },
    { slug: "blendery", name: "Блендери та подрібнювачі", keywords: ["блендер", "подрібн", "измельч", "міксер"] },
    { slug: "multyvark", name: "Мультиварки та мультипечі", keywords: ["мультивар", "мультипіч", "аерогрил", "скороварк"] },
    { slug: "kavovarky", name: "Кавоварки", keywords: ["кавовар", "кавомол", "кофевар", "кофемол", "кава"] },
    { slug: "sokovyzhymalky", name: "Соковижималки", keywords: ["соковижим", "соковичав"] },
    { slug: "dukhovky", name: "Духовки та печі", keywords: ["духов", "електропіч", "піч "] },
    { slug: "vafelnyts", name: "Вафельниці та сендвічниці", keywords: ["вафельн", "блинн", "бутерброд", "сендвіч", "тостер"] },
    { slug: "kuhnia-inshe", name: "Інше для кухні", keywords: ["спеці", "контейнер", "термос", "пляшк", "відкрив", "кухон"] },
  ],
  "category-dim-ta-sad": [
    { slug: "mebli", name: "Меблі", keywords: ["тумб", "шаф", "стіл", "полиц", "комод", "стелаж", "табурет", "підставк", "вішал", "органайзер для взут"] },
    { slug: "sumky-valiz", name: "Сумки та валізи", keywords: ["рюкзак", "сумк", "валіз", "чемодан", "кошик", "органайзер для"] },
    { slug: "osvitlennia", name: "Освітлення", keywords: ["лампа ", "світильник", "гірлянд", "свічк", "нічник"] },
    { slug: "dekor", name: "Декор та аксесуари", keywords: ["декор", "картин", "годинник", "ваз", "дзеркал", "подушк", "плед", "рушник"] },
    { slug: "tvaryy", name: "Товари для тварин", keywords: ["собак", "кішк", "тварин", "pet", "повод", "миск для", "когтеточ"] },
    { slug: "dim-inshe", name: "Інше для дому", keywords: ["прибиранн", "швабр", "щітк", "кошик для", "мішок", "пакет", "засіб"] },
  ],
  "category-elektronika-dlia-domu": [
    { slug: "kolonky", name: "Колонки та акустика", keywords: ["колонк", "акустик", "динамік", "bluetooth колонк", "портативн"] },
    { slug: "navushnyky", name: "Навушники", keywords: ["навушник", "наушник", "гарнітур", "airpod", "tws", "бездротов"] },
    { slug: "powerbanky", name: "PowerBank", keywords: ["powerbank", "акумулятор", "зарядн", "power bank"] },
    { slug: "likhtari", name: "Ліхтарі та прожектори", keywords: ["ліхтар", "фонар", "прожектор", "ліхтарик"] },
    { slug: "elektro-inshe", name: "Інша електроніка", keywords: ["камер", "часи", "годинн", "пульт", "кабел", "адаптер", "перехідн"] },
  ],
  "category-krasa-ta-dohliad": [
    { slug: "feny-ployk", name: "Фени та плойки", keywords: ["фен", "плойк", "прас", "випрямляч", "стайлер", "гофр", "волос"] },
    { slug: "masazhery-krasa", name: "Масажери", keywords: ["масаж", "масажер", "масажн", "роли", "антицелюл"] },
    { slug: "epilyatory", name: "Епілятори та бритви", keywords: ["епілят", "бритв", "триммер", "депіл", "гоління"] },
    { slug: "vidparyuvach", name: "Відпарювачі", keywords: ["відпарювач", "парова", "steam"] },
    { slug: "krasa-inshe", name: "Інше для краси", keywords: ["дзеркал", "манікюр", "педикюр", "пілк", "косметич", "щіпц"] },
  ],
  "category-zdorovia-ta-masazhery": [
    { slug: "trenazhery", name: "Тренажери", keywords: ["бігов", "доріжк", "велотренаж", "тренажер", "степер", "орбітрек", "walking pad"] },
    { slug: "masazhery-zdor", name: "Масажери", keywords: ["масаж", "масажер", "масажн"] },
    { slug: "zdorovia-inshe", name: "Здоров'я", keywords: ["ваги", "тискомір", "термометр", "інгалятор", "пояс", "корсет", "бандаж"] },
  ],
  "category-dytiachi-tovary": [
    { slug: "ihrashky", name: "Іграшки", keywords: ["іграшк", "ляльк", "конструктор", "пазл", "плюш", "м'як", "робот", "машинк"] },
    { slug: "transport-dity", name: "Дитячий транспорт", keywords: ["самокат", "велосипед", "каталк", "біговел", "електромоб", "коляск"] },
    { slug: "dity-inshe", name: "Інше для дітей", keywords: ["дитяч", "шкільн", "рюкзак дит", "пенал", "канцел"] },
  ],
  "category-avto-ta-instrument": [
    { slug: "instrument", name: "Інструменти", keywords: ["інструмент", "набір інструм", "ключ", "дриль", "шуруповерт", "болгарк", "пилк", "лобзик", "фрезер"] },
    { slug: "avto", name: "Автотовари", keywords: ["авто", "автомоб", "компресор", "насос", "домкрат", "пилосос авто", "тримач", "відеореєстр"] },
  ],
};

async function run() {
  console.log("=== SETUP SUBCATEGORIES ===\n");

  // Step 1: Create subcategories
  console.log("--- Creating subcategories ---");
  const subcatIds = {};
  let created = 0;

  for (const [parentId, subs] of Object.entries(SUBCATEGORIES)) {
    for (const sub of subs) {
      const id = "subcategory-" + sub.slug;
      try {
        await client.createOrReplace({
          _id: id,
          _type: "subcategory",
          name: sub.name,
          slug: { _type: "slug", current: sub.slug },
          parentCategory: { _type: "reference", _ref: parentId },
        });
        subcatIds[sub.slug] = id;
        created++;
        console.log("  + " + sub.name + " (" + parentId.replace("category-", "") + ")");
      } catch (e) {
        console.error("  x " + sub.name + ": " + e.message);
      }
    }
  }
  console.log("Created: " + created + " subcategories\n");

  // Step 2: Assign products to subcategories
  console.log("--- Assigning products ---");
  const products = await client.fetch('*[_type == "product"]{ _id, name, category }');
  console.log("Total products: " + products.length);

  let assigned = 0, unassigned = 0;
  const batchSize = 50;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const transaction = client.transaction();
    let hasChanges = false;

    for (const p of batch) {
      if (!p.category || !p.category._ref) { unassigned++; continue; }

      const parentId = p.category._ref;
      const subs = SUBCATEGORIES[parentId];
      if (!subs) { unassigned++; continue; }

      const nameLower = p.name.toLowerCase();
      let matched = null;

      for (const sub of subs) {
        if (sub.keywords.some(kw => nameLower.includes(kw.toLowerCase()))) {
          matched = sub;
          break;
        }
      }

      // If no match, assign to "Інше" subcategory of that category
      if (!matched) {
        matched = subs[subs.length - 1]; // Last one is always "Інше"
      }

      const subcatId = subcatIds[matched.slug];
      if (subcatId) {
        transaction.patch(p._id, {
          set: { subcategory: { _type: "reference", _ref: subcatId } }
        });
        hasChanges = true;
        assigned++;
      }
    }

    if (hasChanges) {
      try {
        await transaction.commit();
        if ((i + batchSize) % 200 === 0 || i + batchSize >= products.length) {
          console.log("  Assigned: " + assigned + "/" + products.length);
        }
      } catch (e) {
        console.error("  Batch error: " + e.message);
      }
    }
  }

  // Step 3: Set subcategory images from first product
  console.log("\n--- Setting subcategory images ---");
  for (const [slug, id] of Object.entries(subcatIds)) {
    const product = await client.fetch(
      '*[_type == "product" && subcategory._ref == $subId && defined(mainImage)][0]{ mainImage }',
      { subId: id }
    );
    if (product && product.mainImage && product.mainImage.asset) {
      await client.patch(id).set({
        image: { _type: "image", asset: product.mainImage.asset }
      }).commit();
      console.log("  + " + slug + " - image set");
    }
  }

  console.log("\n=== DONE ===");
  console.log("Assigned: " + assigned);
  console.log("Unassigned: " + unassigned);
}

run().catch(console.error);
