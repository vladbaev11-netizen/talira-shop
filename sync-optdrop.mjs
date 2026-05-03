// sync-optdrop.mjs
// First sync: loads ALL products from opt-drop XML into Sanity
// Uses external image URLs (no upload to Sanity)
// Run: set SANITY_WRITE_TOKEN=your_token
//      node sync-optdrop.mjs

import { createClient } from "@sanity/client";
import { parseString } from "xml2js";
import https from "https";
import http from "http";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

const XML_URL = "https://opt-drop.com/storage/xml/opt-drop-40.xml";

// Download XML
function downloadXML(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith("https") ? https : http;
    protocol.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadXML(res.headers.location).then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
      res.on("error", reject);
    }).on("error", reject);
  });
}

// Transliterate for slugs
function makeSlug(name) {
  const translit = {'а':'a','б':'b','в':'v','г':'h','ґ':'g','д':'d','е':'e','є':'ye','ж':'zh','з':'z','и':'y','і':'i','ї':'yi','й':'y','к':'k','л':'l','м':'m','н':'n','о':'o','п':'p','р':'r','с':'s','т':'t','у':'u','ф':'f','х':'kh','ц':'ts','ч':'ch','ш':'sh','щ':'shch','ь':'','ю':'yu','я':'ya','э':'e','ы':'y','ъ':''};
  let result = "";
  for (const ch of name.toLowerCase()) {
    if (translit[ch] !== undefined) result += translit[ch];
    else if (/[a-z0-9]/.test(ch)) result += ch;
    else if (" -_".includes(ch)) result += "-";
  }
  return result.replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 96);
}

// Clean HTML to text paragraphs
function cleanHTML(html) {
  if (!html || html.length < 20) return [];
  let text = html.replace(/<style[^>]*>.*?<\/style>/gis, "");
  text = text.replace(/<br\s*\/?>/gi, "\n");
  text = text.replace(/<\/p>/gi, "\n\n");
  text = text.replace(/<\/div>/gi, "\n\n");
  text = text.replace(/<\/li>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/&nbsp;/gi, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"');
  const paras = text.split("\n").map(p => p.trim()).filter(p => p.length > 15);
  // Filter out spec-like lines
  const clean = paras.filter(p => {
    if (/^[\w\s]{3,25}:\s*.{1,30}$/.test(p)) return false;
    if (/^[•\-–—✓✔]\s*.{3,40}$/.test(p)) return false;
    return true;
  });
  let total = 0;
  const result = [];
  for (const p of clean.slice(0, 5)) {
    if (total + p.length > 800) break;
    result.push(p);
    total += p.length;
  }
  return result;
}

function textToBlocks(paragraphs) {
  if (!paragraphs || paragraphs.length === 0) return undefined;
  return paragraphs.map(text => ({
    _type: "block",
    _key: Math.random().toString(36).slice(2, 10),
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: Math.random().toString(36).slice(2, 10), marks: [], text }],
  }));
}

