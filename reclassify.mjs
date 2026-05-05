import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

function classify(n) {
  n = n.toLowerCase();

  // АКУМУЛЯТОРИ для самокатів/гіроскутерів — в Авто
  if (/акумулятор.*електросамокат|акумулятор.*гіроскут|акумулятор.*велосипед/.test(n)) return ["avto","avto-inshe"];

  // ДЗЕРКАЛА З LED — Краса (макіяж)
  if (/дзеркал.*led|дзеркал.*підсвіч|дзеркал.*макіяж|дзеркал.*makeup/.test(n)) return ["krasa","dzerkala"];

  // СВІТЛОВІДБИВНІ — Безпека
  if (/світловідбивн|відбиваюч.*стрічк|reflective/.test(n)) return ["bezpeka","signalizatsiyi"];

  // КУХНЯ
  if (/сковор|пательн|каструл|казан|жаров|сотейн|набір каструл|набір посуд|тарілк|миск|чашк|кухоль|глечик|чайний.*набір|сервіз/.test(n)) return ["kuhnia","posud"];
  if (/ніж |ножі|ножів|набір.*нож|лопат|дошк.*різ|шумівк|відкривач|овочеріз|терт|слайсер|мандолін|кохонн.*прилад|ножеточ|очищувач.*овоч/.test(n)) return ["kuhnia","nozhi"];
  if (/чайник|електрочайник/.test(n)) return ["kuhnia","chaynyky"];
  if (/блендер|міксер|чопер|млин.*спецій|кухонний.*комбайн/.test(n)) return ["kuhnia","blendery"];
  if (/мультивар|мультипіч|аерогрил|скороварк/.test(n)) return ["kuhnia","multyvarky"];
  if (/кавовар|кавомол|кавомашин|кофевар|турк.*кав/.test(n)) return ["kuhnia","kavovarky"];
  if (/соковижим|соковичав|соковитис/.test(n)) return ["kuhnia","sokovyzhymalky"];
  if (/духов|електропіч|гриль|електрошашлич|електрогрил|газов.*плит|електроплит/.test(n)) return ["kuhnia","dukhovky"];
  if (/тостер|вафельн|блинн|бутерброд|сендвіч|млинниц|фондю/.test(n)) return ["kuhnia","tostery"];
  if (/м'ясоруб|фритюрниц|йогуртниц|хлібопіч/.test(n)) return ["kuhnia","myasorubky"];
  if (/ваги.*кухон|кухонні.*ваги/.test(n)) return ["kuhnia","vahy-kukhonni"];
  if (/баночк.*збер|контейнер|ємність.*сипуч|набір.*спецій|органайзер.*кухон|дозатор.*олі|сушарк.*посуд|ланчбокс|пляшк.*вод|бутилк/.test(n)) return ["kuhnia","zberihannya"];
  if (/термос(?!умк)|термокухол|помпа.*вод|диспенсер.*вод|кулер.*вод|попкорн|сушарк.*(овоч|фрукт|продукт|гриб|риб)|сітк.*сушарк|апарат.*цукр.*ват|аксесуар.*кухн|побутов.*техн.*кухн/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/набір.*аксесуар.*барбекю|щипц.*барбекю/.test(n)) return ["kuhnia","kuhnia-inshe"];

  // КРАСА
  if (/фен.*волос|фен-|фен\s/.test(n) && !/буд|промисл/.test(n)) return ["krasa","feny"];
  if (/плойк|випрямляч|стайлер|гофр|утюж.*волос|прасочк.*волос|прилад.*вклад.*волос/.test(n)) return ["krasa","ployki"];
  if (/машинк.*стрижк|тример.*стрижк|машинк.*волос/.test(n)) return ["krasa","mashynky-stryzh"];
  if (/тример|триммер/.test(n) && !/кущ|трав|газон|сад/.test(n)) return ["krasa","mashynky-stryzh"];
  if (/епілят|депілят|воскоплав/.test(n)) return ["krasa","epilyatory"];
  if (/електробритв|бритв/.test(n) && !/кущ|трав/.test(n)) return ["krasa","epilyatory"];
  if (/манікюр|педикюр|фрезер.*нігт|пилк.*нігт|лампа.*манікюр|beauty.*nail|електропилк.*маникюр/.test(n)) return ["krasa","manikyur"];
  if (/відпарювач|парова.*прас|steam.*brush|праска|прас\b/.test(n) && !/волос/.test(n)) return ["krasa","vidparyuvachi"];
  if (/ковтунц|катишк|машинк.*видален/.test(n)) return ["krasa","kovtuntsi"];
  if (/зубн.*щітк/.test(n)) return ["krasa","zubni-shchitky"];
  if (/пензлик.*макіяж|декоративн.*косметик|тональн|помада|туш.*для|товар.*крас/.test(n)) return ["krasa","kosmetyka"];
  if (/догляд.*обличч|краса.*здоров|масажер.*обличч|корегуюч.*білизн/.test(n)) return ["krasa","krasa-inshe"];

  // ЗДОРОВ'Я
  if (/масажер|масажн|масаж.*для|антицелюл|масажн.*подушк/.test(n) && !/обличч|волос/.test(n)) return ["zdorovia","masazhery"];
  if (/тренажер|бігов.*доріжк|велотренаж|степер|орбітрек|walking.*pad/.test(n)) return ["zdorovia","trenazhery"];
  if (/фітнес|йога|гантел|еспандер|скакалк|турнік|м'яч.*(футбол|баскетбол|волейбол)|товар.*спорт/.test(n)) return ["zdorovia","fitnes"];
  if (/ваги/.test(n) && !/кухон|торг|багаж/.test(n)) return ["zdorovia","vahy-zdor"];
  if (/бандаж|корсет|ортопед|одяг.*схудн/.test(n)) return ["zdorovia","bandazhi"];
  if (/тонометр|термометр.*медич|інгалятор|пульсоксиметр|товар.*здоров/.test(n)) return ["zdorovia","tonometry"];
  if (/пояс.*схудн|пояс.*масаж/.test(n)) return ["zdorovia","zdorovia-inshe"];

  // ДИТЯЧІ
  if (/конструктор|констурктор|лего|lego/.test(n)) return ["dytiachi","konstruktory"];
  if (/машинк.*радіо|радіокеруван|rc.*машин|гоночн.*трас/.test(n)) return ["dytiachi","mashynky-rc"];
  if (/інтерактивн|літаюч.*іграш|дрон.*дитяч|квадрокоптер.*дитяч|капібар|capybara|капибар/.test(n)) return ["dytiachi","interaktyvni"];
  if (/самокат|велосипед.*дитяч|каталк|біговел|електромоб|дитяч.*транспорт|електросамокат(?!.*акумулятор)/.test(n) && !/акумулятор/.test(n)) return ["dytiachi","samokaty"];
  if (/дитяч.*намет/.test(n)) return ["dytiachi","dytiachi-namety"];
  if (/творч|малюванн|фарб.*дитяч|розмальовк|пластилін|3d.*ручк|3д.*ручк|акварельн.*маркер|water.*brush/.test(n)) return ["dytiachi","tvorchist"];
  if (/розвиваюч|розумн.*іграш|неокуб|розвиваюч.*килимк/.test(n)) return ["dytiachi","navchanny"];
  if (/парта.*школ|дитяч.*стіл|стільчик.*годуван|манеж|дитяч.*ліжечк|дитяч.*батут/.test(n)) return ["dytiachi","dytiachi-mebli"];
  if (/дитяч.*навушник|дитяч.*фотоапарат|дитяч.*годинник|радіо.*відео.*нян|дитяч.*планшет|ігров.*приставк|game.*box|sup.*game/.test(n)) return ["dytiachi","dytiachi-elektron"];
  if (/іграшк|ляльк|плюш|м'як.*іграш|бластер|пістолет.*дитяч|тир.*дитяч|настільн.*гра|рольов.*ігри|пістолет.*мильн/.test(n)) return ["dytiachi","ihrashky"];
  if (/дитяч.*плед|дитяч.*подушк|слінг|перенеск|купанн.*гігієн/.test(n)) return ["dytiachi","dytiachi-inshe"];

  // БЕЗПЕКА
  if (/відеоспостереж|камера.*спостереж|ip.*камер|wi-fi.*камер|wifi.*камер|камер.*нагляд/.test(n)) return ["bezpeka","videosposterezhennya"];
  if (/охорон.*систем|сигналізац|датчик.*рух.*охорон/.test(n)) return ["bezpeka","signalizatsiyi"];

  // ОСВІТЛЕННЯ
  if (/ліхтар|фонар|ліхтарик/.test(n) && !/вуличн/.test(n)) return ["osvitlennya","likhtari"];
  if (/вуличн.*ліхтар|прожектор|ліхтар.*сонячн|led.*садов|камер.*ліхтар|ліхтар.*камер/.test(n)) return ["osvitlennya","vulychni-likhtari"];
  if (/світильник|настільн.*лампа|led.*лампа|світлодіодн.*лампа|лампа.*led|лампа.*датчик.*рух|торшер|бра|нічник.*настільн|нічник.*левіт/.test(n) && !/манікюр/.test(n)) return ["osvitlennya","svitylnyky"];
  if (/нічник/.test(n) && !/дитяч/.test(n)) return ["osvitlennya","nichniky"];
  if (/гірлянд|led.*стрічк|неонов|rgb.*стрічк|диско.*лампа|диско.*шар|лазер.*свят|світлодіодн.*вивіск|новоріч|різдв|блекаут.*товар/.test(n)) return ["osvitlennya","hirlyandy"];

  // ЕЛЕКТРОНІКА
  if (/колонк|акустич.*систем|акустик|караоке|мікрофон|портативн.*колонк|bluetooth.*колонк|jbl/.test(n) && !/дитяч/.test(n)) return ["elektronika","kolonky"];
  if (/навушник|наушник|гарнітур|airpod|tws/.test(n) && !/дитяч/.test(n)) return ["elektronika","navushnyky"];
  if (/powerbank|power.*bank|повербанк|зовнішн.*акумулятор|зарядн.*пристр|зарядна.*станц|бездрот.*зарядк|акумулятор.*батарейк/.test(n)) return ["elektronika","powerbanky"];
  if (/смарт.*годинник|smart.*watch|розумн.*годинник|фітнес.*браслет/.test(n)) return ["elektronika","smart-hodynnyky"];
  if (/проектор|проєктор/.test(n) && !/малюван|дитяч/.test(n)) return ["elektronika","proektory"];
  if (/ігров.*приставк|playstation|xbox/.test(n) && !/дитяч/.test(n)) return ["elektronika","ihrovi-prystav"];
  if (/радіо|fm.*трансміт|магнітол|dvd|антен|телевізор|tv.*товар|екшн.*камер|фото.*відео|детектор.*банкнот|годинник|метеостанц|будильник|gps.*трекер|калькулятор|техніка.*електронік/.test(n)) return ["elektronika","elektronika-inshe"];

  // ПОБУТОВА ТЕХНІКА
  if (/пилосос|пылесос/.test(n) && !/авто/.test(n)) return ["pobutova","pylososy"];
  if (/вентилятор|кондиціонер/.test(n)) return ["pobutova","ventylyatory"];
  if (/обігрівач|тепловентилятор|камін.*електр|каминофон/.test(n)) return ["pobutova","obihrivachi"];
  if (/зволожувач|очищувач.*повітр/.test(n)) return ["pobutova","zvolozhuvachi"];
  if (/швейн.*машинк/.test(n)) return ["pobutova","shveyni"];
  if (/водонагрівач|бойлер|кран.*нагрів/.test(n)) return ["pobutova","vodonahrivachi"];
  if (/догляд.*одяг|побутов.*техн/.test(n)) return ["pobutova","pobutova-inshe"];

  // ІНСТРУМЕНТИ
  if (/набір.*інструмент|набір.*ключ|набір.*торц.*головок|набір.*біт/.test(n)) return ["instrumenty","nabory-instrum"];
  if (/шуруповерт|дриль|перфоратор/.test(n)) return ["instrumenty","shurupoverty"];
  if (/болгарк|пилк.*електр|лобзик|циркулярн|бензопил|ланцюгов.*пил/.test(n)) return ["instrumenty","bolgarky"];
  if (/ключ|плоскогубц|викрутк|молоток|мультитул|різак|заклепочник/.test(n) && !/набір/.test(n)) return ["instrumenty","ruchni-instrum"];
  if (/зварюваль|зварюван|mig|tig|mma/.test(n)) return ["instrumenty","zvaryuvalni"];
  if (/лазерн.*рівен|лазерн.*нівелір/.test(n)) return ["instrumenty","lazerni-rivni"];
  if (/драбин|сходи.*телескоп/.test(n)) return ["instrumenty","drabyny"];
  if (/повітродувк|вимірюваль|тестер|мультиметр/.test(n)) return ["instrumenty","instrum-inshe"];

  // АВТО
  if (/відеореєстр|відеореестр/.test(n)) return ["avto","videoreestratory"];
  if (/компресор|насос.*авто|підкачув/.test(n)) return ["avto","kompresory-avto"];
  if (/тримач.*телефон.*авто|автотримач|освіжувач.*авто|ароматизатор.*авто|fm.*модулятор|плівка.*авто|чохол.*мотоцикл|світло.*авто/.test(n)) return ["avto","trymachi-avto"];
  if (/автохолодильник|холодильник.*авто/.test(n)) return ["avto","avtokholodylnyky"];
  if (/інвертор|перетворювач.*напруг/.test(n)) return ["avto","invertory"];
  if (/автопилосос|пилосос.*авто|мийк.*тиск|домкрат|буксир|автомоб|автомагнітол|авто.*зарядн|пускозарядн|акссесуар.*авто|авто|тримач.*магніт/.test(n)) return ["avto","avto-inshe"];

  // ТУРИЗМ
  if (/намет(?!.*дитяч)|спальн.*мішок|каремат|кемпінг|похідн|туристич|палатк|відпочинок.*туризм/.test(n)) return ["turyzm","namety"];
  if (/пікнік|мангал|шампур|решітк.*грил|термосумк|сумка.*холодильн|барбекю/.test(n)) return ["turyzm","piknik"];
  if (/вудк|котушк.*рибал|риболов|сітк.*рибал|підсак/.test(n)) return ["turyzm","rybolovlya"];
  if (/рюкзак|сумк|валіз|чемодан|месенджер|шопер|бананк|барсетк|портмоне|парасольк/.test(n) && !/дитяч|термосумк/.test(n)) return ["turyzm","sumky"];
  if (/пляж|надувн.*виріб|надувн.*басейн|надувн.*круг|надувн.*матрац|гамак|бінокл|монокуляр/.test(n)) return ["turyzm","plyazh"];

  // ЗООТОВАРИ
  if (/собак|повод.*собак|нашийник.*собак|намордник|собач/.test(n)) return ["zoo","zoo-sobaky"];
  if (/кішк|котяч|кіт\b|когтеточ|фонтан.*кот/.test(n)) return ["zoo","zoo-koty"];
  if (/зоотовар|тварин|відлякувач.*тварин|грумінг|шерст|іграшк.*тварин|миск.*тварин|клітк/.test(n)) return ["zoo","zoo-inshe"];

  // ТЕЛЕФОНИ
  if (/аксесуар.*телефон|чохол.*телефон|захисн.*скл.*телефон/.test(n)) return ["telefony","aksesuary-tel"];
  if (/аксесуар.*ноутбук|підставк.*ноутбук|аксесуар.*комп/.test(n)) return ["telefony","aksesuary-komp"];

  // ДІМ fallbacks
  if (/тумб|шаф|полиц|комод|стелаж|вішал|табурет|пуф|садов.*мебл|стіл.*складн|стілец|надувн.*крісл|надувн.*ліжк/.test(n)) return ["dim","mebli"];
  if (/текстиль|подушк|плед|рушник|ковдр|покривал|постільн|ковр|килим|скатертин|товар.*спальн/.test(n) && !/дитяч|масажн/.test(n)) return ["dim","tekstyl"];
  if (/декор|картин|ваз|скарбничк|скринька|свіч|рамк.*фото|статуетк|подарунк/.test(n)) return ["dim","dekor"];
  if (/органайзер|кофр|зберіганн.*реч|для.*будинку|господар.*товар/.test(n)) return ["dim","organayzer"];
  if (/прибиранн|швабр|щітк.*прибир|товар.*прибиранн|щітк.*ванн|щітк.*туалет/.test(n)) return ["dim","prybyrannya"];
  if (/сад|город|шланг|секатор|газонокосарк|тример.*трав|тример.*кущ|крапельн.*полив|протикомах/.test(n)) return ["dim","sad"];
  if (/ванн|душ|дозатор.*мил|штор.*ванн|коврик.*ванн/.test(n)) return ["dim","vanna"];
  if (/москітн|tv.*товар|рідк.*скл|толстовк|одяг|взутт/.test(n)) return ["dim","dim-inshe"];

  return ["dim","dim-inshe"];
}

async function run() {
  console.log("=== RECLASSIFY PRODUCTS ===\n");
  const products = await client.fetch('*[_type == "product"]{ _id, name }');
  console.log("Total: " + products.length);
  let ok = 0;
  for (let i = 0; i < products.length; i += 100) {
    const batch = products.slice(i, i + 100);
    const tx = client.transaction();
    for (const p of batch) {
      const [c, s] = classify(p.name || "");
      tx.patch(p._id, { set: { category: { _type: "reference", _ref: "cat-" + c }, subcategory: { _type: "reference", _ref: "sub-" + s } } });
    }
    try { await tx.commit(); ok += batch.length; if (ok % 500 === 0 || ok >= products.length) console.log("  " + ok + "/" + products.length); } catch(e) { console.error("  Error: " + e.message); }
  }
  console.log("\n=== DONE: " + ok + " ===");
}

run().catch(console.error);
