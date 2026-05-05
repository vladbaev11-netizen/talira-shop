// fix-all-categories.mjs
// Complete category/subcategory rebuild
// 1. Creates correct categories (no duplicates)
// 2. Creates correct subcategories
// 3. Reassigns ALL products by name keywords
// Run: set SANITY_WRITE_TOKEN=your_token
//      node fix-all-categories.mjs

import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

// =============================================
// CORRECT CATEGORIES
// =============================================
const CATEGORIES = {
  "kuhnia": "Все для кухні",
  "elektronika": "Електроніка",
  "dim-ta-sad": "Дім та сад",
  "krasa": "Краса та догляд",
  "zdorovia": "Здоров'я та спорт",
  "dytiachi": "Дитячі товари",
  "avto": "Авто та інструмент",
};

// =============================================
// CORRECT SUBCATEGORIES
// =============================================
const SUBCATEGORIES = {
  "kuhnia": [
    { slug: "posud", name: "Посуд та каструлі" },
    { slug: "nozhi-pryladdya", name: "Ножі та приладдя" },
    { slug: "chaynyky", name: "Чайники" },
    { slug: "blendery-miksery", name: "Блендери та міксери" },
    { slug: "multyvarky", name: "Мультиварки та мультипечі" },
    { slug: "kavovarky", name: "Кавоварки" },
    { slug: "sokovyzhymalky", name: "Соковижималки" },
    { slug: "dukhovky-hryli", name: "Духовки та грилі" },
    { slug: "tostery-vafelnyts", name: "Тостери та вафельниці" },
    { slug: "vahy-kukhonni", name: "Кухонні ваги" },
    { slug: "kuhnia-inshe", name: "Інше для кухні" },
  ],
  "elektronika": [
    { slug: "kolonky-akustyka", name: "Колонки та акустика" },
    { slug: "navushnyky", name: "Навушники" },
    { slug: "powerbanky-zaryadky", name: "PowerBank та зарядки" },
    { slug: "likhtari-osvitlennya", name: "Ліхтарі та освітлення" },
    { slug: "hirlyandy", name: "Гірлянди" },
    { slug: "videosposterezhennya", name: "Відеоспостереження" },
    { slug: "smart-hodynnyky", name: "Смарт-годинники" },
    { slug: "proektory", name: "Проектори" },
    { slug: "elektronika-inshe", name: "Інша електроніка" },
  ],
  "dim-ta-sad": [
    { slug: "mebli", name: "Меблі" },
    { slug: "tekstyl-dekor", name: "Текстиль та декор" },
    { slug: "ventylyatory-klima", name: "Вентилятори та клімат" },
    { slug: "prybyrannya", name: "Товари для прибирання" },
    { slug: "zootovary", name: "Зоотовари" },
    { slug: "turyzm-vidpochynok", name: "Туризм та відпочинок" },
    { slug: "ryukzaky-sumky", name: "Рюкзаки та сумки" },
    { slug: "osvitlennya-dim", name: "Освітлення для дому" },
    { slug: "sad-gorod", name: "Сад та город" },
    { slug: "vanna-santekhnika", name: "Ванна та санвузол" },
    { slug: "dim-inshe", name: "Інше для дому" },
  ],
  "krasa": [
    { slug: "feny-ployki", name: "Фени, плойки та стайлери" },
    { slug: "mashynky-trymery", name: "Машинки та тримери" },
    { slug: "epilyatory-brytvy", name: "Епілятори та бритви" },
    { slug: "manikyur-pedykyur", name: "Манікюр та педикюр" },
    { slug: "dzerkala-kosmetyka", name: "Дзеркала та косметика" },
    { slug: "masazhery-krasa", name: "Масажери" },
    { slug: "krasa-inshe", name: "Інше для краси" },
  ],
  "zdorovia": [
    { slug: "masazhery-zdor", name: "Масажери та тренажери" },
    { slug: "fitnes-sport", name: "Фітнес та спорт" },
    { slug: "zdorovia-inshe", name: "Товари для здоров'я" },
  ],
  "dytiachi": [
    { slug: "ihrashky", name: "Іграшки" },
    { slug: "konstruktory", name: "Конструктори" },
    { slug: "mashynky-rc", name: "Машинки на радіокеруванні" },
    { slug: "transport-dytyachyy", name: "Дитячий транспорт" },
    { slug: "tvorchist", name: "Товари для творчості" },
    { slug: "dytiachi-inshe", name: "Інше для дітей" },
  ],
  "avto": [
    { slug: "avtotovary", name: "Автотовари" },
    { slug: "instrumenty", name: "Інструменти" },
  ],
};