// Category mapping from opt-drop groups
function mapCategory(group) {
  const MAP = {
    "Інструменти": ["avto-ta-instrument", "Авто та інструмент"],
    "Товари для дітей": ["dytiachi-tovary", "Дитячі товари"],
    "Для будинку та саду": ["dim-ta-sad", "Дім та сад"],
    "Органайзери, кофри та аксесуари для зберігання речей": ["dim-ta-sad", "Дім та сад"],
    "Господарчі товари": ["dim-ta-sad", "Дім та сад"],
    "Посуд та приладдя для кухні": ["kuhnia", "Все для кухні"],
    "Автотовари": ["avto-ta-instrument", "Авто та інструмент"],
    "Техніка та електроніка": ["elektronika", "Електроніка"],
    "Гірлянди": ["elektronika", "Електроніка"],
    "Іграшки": ["dytiachi-tovary", "Дитячі товари"],
    "Масажери та тренажери": ["zdorovia", "Здоров'я та масажери"],
    "Міксери та Блендери": ["kuhnia", "Все для кухні"],
    "Текстиль": ["dim-ta-sad", "Дім та сад"],
    "Зоотовари": ["dim-ta-sad", "Дім та сад"],
    "Краса та здоровʼя": ["krasa", "Краса та догляд"],
    "Праски та відпарювачі": ["dim-ta-sad", "Дім та сад"],
    "Машинки та тримери для стрижки волосся": ["krasa", "Краса та догляд"],
    "Пылесоси": ["dim-ta-sad", "Дім та сад"],
    "Плойкі, утюжкі, стайлери для вкладання волосся": ["krasa", "Краса та догляд"],
    "Кохонне приладдя": ["kuhnia", "Все для кухні"],
    "Ліхтарі": ["elektronika", "Електроніка"],
    "Вуличні ліхтарі": ["elektronika", "Електроніка"],
    "Кастрюлі": ["kuhnia", "Все для кухні"],
    "Фен для волосся": ["krasa", "Краса та догляд"],
    "Побутова техніка для кухні": ["kuhnia", "Все для кухні"],
    "Навушники та гарнітури": ["elektronika", "Електроніка"],
    "Портативні колонки": ["elektronika", "Електроніка"],
    "Акустичні системи": ["elektronika", "Електроніка"],
    "Акустика": ["elektronika", "Електроніка"],
    "Зарядні пристрої, Power Bank": ["elektronika", "Електроніка"],
    "Чайники": ["kuhnia", "Все для кухні"],
    "Декор": ["dim-ta-sad", "Дім та сад"],
    "Мультиварки": ["kuhnia", "Все для кухні"],
    "Кавоварки та кавомашини": ["kuhnia", "Все для кухні"],
    "Тренажери": ["zdorovia", "Здоров'я та масажери"],
    "Вафельниці": ["kuhnia", "Все для кухні"],
    "Тостери": ["kuhnia", "Все для кухні"],
    "Бутербродниці": ["kuhnia", "Все для кухні"],
    "Соковитискачі": ["kuhnia", "Все для кухні"],
    "Самокати": ["dytiachi-tovary", "Дитячі товари"],
    "Дитячий транспорт": ["dytiachi-tovary", "Дитячі товари"],
    "Електробритви": ["krasa", "Краса та догляд"],
    "Рюкзаки": ["dim-ta-sad", "Дім та сад"],
    "Сумки": ["dim-ta-sad", "Дім та сад"],
    "Пательні": ["kuhnia", "Все для кухні"],
    "Кухонні ножі": ["kuhnia", "Все для кухні"],
    "Смарт-годинники": ["elektronika", "Електроніка"],
    "Проектори": ["elektronika", "Електроніка"],
    "Товари для спорту": ["zdorovia", "Здоров'я та масажери"],
    "Фітнес та йога": ["zdorovia", "Здоров'я та масажери"],
    "Швейні машинки": ["dim-ta-sad", "Дім та сад"],
    "Намети туристичні": ["dim-ta-sad", "Дім та сад"],
    "Відпочинок та туризм": ["dim-ta-sad", "Дім та сад"],
    "Системи відеоспостереження": ["elektronika", "Електроніка"],
    "Новинки": ["dim-ta-sad", "Дім та сад"],
    "Вентилятори та кондиціонери": ["dim-ta-sad", "Дім та сад"],
    "Для ванної кімнати та вбиральні": ["dim-ta-sad", "Дім та сад"],
    "Товари для творчості": ["dytiachi-tovary", "Дитячі товари"],
    "Освітлення": ["elektronika", "Електроніка"],
    "Світильники": ["elektronika", "Електроніка"],
    "Настільні лампи": ["elektronika", "Електроніка"],
    "Нічникі та світильникі": ["elektronika", "Електроніка"],
    "Зволожувачі та очищувачі повітря": ["dim-ta-sad", "Дім та сад"],
    "Грилі та електрошашличниці": ["kuhnia", "Все для кухні"],
    "Машинки на радіокеруванні": ["dytiachi-tovary", "Дитячі товари"],
    "Констурктори": ["dytiachi-tovary", "Дитячі товари"],
    "Дитячі намети": ["dytiachi-tovary", "Дитячі товари"],
    "Дитячі фотоапарати": ["dytiachi-tovary", "Дитячі товари"],
    "Ваги": ["dim-ta-sad", "Дім та сад"],
    "Кухонні ваги": ["kuhnia", "Все для кухні"],
    "Товари для здоровʼя": ["zdorovia", "Здоров'я та масажери"],
    "Епілятори, трімери, воскоплави": ["krasa", "Краса та догляд"],
    "Фрейзери, електропилки для маникюру": ["krasa", "Краса та догляд"],
    "Лампи для маникюру": ["krasa", "Краса та догляд"],
    "Дзеркала косметологічні": ["krasa", "Краса та догляд"],
    "Зубні щітки": ["krasa", "Краса та догляд"],
    "Товари для краси": ["krasa", "Краса та догляд"],
    "Машинки для видалення ковтунців": ["krasa", "Краса та догляд"],
    "Декоративна косметика": ["krasa", "Краса та догляд"],
    "Пензлики для макіяжу та аксесуари": ["krasa", "Краса та догляд"],
    "Приладдя для вкладання волосся": ["krasa", "Краса та догляд"],
  };
  return MAP[group] || ["dim-ta-sad", "Дім та сад"];
}

