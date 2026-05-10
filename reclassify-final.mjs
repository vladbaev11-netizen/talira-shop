import { createClient } from "@sanity/client";

const client = createClient({
  projectId: "777maat6",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

function classify(n) {
  const orig = n;
  n = n.toLowerCase();
  
  // Clean noise from product names
  n = n.replace(/найкраща ціна!?|⁇|найкраще|top|хіт|новинка|акція/gi, ' ');
  n = n.replace(/\s+/g, ' ').trim();

  // КРАСА — розширені правила
  if (/машинк.*стриж|тример.*стриж|триммер.*стриж|gemei.*gm|машинка.*волос|стрижка.*волосся/.test(n)) return ["krasa","mashynky-stryzh"];
  if (/праск.*волос|випрямлювач.*волос|гребінець.*випрям|grand.*xl/.test(n)) return ["krasa","ployki"];
  if (/вакуум.*апарат.*пор|вакуум.*чищен.*обличч|чистк.*пор|beauty.*skin.*care|апарат.*вакуум.*чищен/.test(n)) return ["krasa","krasa-inshe"];
  if (/сушарк.*кист.*макіяж|електрична.*сушарк.*макіяж/.test(n)) return ["krasa","krasa-inshe"];
  if (/спонж.*макіяж|професійн.*спонж/.test(n)) return ["krasa","kosmetyka"];
  if (/кушон.*пудр|консілер|праймер.*machiaj/.test(n)) return ["krasa","kosmetyka"];
  if (/фен.*волос|фен-|фен\s/.test(n) && !/буд|промисл/.test(n)) return ["krasa","feny"];
  if (/плойк|випрямляч|стайлер|гофр|утюж.*волос|прасочк.*волос/.test(n)) return ["krasa","ployki"];
  if (/тример|триммер/.test(n) && !/кущ|трав|газон|сад/.test(n)) return ["krasa","mashynky-stryzh"];
  if (/епілят|депілят|воскоплав/.test(n)) return ["krasa","epilyatory"];
  if (/шейвер|електробритв|бритв/.test(n) && !/кущ|трав/.test(n)) return ["krasa","epilyatory"];
  if (/манікюр|педикюр|фрезер.*нігт|пилк.*нігт|лампа.*манікюр/.test(n)) return ["krasa","manikyur"];
  if (/дзеркал.*led|дзеркал.*підсвіч|дзеркал.*макіяж/.test(n)) return ["krasa","dzerkala"];
  if (/відпарювач|парова.*прас|праска|прас\b/.test(n) && !/волос/.test(n)) return ["krasa","vidparyuvachi"];
  if (/ковтунц|катишк|машинк.*видален/.test(n)) return ["krasa","kovtuntsi"];
  if (/зубн.*щітк|віні?ри.*зуб|snap.*on.*smile/.test(n)) return ["krasa","zubni-shchitky"];
  if (/бігуді|атласн.*стрижен.*накрутк/.test(n)) return ["krasa","ployki"];

  // БЕЗПЕКА — розширені
  if (/дзвінок|дверн.*дзвін|звонок|d9688/.test(n)) return ["bezpeka","signalizatsiyi"];
  if (/відеоспостереж|камера.*спостереж|ip.*камер|wi-fi.*камер|wifi.*камер|камера.*безпек|solar.*cam|dvr.*kit|камера.*муляж/.test(n)) return ["bezpeka","videosposterezhennya"];
  if (/охорон.*систем|сигналізац|датчик.*рух.*охорон|паркувальн.*систем|парктронік/.test(n)) return ["bezpeka","signalizatsiyi"];
  if (/світловідбивн|відбиваюч/.test(n)) return ["bezpeka","signalizatsiyi"];
  if (/замок.*безпек.*дітей|замок.*вікон/.test(n)) return ["bezpeka","signalizatsiyi"];

  // ЗДОРОВ'Я — розширені
  if (/платформ.*віджиман|дошк.*віджиман|push.*up.*board|віджиманн|foldable.*push/.test(n)) return ["zdorovia","fitnes"];
  if (/масажер|масажн|масаж.*для|антицелюл/.test(n) && !/обличч|волос/.test(n)) return ["zdorovia","masazhery"];
  if (/тренажер|бігов.*доріжк|велотренаж|степер|орбітрек/.test(n)) return ["zdorovia","trenazhery"];
  if (/фітнес|йога|гантел|еспандер|скакалк|турнік|м'яч.*(футбол|баскетбол|волейбол)/.test(n)) return ["zdorovia","fitnes"];
  if (/ваги/.test(n) && !/кухон|торг|багаж/.test(n)) return ["zdorovia","vahy-zdor"];
  if (/бандаж|корсет|ортопед/.test(n)) return ["zdorovia","bandazhi"];
  if (/тонометр|термометр.*медич|градусник.*дитяч|інгалятор/.test(n)) return ["zdorovia","tonometry"];
  if (/зволожуюч.*гелев.*шкарпет|spa.*gel.*socks/.test(n)) return ["zdorovia","zdorovia-inshe"];
  if (/вакуум.*банк.*збільшен.*груд/.test(n)) return ["zdorovia","zdorovia-inshe"];

  // КУХНЯ — розширені
  if (/диспенсер.*мед|дозатор.*мед|honey.*dispenser/.test(n)) return ["kuhnia","zberihannya"];
  if (/електр.*плит|настільн.*плит|інфрачервон.*плит|конфорк|двокомфорк|плита.*газов|газов.*таганок|індукційн.*плит/.test(n)) return ["kuhnia","dukhovky"];
  if (/фольга.*кухн|алюмінієв.*плівк.*кухн|оливостійк.*фольг|захисн.*екран.*бриз.*жир/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/пляшк.*дозатор|дозатор.*олі|press.*and.*measure/.test(n)) return ["kuhnia","zberihannya"];
  if (/пельменниц|пристрій.*пельмен|dumping/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/форм.*випік|силіконов.*форм|silicone.*molds|форм.*кругл.*рознімн/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/набір.*дощок|дошк.*різ.*набір/.test(n)) return ["kuhnia","nozhi"];
  if (/тримач.*різан.*продукт/.test(n)) return ["kuhnia","nozhi"];
  if (/інструмент.*видален.*кісточ|вишнечистк|видавлюв.*кісточ/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/друшляк|друшлаг|складн.*друш/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/дозатор.*кондитер|donut.*maker/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/очищувач.*кукуруд/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/овочечистк|електричн.*чистк/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/вакуум.*пакувальник|vacuum.*sealer|вакууматор/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/подрібнюв.*овоч|food.*chopper/.test(n)) return ["kuhnia","blendery"];
  if (/подвійн.*підігрів.*підставк/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/електромлинець|млинець/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/раковин.*кухн|мийк.*кухн/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/змішувач.*кухн|faucet|кран/.test(n) && /кухн/.test(n)) return ["kuhnia","kuhnia-inshe"];
  if (/пароварк/.test(n)) return ["kuhnia","multyvarky"];
  if (/мультипекар|мультимейкер/.test(n)) return ["kuhnia","tostery"];
  if (/набір.*столов.*прилад|kitchen.*ware/.test(n)) return ["kuhnia","posud"];
  if (/ківш|unique.*un/.test(n) && /см/.test(n)) return ["kuhnia","posud"];

  if (/сковор|каструл|казан|тарілк|миск|чашк/.test(n)) return ["kuhnia","posud"];
  if (/ніж |ножі|ножів|набір.*нож|лопат|дошк.*різ|шумівк|відкривач|овочеріз|терт|слайсер/.test(n)) return ["kuhnia","nozhi"];
  if (/чайник|електрочайник|самовар/.test(n)) return ["kuhnia","chaynyky"];
  if (/блендер|міксер|чопер/.test(n)) return ["kuhnia","blendery"];
  if (/мультивар|аерогрил|скороварк/.test(n)) return ["kuhnia","multyvarky"];
  if (/кавовар|кавомол/.test(n)) return ["kuhnia","kavovarky"];
  if (/соковижим/.test(n)) return ["kuhnia","sokovyzhymalky"];
  if (/духов|електропіч|гриль/.test(n)) return ["kuhnia","dukhovky"];
  if (/тостер|вафельн|блинн|сендвіч/.test(n)) return ["kuhnia","tostery"];
  if (/м'ясоруб|фритюрниц/.test(n)) return ["kuhnia","myasorubky"];
  if (/ваги.*кухон/.test(n)) return ["kuhnia","vahy-kukhonni"];
  if (/контейнер|ємність.*сипуч|органайзер.*кухон|дозатор.*олі|сушарк.*посуд|ланчбокс/.test(n)) return ["kuhnia","zberihannya"];

  // ПОБУТОВА ТЕХНІКА — розширені
  if (/конвектор|конвекторн.*нагрівач/.test(n)) return ["pobutova","obihrivachi"];
  if (/нагрівач|heater|керамічн.*нагрів/.test(n)) return ["pobutova","obihrivachi"];
  if (/швейн.*машин|janome|машин.*шитт/.test(n)) return ["pobutova","shveyni"];
  if (/пральн.*машин|складн.*портативн.*пральн|силіконов.*складн.*пральн/.test(n)) return ["pobutova","pobutova-inshe"];
  if (/сушарк.*біли|сушарк.*одяг|підлогов.*сушарк|launder.*dryer/.test(n)) return ["pobutova","pobutova-inshe"];
  if (/сушарк.*взутт|shoe.*dryer/.test(n)) return ["pobutova","pobutova-inshe"];
  if (/пилосос/.test(n) && !/авто/.test(n)) return ["pobutova","pylososy"];
  if (/вентилятор|кондиціонер/.test(n)) return ["pobutova","ventylyatory"];
  if (/обігрівач|тепловентилятор|камін.*електр/.test(n)) return ["pobutova","obihrivachi"];
  if (/зволожувач|очищувач.*повітр/.test(n)) return ["pobutova","zvolozhuvachi"];
  if (/водонагрівач|бойлер/.test(n)) return ["pobutova","vodonahrivachi"];

  // ІНСТРУМЕНТИ — розширені
  if (/сход|драбин|телескоп.*сход|алюмінієв.*сход/.test(n)) return ["instrumenty","drabyny"];
  if (/акумуляторн.*пил|міні.*пил|ланцюгов.*пил|electric.*saw|ручн.*електричн.*пил/.test(n)) return ["instrumenty","bolgarky"];
  if (/паяльн.*набір|паяльн.*станц|набір.*паян/.test(n)) return ["instrumenty","instrum-inshe"];
  if (/набір.*ремонт.*прокол/.test(n)) return ["instrumenty","instrum-inshe"];
  if (/електростеплер/.test(n)) return ["instrumenty","instrum-inshe"];
  if (/висоторіз|сучкоріз|пил.*обрізк/.test(n)) return ["instrumenty","instrum-inshe"];
  if (/зварюв.*пакет|міні.*зварюв/.test(n)) return ["instrumenty","instrum-inshe"];
  if (/фарборозпил|paint.*zoom|краскопульт|розпилювач.*фарб/.test(n)) return ["instrumenty","instrum-inshe"];
  if (/лінійк.*angler|будівельн.*лінійк/.test(n)) return ["instrumenty","instrum-inshe"];
  
  if (/набір.*інструмент|набір.*ключ/.test(n)) return ["instrumenty","nabory-instrum"];
  if (/шуруповерт|дриль|перфоратор/.test(n)) return ["instrumenty","shurupoverty"];
  if (/болгарк|пилк.*електр|лобзик|циркулярн/.test(n)) return ["instrumenty","bolgarky"];
  if (/ключ|плоскогубц|викрутк|молоток|мультитул/.test(n) && !/набір/.test(n)) return ["instrumenty","ruchni-instrum"];
  if (/зварюваль|зварюван/.test(n) && !/пакет/.test(n)) return ["instrumenty","zvaryuvalni"];
  if (/лазерн.*рівен/.test(n)) return ["instrumenty","lazerni-rivni"];

  // АВТО — розширені
  if (/акумулятор.*електросамокат|акумулятор.*гіроскут/.test(n)) return ["avto","avto-inshe"];
  if (/car.*cam.*360|система.*огляд/.test(n)) return ["avto","videoreestratory"];
  if (/tpms.*solar|контрол.*тиск.*шин/.test(n)) return ["avto","avto-inshe"];
  if (/накидк.*лобов.*скл|захист.*снігу/.test(n)) return ["avto","avto-inshe"];
  if (/насос.*свердловин|шнековий.*насос/.test(n)) return ["avto","avto-inshe"];
  if (/захоплен.*сто/.test(n)) return ["avto","avto-inshe"];
  
  if (/відеореєстр/.test(n)) return ["avto","videoreestratory"];
  if (/компресор|насос.*авто|підкачув/.test(n)) return ["avto","kompresory-avto"];
  if (/тримач.*телефон.*авто|автотримач|освіжувач.*авто/.test(n)) return ["avto","trymachi-avto"];
  if (/автохолодильник/.test(n)) return ["avto","avtokholodylnyky"];
  if (/інвертор|перетворювач.*напруг/.test(n)) return ["avto","invertory"];
  if (/автопилосос|пилосос.*авто|мийк.*тиск|автомагнітол/.test(n)) return ["avto","avto-inshe"];

  // ТУРИЗМ — розширені
  if (/гаманець|клатч|жіноч.*гаманець|wallerry/.test(n)) return ["turyzm","sumky"];
  if (/візок.*складн|ручн.*візок.*вантаж/.test(n)) return ["turyzm","turyzm-inshe"];
  if (/акумулятор.*холод|cooling.*battery/.test(n)) return ["turyzm","piknik"];
  if (/хімічн.*гріл|грілк.*ніг|toe.*warmer/.test(n)) return ["turyzm","turyzm-inshe"];
  
  if (/намет(?!.*дитяч)|спальн.*мішок|каремат|кемпінг/.test(n)) return ["turyzm","namety"];
  if (/пікнік|мангал|шампур|решітк.*грил|термосумк/.test(n)) return ["turyzm","piknik"];
  if (/вудк|котушк.*рибал|риболов/.test(n)) return ["turyzm","rybolovlya"];
  if (/рюкзак|сумк|валіз|чемодан|барсетк|портмоне/.test(n) && !/дитяч|термосумк/.test(n)) return ["turyzm","sumky"];
  if (/пляж|надувн.*виріб|надувн.*басейн|надувн.*круг|надувн.*матрац|гамак|надувн.*кол/.test(n) && !/дитяч/.test(n)) return ["turyzm","plyazh"];

  // ЗООТОВАРИ — розширені
  if (/лежанк.*кот|sunny.*seat.*cat/.test(n)) return ["zoo","zoo-koty"];
  
  if (/собак|повод.*собак|нашийник.*собак/.test(n)) return ["zoo","zoo-sobaky"];
  if (/кішк|котяч|кіт\b|когтеточ/.test(n)) return ["zoo","zoo-koty"];
  if (/зоотовар|тварин/.test(n)) return ["zoo","zoo-inshe"];

  // ТЕЛЕФОНИ — розширені
  if (/стілус.*ipad|стілус.*capacitive/.test(n)) return ["telefony","aksesuary-tel"];
  if (/usb.*хаб|універсальн.*адаптер.*type-c/.test(n)) return ["telefony","aksesuary-komp"];
  if (/перехідник.*vga.*hdmi|конвертер.*hdmi/.test(n)) return ["telefony","aksesuary-komp"];
  if (/hdmi.*розгалужув|hdmi.*splitter/.test(n)) return ["telefony","aksesuary-komp"];
  if (/bluetooth.*адаптер/.test(n)) return ["telefony","aksesuary-komp"];
  
  if (/аксесуар.*телефон|чохол.*телефон/.test(n)) return ["telefony","aksesuary-tel"];
  if (/аксесуар.*ноутбук|підставк.*ноутбук/.test(n)) return ["telefony","aksesuary-komp"];

  // ДИТЯЧІ — розширені
  if (/електромоб|електричн.*карт|електрокар|дитяч.*машин.*акум|m-6072|hl-b6/.test(n)) return ["dytiachi","samokaty"];
  if (/дитяч.*ходунк|ходунк.*бджілк/.test(n)) return ["dytiachi","dytiachi-inshe"];
  if (/дитяч.*шезлонг|гойдалк.*ingenuity/.test(n)) return ["dytiachi","dytiachi-inshe"];
  if (/дитяч.*фотокамер|камер.*друк/.test(n)) return ["dytiachi","dytiachi-elektron"];
  if (/дитячий.*мікроскоп/.test(n)) return ["dytiachi","navchanny"];
  if (/дитяч.*планшет|smart.*cool.*kids/.test(n)) return ["dytiachi","dytiachi-elektron"];
  if (/джойстик.*планшет|ipega/.test(n)) return ["dytiachi","dytiachi-elektron"];
  if (/дитяч.*паровоз|retro.*train|електричн.*поїзд/.test(n)) return ["dytiachi","ihrashky"];
  if (/ігров.*центр.*джемпер|fisher.*price|jumperoo/.test(n)) return ["dytiachi","ihrashky"];
  if (/футбольн.*ворот.*дитя|міні.*футбол|футбольн.*набір/.test(n) && /дитя/.test(n)) return ["dytiachi","ihrashky"];
  if (/дитяч.*рац.*відео|відеорац/.test(n)) return ["dytiachi","dytiachi-elektron"];
  if (/набір.*косметик.*сумочц|дитяч.*косметик|набір.*дівчат/.test(n)) return ["dytiachi","ihrashky"];
  if (/намет.*дитяч|ігров.*замок|будиноч.*шатер.*басейн/.test(n)) return ["dytiachi","dytiachi-namety"];
  if (/надувн.*центр.*bestway|надувн.*ігров.*центр/.test(n)) return ["dytiachi","dytiachi-namety"];
  if (/басейн.*дитяч.*сухий|басейн.*куль/.test(n)) return ["dytiachi","dytiachi-namety"];
  if (/пенні.*борд|дитяч.*скейт/.test(n)) return ["dytiachi","samokaty"];
  if (/набір.*водн.*олівц|дитяч.*набір.*маркер/.test(n)) return ["dytiachi","tvorchist"];
  if (/фігур.*щенячий.*патруль|мініфігур.*minecraft/.test(n)) return ["dytiachi","ihrashky"];
  if (/аеромобіл.*машинк.*кульк|aerodynamics/.test(n)) return ["dytiachi","ihrashky"];
  if (/машинк.*hobby.*leader|машинк.*кул/.test(n)) return ["dytiachi","mashynky-rc"];
  if (/симулятор.*водінн.*дитяч|ігров.*гоночн.*симулятор/.test(n)) return ["dytiachi","dytiachi-elektron"];
  if (/повітрян.*тир|joy.*acousto/.test(n)) return ["dytiachi","ihrashky"];
  if (/баскетбольн.*набір.*дитяч|підвісн.*міні.*баскетбол/.test(n)) return ["dytiachi","ihrashky"];
  if (/термопринтер.*дитяч|міні.*принтер.*котик/.test(n)) return ["dytiachi","dytiachi-elektron"];
  if (/ручк.*здоров.*коректор.*постав/.test(n)) return ["dytiachi","navchanny"];
  
  if (/конструктор|лего|lego/.test(n)) return ["dytiachi","konstruktory"];
  if (/машинк.*радіо|радіокеруван|rc.*машин/.test(n)) return ["dytiachi","mashynky-rc"];
  if (/інтерактивн|літаюч.*іграш|дрон.*дитяч|капібар/.test(n)) return ["dytiachi","interaktyvni"];
  if (/самокат|велосипед.*дитяч|біговел|електромоб/.test(n) && !/акумулятор/.test(n)) return ["dytiachi","samokaty"];
  if (/творч|малюванн|фарб.*дитяч|розмальовк|пластилін/.test(n)) return ["dytiachi","tvorchist"];
  if (/розвиваюч|розумн.*іграш|неокуб/.test(n)) return ["dytiachi","navchanny"];
  if (/парта.*школ|дитяч.*стіл|стільчик.*годуван/.test(n)) return ["dytiachi","dytiachi-mebli"];
  if (/дитяч.*навушник|дитяч.*фотоапарат|дитяч.*годинник/.test(n)) return ["dytiachi","dytiachi-elektron"];
  if (/іграшк|ляльк|плюш|м'як.*іграш|бластер|пістолет.*дитяч|настільн.*гра/.test(n)) return ["dytiachi","ihrashky"];

  // ОСВІТЛЕННЯ — розширені
  if (/rgb.*лампа|кільцев.*селфі.*лампа|світло.*блогер/.test(n)) return ["osvitlennya","svitylnyky"];
  if (/настільн.*лампа.*акумулятор|лампа.*cozy/.test(n)) return ["osvitlennya","svitylnyky"];
  if (/лампа.*комар|пастк.*комар|electric.*shock|антимоскіт|знищувач.*комах/.test(n)) return ["osvitlennya","svitylnyky"];
  if (/світлодіодн.*панел|led.*matrix|led.*panel/.test(n)) return ["osvitlennya","hirlyandy"];
  if (/біг.*рядок/.test(n)) return ["osvitlennya","hirlyandy"];
  
  if (/ліхтар|фонар|ліхтарик/.test(n) && !/вуличн/.test(n)) return ["osvitlennya","likhtari"];
  if (/вуличн.*ліхтар|прожектор/.test(n)) return ["osvitlennya","vulychni-likhtari"];
  if (/світильник|настільн.*лампа|led.*лампа|торшер/.test(n)) return ["osvitlennya","svitylnyky"];
  if (/нічник/.test(n)) return ["osvitlennya","nichniky"];
  if (/гірлянд|led.*стрічк|неонов|rgb.*стрічк|новоріч/.test(n)) return ["osvitlennya","hirlyandy"];

  // ЕЛЕКТРОНІКА — розширені
  if (/підсилювач.*звук|підсилювач.*amp/.test(n)) return ["elektronika","elektronika-inshe"];
  if (/ресівер.*т2|тюнер.*т2|телевізійн.*приймач/.test(n)) return ["elektronika","elektronika-inshe"];
  if (/портативн.*консол|ретро.*консол|psp/.test(n)) return ["elektronika","ihrovi-prystav"];
  if (/геймпад|джойстик|dualshock/.test(n) && !/дитяч/.test(n)) return ["elektronika","ihrovi-prystav"];
  if (/розпилюв.*nano/.test(n)) return ["elektronika","elektronika-inshe"];
  if (/ефірн.*олі.*дифузор|аромамасло/.test(n)) return ["elektronika","elektronika-inshe"];
  if (/монопод.*датчик.*рух|смарт.*штатив/.test(n)) return ["elektronika","elektronika-inshe"];
  if (/збільшувач.*екран.*смартфон|3d.*enlarged/.test(n)) return ["elektronika","elektronika-inshe"];
  if (/штатив.*телефон|селфі.*палк/.test(n)) return ["elektronika","elektronika-inshe"];
  if (/тримач.*штатив|гнучк.*тримач.*штатив/.test(n)) return ["elektronika","elektronika-inshe"];
  if (/кронштейн.*тв|кронштейн.*стін/.test(n)) return ["elektronika","elektronika-inshe"];
  
  if (/колонк|акустич|караоке|мікрофон|портативн.*колонк/.test(n) && !/дитяч/.test(n)) return ["elektronika","kolonky"];
  if (/навушник|гарнітур|airpod|tws/.test(n) && !/дитяч/.test(n)) return ["elektronika","navushnyky"];
  if (/powerbank|повербанк|зовнішн.*акумулятор|зарядн.*пристр/.test(n)) return ["elektronika","powerbanky"];
  if (/смарт.*годинник|smart.*watch|розумн.*годинник/.test(n)) return ["elektronika","smart-hodynnyky"];
  if (/проектор/.test(n) && !/дитяч/.test(n)) return ["elektronika","proektory"];
  if (/ігров.*приставк/.test(n) && !/дитяч/.test(n)) return ["elektronika","ihrovi-prystav"];
  if (/радіо|магнітол|антен|детектор.*банкнот|годинник|будильник/.test(n)) return ["elektronika","elektronika-inshe"];

  // ДІМ — розширені (меблі, текстиль, декор)
  if (/столик.*журнальн|столик.*інтер|столик.*and-|столик.*пересув|приліжков.*столик/.test(n)) return ["dim","mebli"];
  if (/стіл.*комп'ютерн|стіл.*письмов|стіл.*ігров/.test(n)) return ["dim","mebli"];
  if (/етажерк.*візок|етажерк.*колісц/.test(n)) return ["dim","organayzer"];
  if (/чохол.*диван|чохол.*стіл|чохол.*кріс|накидк.*диван|жакардов.*чохол|натяжн.*чохол/.test(n)) return ["dim","tekstyl"];
  if (/комплект.*чохл.*стіл/.test(n)) return ["dim","tekstyl"];
  if (/бюстгальтер|ліфчик|fly.*bra/.test(n)) return ["dim","tekstyl"];
  if (/колготи.*флісі|колготи.*зимов/.test(n)) return ["dim","tekstyl"];
  if (/шкарпет.*пальц|five.*finger/.test(n)) return ["dim","tekstyl"];
  if (/простирадло.*резинц|наматрацник/.test(n)) return ["dim","tekstyl"];
  if (/ліжко.*матрац|надувн.*ліжк|розкладн.*ліжк|розкладачк/.test(n)) return ["dim","mebli"];
  if (/диван.*відпочинк|складн.*диван/.test(n)) return ["dim","mebli"];
  if (/поліроль.*мебл|beewax/.test(n)) return ["dim","dim-inshe"];
  if (/москітн.*сітк|антимоскітн.*штор|magic.*mesh/.test(n)) return ["dim","dim-inshe"];
  if (/організатор.*документ/.test(n)) return ["dim","organayzer"];
  if (/підставк.*кришок/.test(n)) return ["dim","organayzer"];
  if (/клей.*силіконов|клей.*стрижн/.test(n)) return ["dim","dim-inshe"];
  if (/очисник.*універсальн|знежирюв/.test(n)) return ["dim","prybyrannya"];
  if (/щітк.*чищен.*щілин|gap.*brush/.test(n)) return ["dim","prybyrannya"];
  if (/багатофункціональн.*щітк.*скребок/.test(n)) return ["dim","prybyrannya"];
  if (/набір.*емульс.*рідк.*газон|hydro.*mousse/.test(n)) return ["dim","sad"];
  if (/кліпса.*комар|bikit.*guard/.test(n)) return ["dim","dim-inshe"];
  if (/магніт.*дому|value.*pack/.test(n)) return ["dim","dim-inshe"];
  if (/силіконов.*шпатель|скребок.*герметик/.test(n)) return ["dim","dim-inshe"];
  if (/видавлюв.*зубн.*паст/.test(n)) return ["dim","dim-inshe"];
  if (/самоклеюч.*плівк|мармур/.test(n)) return ["dim","dekor"];
  if (/тримач.*мил|soap.*dish/.test(n)) return ["dim","vanna"];
  if (/сонячн.*систем|solar.*energy/.test(n)) return ["dim","dim-inshe"];
  if (/станц.*заряджан.*сонячн/.test(n)) return ["dim","dim-inshe"];
  
  if (/тумб|шаф|полиц|комод|стелаж|вішал|табурет|пуф/.test(n)) return ["dim","mebli"];
  if (/текстиль|подушк|плед|рушник|ковдр|постільн|ковр|килим/.test(n) && !/дитяч/.test(n)) return ["dim","tekstyl"];
  if (/декор|картин|ваз|скарбничк|свіч|рамк.*фото/.test(n)) return ["dim","dekor"];
  if (/органайзер|кофр|зберіганн.*реч/.test(n)) return ["dim","organayzer"];
  if (/прибиранн|швабр|щітк.*прибир/.test(n)) return ["dim","prybyrannya"];
  if (/сад|город|шланг|секатор/.test(n)) return ["dim","sad"];
  if (/ванн|душ|дозатор.*мил|штор.*ванн/.test(n)) return ["dim","vanna"];

  // РІЗНЕ
  if (/скотч|пакувальн.*скотч/.test(n)) return ["dim","dim-inshe"];
  if (/пароочисник|ручн.*пароочисник/.test(n)) return ["pobutova","pobutova-inshe"];
  if (/машинк.*рахунку.*грош|рахунков.*машинк|лічильник.*банкнот/.test(n)) return ["dim","dim-inshe"];
  if (/ваги.*торговельн|ваги.*електронн.*rainberg|підлогов.*ваги/.test(n)) return ["dim","dim-inshe"];
  if (/набір.*шитт|набір.*паян/.test(n)) return ["dim","dim-inshe"];
  if (/запальничк.*usb|електроімпульсн.*запальн/.test(n)) return ["dim","dim-inshe"];
  if (/мухобійк.*електричн|buzzeap/.test(n)) return ["dim","dim-inshe"];
  if (/кабель|патч.*корд|lan|hdmi/.test(n)) return ["telefony","aksesuary-komp"];
  if (/адаптер|перехідник/.test(n) && !/кухн/.test(n)) return ["telefony","aksesuary-komp"];
  if (/подовжувач|мережев.*фільтр/.test(n)) return ["telefony","aksesuary-komp"];
  if (/клавіатур.*планшет|bluetooth.*клавіатур/.test(n)) return ["telefony","aksesuary-tel"];
  if (/алко.*шахи|шахи.*чарк/.test(n)) return ["dim","dekor"];

  return ["dim","dim-inshe"];
}

async function run() {
  console.log("=== FINAL RECLASSIFY — All 909 'Інше' Products ===\n");
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
  console.log("\nRun check-categories.mjs to verify results!");
}

run().catch(console.error);
