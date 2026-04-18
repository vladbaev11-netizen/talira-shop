import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Доставка та оплата — TALIRA",
  description: "Умови доставки Новою Поштою по всій Україні та способи оплати",
};

export default function DeliveryPage() {
  return (
    <>
      <Header />

      {/* Breadcrumbs */}
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "20px 48px", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)" }} className="container-pad">
        <Link href="/" style={{ color: "var(--text)" }}>Головна</Link>
        <span style={{ margin: "0 12px" }}>/</span>
        <span style={{ color: "var(--ink)" }}>Доставка та оплата</span>
      </div>

      {/* Hero */}
      <section style={{ padding: "20px 0 60px", borderBottom: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }} className="container-pad">
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", fontWeight: 400, marginBottom: "16px" }}>
            Доставка та{" "}
            <em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>оплата</em>
          </h1>
          <p style={{ fontSize: "15px", color: "var(--text)", maxWidth: "600px", lineHeight: "1.7" }}>
            Відправляємо замовлення щодня. Оплата при отриманні — перевіряйте товар перед тим, як платити.
          </p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "60px 0 80px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px" }} className="container-pad grid-specs">

          {/* Доставка */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
              <div style={{ fontSize: "32px" }}>🚚</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400 }}>Доставка</h2>
            </div>

            <InfoBlock title="Нова Пошта" items={[
              "Доставка по всій Україні у будь-яке відділення",
              "Термін доставки: 1–3 робочих дні",
              "Відправка щодня до 17:00 (крім неділі)",
              "Безкоштовна доставка при замовленні від 2 000 ₴",
              "Вартість доставки до 2 000 ₴ — за тарифами Нової Пошти",
            ]} />

            <InfoBlock title="Відстеження" items={[
              "Після відправки ви отримаєте ТТН-номер у Telegram або SMS",
              "Відстежуйте посилку на сайті Нової Пошти",
              "Посилка зберігається у відділенні до 5 днів",
            ]} />
          </div>

          {/* Оплата */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px" }}>
              <div style={{ fontSize: "32px" }}>💳</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400 }}>Оплата</h2>
            </div>

            <InfoBlock title="Наложений платіж (при отриманні)" items={[
              "Оплачуйте товар безпосередньо у відділенні Нової Пошти",
              "Перевірте товар перед оплатою — ви маєте право огляду",
              "Комісія Нової Пошти: ~20 ₴ + 2% від суми",
              "Найпопулярніший спосіб оплати серед наших клієнтів",
            ]} />

            <InfoBlock title="Повернення та обмін" items={[
              "14 днів на повернення з моменту отримання",
              "Товар має бути у оригінальній упаковці без слідів використання",
              "Зворотна доставка за рахунок покупця",
              "Повернення коштів протягом 3–5 робочих днів",
            ]} />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ padding: "60px 0 80px", background: "var(--bg-soft)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 48px" }} className="container-pad">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400, marginBottom: "40px", textAlign: "center" }}>
            Часті{" "}
            <em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>питання</em>
          </h2>

          <FaqItem
            q="Скільки коштує доставка?"
            a="При замовленні від 2 000 ₴ — безкоштовно. До 2 000 ₴ — за тарифами Нової Пошти (зазвичай 50–80 ₴)."
          />
          <FaqItem
            q="Як швидко відправляєте?"
            a="Замовлення, оформлені до 17:00, відправляємо того ж дня. Після 17:00 та у неділю — наступного робочого дня."
          />
          <FaqItem
            q="Чи можна оглянути товар перед оплатою?"
            a="Так, при наложеному платежі ви маєте право оглянути товар у відділенні Нової Пошти перед оплатою."
          />
          <FaqItem
            q="Як повернути товар?"
            a="Протягом 14 днів зв'яжіться з нами у Telegram або за телефоном. Товар повинен бути в оригінальній упаковці."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div style={{ marginBottom: "32px", padding: "28px", background: "var(--paper)", border: "1px solid var(--line-soft)" }}>
      <h3 style={{ fontSize: "11px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 600, marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>
        {title}
      </h3>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: "12px", padding: "10px 0", fontSize: "14px", color: "var(--ink-soft)", lineHeight: "1.55", borderBottom: i < items.length - 1 ? "1px solid var(--line-soft)" : "none" }}>
          <svg width="14" height="14" fill="none" stroke="var(--gold-deep)" strokeWidth="2" viewBox="0 0 24 24" style={{ flexShrink: 0, marginTop: "3px" }}>
            <path d="M20 6 9 17l-5-5" />
          </svg>
          {item}
        </div>
      ))}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div style={{ padding: "24px 0", borderBottom: "1px solid var(--line)" }}>
      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, marginBottom: "10px", color: "var(--ink)" }}>
        {q}
      </h4>
      <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.7" }}>
        {a}
      </p>
    </div>
  );
}