async function run() {
  console.log("=== SYNC OPT-DROP ===");
  console.log("Downloading XML...");
  
  let xml;
  try {
    xml = await downloadXML(XML_URL);
    console.log("XML downloaded: " + (xml.length / 1024 / 1024).toFixed(1) + " MB");
  } catch (e) {
    console.error("Failed to download XML: " + e.message);
    return;
  }

  // Parse XML
  console.log("Parsing XML...");
  const parsed = await new Promise((resolve, reject) => {
    parseString(xml, { explicitArray: false }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  // Find offers in YML structure
  let offers = [];
  if (parsed.yml_catalog && parsed.yml_catalog.shop && parsed.yml_catalog.shop.offers && parsed.yml_catalog.shop.offers.offer) {
    offers = Array.isArray(parsed.yml_catalog.shop.offers.offer) 
      ? parsed.yml_catalog.shop.offers.offer 
      : [parsed.yml_catalog.shop.offers.offer];
  } else if (parsed.price && parsed.price.items && parsed.price.items.item) {
    offers = Array.isArray(parsed.price.items.item) 
      ? parsed.price.items.item 
      : [parsed.price.items.item];
  } else {
    // Try Prom.ua format
    const root = Object.keys(parsed)[0];
    const data = parsed[root];
    if (data && data.shop && data.shop.offers && data.shop.offers.offer) {
      offers = Array.isArray(data.shop.offers.offer) ? data.shop.offers.offer : [data.shop.offers.offer];
    }
  }

  // Also try to get categories from XML
  let xmlCategories = {};
  try {
    const shop = parsed.yml_catalog?.shop || parsed[Object.keys(parsed)[0]]?.shop;
    if (shop && shop.categories && shop.categories.category) {
      const cats = Array.isArray(shop.categories.category) ? shop.categories.category : [shop.categories.category];
      for (const c of cats) {
        xmlCategories[c.$.id] = c._ || c.$.name || c;
      }
    }
  } catch (e) {}

  if (offers.length === 0) {
    console.error("No offers found in XML! Trying alternative parsing...");
    // Try to find any array of items
    console.log("Root keys:", Object.keys(parsed));
    return;
  }

  console.log("Offers found: " + offers.length);
  console.log("XML Categories: " + Object.keys(xmlCategories).length);

  // Filter in-stock only
  const inStock = offers.filter(o => {
    const avail = o.$.available || o.available || "true";
    return avail === "true" || avail === "+";
  });
  console.log("In stock: " + inStock.length);

  // Create categories
  console.log("\n--- Creating categories ---");
  const catMap = new Map(); // slug -> id
  const usedCats = new Set();

  for (const offer of inStock) {
    const group = offer.categoryId ? (xmlCategories[offer.categoryId] || offer.categoryId) : (offer.category || offer.group || "Інше");
    const [slug, name] = mapCategory(typeof group === 'string' ? group : String(group));
    usedCats.add(slug + "|" + name);
  }

  for (const catKey of usedCats) {
    const [slug, name] = catKey.split("|");
    const id = "category-" + slug;
    try {
      await client.createOrReplace({
        _id: id, _type: "category", name,
        slug: { _type: "slug", current: slug },
      });
      catMap.set(slug, id);
      console.log("  + " + name);
    } catch (e) {
      console.error("  x " + name + ": " + e.message);
    }
  }

  // Create subcategories from opt-drop groups
  console.log("\n--- Creating subcategories ---");
  const subMap = new Map();
  const usedSubs = new Set();

  for (const offer of inStock) {
    const group = offer.categoryId ? (xmlCategories[offer.categoryId] || offer.categoryId) : (offer.category || offer.group || "Інше");
    const groupName = typeof group === 'string' ? group : String(group);
    const [catSlug] = mapCategory(groupName);
    const subSlug = makeSlug(groupName);
    if (subSlug) usedSubs.add(subSlug + "|" + groupName + "|" + catSlug);
  }

  for (const subKey of usedSubs) {
    const [slug, name, catSlug] = subKey.split("|");
    const id = "subcategory-" + slug;
    const catId = "category-" + catSlug;
    try {
      await client.createOrReplace({
        _id: id, _type: "subcategory", name,
        slug: { _type: "slug", current: slug },
        parentCategory: { _type: "reference", _ref: catId },
      });
      subMap.set(slug, id);
      console.log("  + " + name + " -> " + catSlug);
    } catch (e) {
      console.error("  x " + name + ": " + e.message);
    }
  }

  // Import products
  console.log("\n--- Importing products ---");
  let ok = 0, fail = 0;

  for (let i = 0; i < inStock.length; i++) {
    const offer = inStock[i];

    try {
      // Extract data from offer
      const sku = offer.$.id || offer.vendorCode || offer.sku || offer.article || String(i);
      const name = offer.name_ua || offer.name || offer.title || "";
      const price = parseFloat(offer.price) || 0;
      
      if (!name || price <= 0) { fail++; continue; }

      // Images
      let pictures = offer.picture;
      if (!pictures) { fail++; continue; }
      if (!Array.isArray(pictures)) pictures = [pictures];
      pictures = pictures.filter(p => p && typeof p === 'string' && p.startsWith('http'));
      if (pictures.length === 0) { fail++; continue; }

      const slug = makeSlug(name);
      if (!slug) { fail++; continue; }

      // Category
      const group = offer.categoryId ? (xmlCategories[offer.categoryId] || offer.categoryId) : (offer.category || offer.group || "Інше");
      const groupName = typeof group === 'string' ? group : String(group);
      const [catSlug] = mapCategory(groupName);
      const subSlug = makeSlug(groupName);
      const catId = "category-" + catSlug;
      const subId = "subcategory-" + subSlug;

      // Old price
      const discount = 5 + Math.floor(Math.random() * 26);
      const oldPrice = Math.round(price / (1 - discount / 100));

      // Description
      const descHtml = offer.description_ua || offer.description || "";
      const descBlocks = textToBlocks(cleanHTML(descHtml));

      // Reviews
      const seed = parseInt(sku.replace(/\D/g, "").slice(0, 8) || "12345");
      const reviewNames = ["Олена К.", "Марія С.", "Тетяна В.", "Ірина М.", "Андрій Н."];
      const reviewCities = ["Київ", "Харків", "Одеса", "Дніпро", "Львів"];
      const reviewTexts = ["Товар відповідає опису, задоволена!", "Якість хороша, рекомендую!", "Швидка доставка, все працює.", "Гарне співвідношення ціна-якість.", "Все як на фото, дякую!"];
      const numReviews = 1 + (seed % 3);
      const reviews = [];
      for (let r = 0; r < numReviews; r++) {
        reviews.push({
          _type: "object",
          _key: Math.random().toString(36).slice(2, 10),
          name: reviewNames[(seed + r) % reviewNames.length],
          city: reviewCities[(seed + r) % reviewCities.length],
          rating: 4 + ((seed + r) % 2),
          text: reviewTexts[(seed + r) % reviewTexts.length],
          approved: true,
        });
      }

      // Create product with external image URLs
      await client.create({
        _type: "product",
        name,
        sku,
        slug: { _type: "slug", current: slug },
        category: { _type: "reference", _ref: catId },
        subcategory: subMap.has(subSlug) ? { _type: "reference", _ref: subId } : undefined,
        price: Math.round(price),
        oldPrice,
        inStock: true,
        externalImages: pictures, // Store as array of URLs
        shortDescription: cleanHTML(descHtml).join(" ").slice(0, 200) || undefined,
        description: descBlocks,
        reviews,
      });

      ok++;
      if (ok % 50 === 0 || ok === 1) console.log("  [" + ok + "/" + inStock.length + "] " + name.slice(0, 50));
    } catch (e) {
      fail++;
      if (fail <= 10) console.error("  x " + (e.message || "").slice(0, 80));
    }
  }

  console.log("\n=== DONE: " + ok + " ok, " + fail + " fail ===");
}

run().catch(console.error);