// =============================================
// PRODUCT CLASSIFICATION RULES (priority order)
// =============================================
function classifyProduct(name) {
  const n = name.toLowerCase();

  // КУХНЯ
  if (/сковор|пательн|каструл|казан|жаров|сотейн|набір каструл|набір посуд|тарілк|миск|чашк|кухоль|глечик/.test(n)) return ["kuhnia", "posud"];
  if (/ніж |ножі|ножів|лопат|дошк для різ|шумівк|відкривач|овочеріз|подрібнювач|терт|слайсер|мандолін|приладдя кухон|кохонн прилад/.test(n)) return ["kuhnia", "nozhi-pryladdya"];
  if (/чайник|електрочайник/.test(n)) return ["kuhnia", "chaynyky"];
  if (/блендер|міксер|чопер|млин для спецій|кухонний комбайн/.test(n)) return ["kuhnia", "blendery-miksery"];
  if (/мультивар|мультипіч|аерогрил|скороварк/.test(n)) return ["kuhnia", "multyvarky"];
  if (/кавовар|кавомол|кавомашин|кофевар/.test(n)) return ["kuhnia", "kavovarky"];
  if (/соковижим|соковичав|соковитис|екстрактор/.test(n)) return ["kuhnia", "sokovyzhymalky"];
  if (/духов|електропіч|гриль|електрошашлич|шашлич|електрогрил/.test(n)) return ["kuhnia", "dukhovky-hryli"];
  if (/тостер|вафельн|блинн|бутерброд|сендвіч/.test(n)) return ["kuhnia", "tostery-vafelnyts"];
  if (/ваги кухон|кухонні ваги/.test(n)) return ["kuhnia", "vahy-kukhonni"];
  if (/м'ясоруб|фритюрниц|йогуртниц|хлібопіч|сушарка для (овочів|фрукт|продукт)|попкорн|диспенсер для води|кулер для води|термос|пляшк|термокухол|баночк для збер|сушарк для посуд|апарат для цукр/.test(n)) return ["kuhnia", "kuhnia-inshe"];

  // КРАСА — перед електронікою щоб масажери не потрапляли в електроніку
  if (/фен для волос|фен-|фен прос/.test(n)) return ["krasa", "feny-ployki"];
  if (/плойк|випрямляч|стайлер|гофр|щипц для волос|утюж.*волос|прасочк.*волос/.test(n)) return ["krasa", "feny-ployki"];
  if (/машинк.*стрижк|тример.*стрижк|тримери.*стрижк|машинк.*волос/.test(n)) return ["krasa", "mashynky-trymery"];
  if (/епілят|депілят|воскоплав/.test(n)) return ["krasa", "epilyatory-brytvy"];
  if (/електробритв|бритв/.test(n)) return ["krasa", "epilyatory-brytvy"];
  if (/тример|триммер/.test(n) && !/кущ|трав|газон|сад/.test(n)) return ["krasa", "mashynky-trymery"];
  if (/манікюр|педикюр|фрезер.*нігт|пилк.*нігт|лампа.*манікюр|beauty nail/.test(n)) return ["krasa", "manikyur-pedykyur"];
  if (/дзеркал.*косметол|дзеркальц|косметич.*дзеркал/.test(n)) return ["krasa", "dzerkala-kosmetyka"];
  if (/пензлик.*макіяж|декоративн.*косметик|косметич|тональн|помада|туш для/.test(n)) return ["krasa", "dzerkala-kosmetyka"];
  if (/ковтунц|катишк|машинк.*видален/.test(n)) return ["krasa", "krasa-inshe"];
  if (/зубн.*щітк/.test(n)) return ["krasa", "krasa-inshe"];
  if (/відпарювач|парова.*прас|steam brush/.test(n)) return ["krasa", "krasa-inshe"];

  // ЗДОРОВ'Я — перед електронікою
  if (/масажер|масажн|масаж для|антицелюл/.test(n) && !/волос|голов/.test(n)) return ["zdorovia", "masazhery-zdor"];
  if (/тренажер|бігов.*доріжк|велотренаж|степер|орбітрек|walking pad|еліптич/.test(n)) return ["zdorovia", "masazhery-zdor"];
  if (/фітнес|йога|гантел|еспандер|скакалк|турнік|штанг|гир.*спорт/.test(n)) return ["zdorovia", "fitnes-sport"];
  if (/тонометр|термометр.*медич|інгалятор|бандаж|корсет.*медич|ваги.*підлог|ваги.*для тіл|напольн.*ваги/.test(n)) return ["zdorovia", "zdorovia-inshe"];
  if (/пояс.*схудн|пояс.*масаж/.test(n)) return ["zdorovia", "zdorovia-inshe"];

  // ДИТЯЧІ — перед електронікою та домом
  if (/іграшк|ляльк|плюш|м'як.*іграш|бластер|зброя.*іграш|пістолет.*іграш|неrf|дитяч.*фотоапарат/.test(n)) return ["dytiachi", "ihrashky"];
  if (/конструктор|констурктор|лего|lego/.test(n)) return ["dytiachi", "konstruktory"];
  if (/машинк.*радіо|радіокеруван|rc.*машин/.test(n)) return ["dytiachi", "mashynky-rc"];
  if (/самокат|велосипед.*дитяч|каталк|біговел|електромоб|дитяч.*транспорт|автокрісл|бустер/.test(n)) return ["dytiachi", "transport-dytyachyy"];
  if (/дитяч.*намет|розвиваюч.*килимк/.test(n)) return ["dytiachi", "dytiachi-inshe"];
  if (/товар.*творч|малюванн|фарб.*дитяч|розмальовк|пластилін/.test(n)) return ["dytiachi", "tvorchist"];

  // ЕЛЕКТРОНІКА
  if (/колонк.*портатив|портативн.*колонк|bluetooth.*колонк|jbl|акустич.*систем|акустик|караоке|мікрофон.*караоке/.test(n)) return ["elektronika", "kolonky-akustyka"];
  if (/навушник|наушник|гарнітур|airpod|tws|bluetooth.*навушн/.test(n)) return ["elektronika", "navushnyky"];
  if (/powerbank|power bank|повербанк|зовнішн.*акумулятор|зарядн.*пристр|зарядна.*станц|бездрот.*зарядк/.test(n)) return ["elektronika", "powerbanky-zaryadky"];
  if (/ліхтар|фонар|прожектор|ліхтарик|вуличн.*ліхтар/.test(n)) return ["elektronika", "likhtari-osvitlennya"];
  if (/світильник|настільн.*лампа|led.*лампа|нічник|світлодіодн.*лампа|лампа.*світлод|лампа.*led/.test(n)) return ["elektronika", "likhtari-osvitlennya"];
  if (/гірлянд|led.*стрічк|неонов|rgb.*стрічк|диско.*лампа|диско.*шар|лазер.*свят/.test(n)) return ["elektronika", "hirlyandy"];
  if (/відеоспостереж|камера.*спостереж|ip.*камер|wi-fi.*камер|охорон.*систем|сигналізац/.test(n)) return ["elektronika", "videosposterezhennya"];
  if (/смарт.*годинник|smart.*watch|розумн.*годинник|фітнес.*браслет|фітнес.*трекер/.test(n)) return ["elektronika", "smart-hodynnyky"];
  if (/проектор|проєктор/.test(n) && !/малюван/.test(n)) return ["elektronika", "proektory"];
  if (/радіо|fm.*трансміт|магнітол|dvd|антен|рац/.test(n)) return ["elektronika", "elektronika-inshe"];
  if (/3d.*ручк|3д.*ручк/.test(n)) return ["elektronika", "elektronika-inshe"];
  if (/годинник.*настін|годинник.*наручн/.test(n)) return ["elektronika", "elektronika-inshe"];

  // АВТО ТА ІНСТРУМЕНТ
  if (/набір.*інструмент|ключ.*набір|дриль|шуруповерт|болгарк|пилк.*електр|лобзик|фрезер|мультитул|набір.*головок|набір.*біт|повітродувк|цвяхів|молоток|плоскогубц|викрутк/.test(n)) return ["avto", "instrumenty"];
  if (/автомоб|автомагнітол|автотримач|автокомпрес|автонасос|автопилосос|компресор.*шин|підкачув.*шин|інвертор.*автомоб|відеореєстр|відеореестр|авто.*інвертор|автокрісл/.test(n) && !/дитяч/.test(n)) return ["avto", "avtotovary"];
  if (/домкрат|буксир|автолампа|тримач.*телефон.*авто|тримач.*магніт.*авто|fm.*модулятор/.test(n)) return ["avto", "avtotovary"];

  // ПИЛОСОСИ — в дім та сад
  if (/пилосос|пылесос/.test(n) && !/авто/.test(n)) return ["dim-ta-sad", "prybyrannya"];
  if (/автопилосос|пилосос.*авто/.test(n)) return ["avto", "avtotovary"];

  // ДІМ ТА САД
  if (/тумб|шаф|полиц|комод|стелаж|підставк.*під|вішал|органайзер.*взут|табурет|пуф|садов.*мебл/.test(n)) return ["dim-ta-sad", "mebli"];
  if (/стіл.*складн|стілец.*складн|розкладн.*стіл/.test(n)) return ["dim-ta-sad", "mebli"];
  if (/текстиль|подушк|плед|рушник|ковдр|накидк.*мебл|чохол.*мебл|покривал|постільн|ковр|килим|скатертин/.test(n)) return ["dim-ta-sad", "tekstyl-dekor"];
  if (/декор|картин|ваз.*декор|годинник.*настін|скарбничк|скринька|свіч.*декор|рамк.*фото|статуетк/.test(n)) return ["dim-ta-sad", "tekstyl-dekor"];
  if (/вентилятор|кондиціонер|обігрівач|тепловентилятор|зволожувач|очищувач.*повітр|охолоджувач/.test(n)) return ["dim-ta-sad", "ventylyatory-klima"];
  if (/прибиранн|швабр|щітк.*прибир|пароочисник|засіб.*чист|відро.*швабр/.test(n)) return ["dim-ta-sad", "prybyrannya"];
  if (/зоотовар|собак|кішк|тварин|pet|повод|когтеточ|фонтан.*кот|миск.*тварин|нашийник|намордник|клітк.*папуг/.test(n)) return ["dim-ta-sad", "zootovary"];
  if (/відлякувач.*тварин/.test(n)) return ["dim-ta-sad", "zootovary"];
  if (/намет|спальн.*мішок|гамак|каремат|кемпінг|похідн|туристич|компас|термос.*туристич|палатк/.test(n)) return ["dim-ta-sad", "turyzm-vidpochynok"];
  if (/пікнік|мангал|шампур|решітк.*грил/.test(n) && !/електро/.test(n)) return ["dim-ta-sad", "turyzm-vidpochynok"];
  if (/вудк|котушк.*рибал|риболов|сітк.*рибал|підсак/.test(n)) return ["dim-ta-sad", "turyzm-vidpochynok"];
  if (/рюкзак|сумк|валіз|чемодан|месенджер|шопер|спортивн.*сумк|термосумк|сумка.*холодильн|бананк|барсетк/.test(n)) return ["dim-ta-sad", "ryukzaky-sumky"];
  if (/лампа.*настільн|лампа.*настольн|торшер|бра.*настін/.test(n) && !/манікюр/.test(n)) return ["dim-ta-sad", "osvitlennya-dim"];
  if (/сад|город|шланг.*полив|секатор|газонокосарк|тример.*трав|тример.*кущ|пулевериз.*сад|крапельн.*полив/.test(n)) return ["dim-ta-sad", "sad-gorod"];
  if (/ванн|душ.*стійк|дозатор.*мил|штор.*ванн|коврик.*ванн|тримач.*рушник/.test(n)) return ["dim-ta-sad", "vanna-santekhnika"];
  if (/водонагрівач|бойлер|кран.*нагрів/.test(n)) return ["dim-ta-sad", "vanna-santekhnika"];
  if (/москітн|штор.*ролет/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/швейн.*машинк/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/праска|прас /.test(n) && !/волос|відпарюв/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/tv.*товар|телевізор/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/надувн|матрац.*надувн|басейн.*надувн/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/ваги/.test(n) && !/кухон/.test(n) && !/підлог|для тіл|напольн/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/аксесуар.*телефон|чохол.*телефон|захисн.*скл.*телефон/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/аксесуар.*ноутбук|підставк.*ноутбук/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/рідк.*скл|детектор.*банкнот|лічильник.*банкнот/.test(n)) return ["dim-ta-sad", "dim-inshe"];
  if (/блекаут/.test(n)) return ["dim-ta-sad", "dim-inshe"];

  // FALLBACK — якщо нічого не підійшло
  return ["dim-ta-sad", "dim-inshe"];
}

async function run() {
  console.log("=== FULL CATEGORY REBUILD ===\n");

  // Step 1: Create correct categories FIRST
  console.log("--- Creating new categories ---");
  for (const [slug, name] of Object.entries(CATEGORIES)) {
    await client.createOrReplace({
      _id: "cat-" + slug,
      _type: "category",
      name,
      slug: { _type: "slug", current: slug },
    });
    console.log("  + " + name);
  }

  // Step 2: Create correct subcategories
  console.log("\n--- Creating new subcategories ---");
  for (const [catSlug, subs] of Object.entries(SUBCATEGORIES)) {
    for (const sub of subs) {
      await client.createOrReplace({
        _id: "sub-" + sub.slug,
        _type: "subcategory",
        name: sub.name,
        slug: { _type: "slug", current: sub.slug },
        parentCategory: { _type: "reference", _ref: "cat-" + catSlug },
      });
      console.log("  + " + sub.name + " -> " + catSlug);
    }
  }

  // Step 3: Reassign ALL products to NEW categories/subcategories
  console.log("\n--- Reassigning products ---");
  const products = await client.fetch('*[_type == "product"]{ _id, name }');
  console.log("Total products: " + products.length);

  let assigned = 0;
  const batchSize = 100;

  for (let i = 0; i < products.length; i += batchSize) {
    const batch = products.slice(i, i + batchSize);
    const tx = client.transaction();

    for (const p of batch) {
      const [catSlug, subSlug] = classifyProduct(p.name || "");
      tx.patch(p._id, {
        set: {
          category: { _type: "reference", _ref: "cat-" + catSlug },
          subcategory: { _type: "reference", _ref: "sub-" + subSlug },
        }
      });
    }

    try {
      await tx.commit();
      assigned += batch.length;
      if (assigned % 500 === 0 || assigned === products.length) {
        console.log("  Assigned: " + assigned + "/" + products.length);
      }
    } catch (e) {
      console.error("  Error at batch " + i + ": " + e.message);
    }
  }

  // Step 4: NOW delete old categories and subcategories (no more references)
  console.log("\n--- Deleting old subcategories ---");
  const oldSubs = await client.fetch('*[_type == "subcategory" && !(_id in $keepIds)]{ _id }', {
    keepIds: Object.values(SUBCATEGORIES).flat().map(s => "sub-" + s.slug)
  });
  console.log("Old subcategories to delete: " + oldSubs.length);
  for (let i = 0; i < oldSubs.length; i += 50) {
    const tx = client.transaction();
    oldSubs.slice(i, i + 50).forEach(s => tx.delete(s._id));
    try { await tx.commit(); } catch (e) { console.log("  Skip batch (still referenced)"); }
  }

  console.log("\n--- Deleting old categories ---");
  const oldCats = await client.fetch('*[_type == "category" && !(_id in $keepIds)]{ _id }', {
    keepIds: Object.keys(CATEGORIES).map(s => "cat-" + s)
  });
  console.log("Old categories to delete: " + oldCats.length);
  for (let i = 0; i < oldCats.length; i += 50) {
    const tx = client.transaction();
    oldCats.slice(i, i + 50).forEach(c => tx.delete(c._id));
    try { await tx.commit(); } catch (e) { console.log("  Skip batch (still referenced)"); }
  }

  // Step 5: Set category images
  console.log("\n--- Setting category images ---");
  for (const [slug] of Object.entries(CATEGORIES)) {
    const catId = "cat-" + slug;
    const product = await client.fetch(
      '*[_type == "product" && category._ref == $catId && (defined(mainImage) || defined(externalImages))][0]{ mainImage, externalImages }',
      { catId }
    );

    if (product && product.mainImage && product.mainImage.asset) {
      await client.patch(catId).set({ image: { _type: "image", asset: product.mainImage.asset } }).commit();
      console.log("  + " + slug + " - sanity image");
    } else if (product && product.externalImages && product.externalImages.length > 0) {
      try {
        const res = await fetch(product.externalImages[0]);
        if (res.ok) {
          const buf = await res.arrayBuffer();
          const asset = await client.assets.upload("image", Buffer.from(buf), { filename: "cat-" + slug + ".jpg" });
          await client.patch(catId).set({ image: { _type: "image", asset: { _type: "reference", _ref: asset._id } } }).commit();
          console.log("  + " + slug + " - uploaded external");
        }
      } catch (e) { console.log("  - " + slug + " - error"); }
    }
  }

  console.log("\n=== DONE ===");
  console.log("Categories: " + Object.keys(CATEGORIES).length);
  console.log("Subcategories: " + Object.values(SUBCATEGORIES).flat().length);
  console.log("Products reassigned: " + assigned);
}

run().catch(console.error);
