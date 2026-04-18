import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = {
  title: "Про бренд — TALIRA",
  description: "Talira — ретельно підібрана колекція предметів для дому, краси та здоров'я. Наша філософія та принципи.",
};

export default function AboutPage() {
  return (
    <>
      <Header />

      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "20px 48px", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)" }} className="container-pad">
        <Link href="/" style={{ color: "var(--text)" }}>Головна</Link>
        <span style={{ margin: "0 12px" }}>/</span>
        <span style={{ color: "var(--ink)" }}>Про бренд</span>
      </div>

      {/* Hero */}
      <section style={{ padding: "20px 0 80px" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }} className="container-pad">
          <div style={{ maxWidth: "800px" }}>
            <div style={{ fontSize: "11px", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 500, display: "inline-flex", alignItems: "center", gap: "14px", marginBottom: "32px" }}>
              <span style={{ width: "30px", height: "1px", background: "var(--gold)", display: "inline-block" }} />
              Про Talira
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px, 6vw, 72px)", lineHeight: ".95", fontWeight: 400, marginBottom: "28px" }}>
              Красиве — для{" "}
              <em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>щоденного.</em>
            </h1>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "22px", color: "var(--text)", lineHeight: "1.5", maxWidth: "600px" }}>
              Talira — це не просто магазин. Це погляд на те, яким може бути простір навколо вас. Меблі, електроніка, краса — об&apos;єднані однією філософією.
            </p>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section style={{ padding: "80px 0", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", background: "var(--paper)" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 48px", textAlign: "center" }} className="container-pad">
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "100px", lineHeight: ".5", color: "var(--gold-deep)", marginBottom: "20px" }}>&ldquo;</div>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(24px, 3.5vw, 40px)", lineHeight: "1.35", color: "var(--ink)", fontWeight: 400, marginBottom: "28px" }}>
            Ми віримо, що{" "}
            <em style={{ color: "var(--gold-deep)" }}>деталі</em>{" "}
            формують відчуття дому. Кожен предмет — це тиха обіцянка:{" "}
            <em style={{ color: "var(--gold-deep)" }}>красиве має бути</em>{" "}
            частиною повсякдення, а не святковим винятком.
          </p>
          <div style={{ fontSize: "11px", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 500 }}>
            — Філософія бренду
          </div>
        </div>
      </section>

      {/* Principles */}
      <section style={{ padding: "80px 0" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }} className="container-pad">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 400, marginBottom: "48px" }}>
            На чому{" "}
            <em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>будуємо</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "0" }} className="grid-specs">
            <Principle num="01" title="Ретельний вибір" desc="Кожен товар у нашій колекції проходить особистий відбір. Ми не додаємо те, що не поставили б у свій власний дім." />
            <Principle num="02" title="Естетика + функція" desc="Красиве і корисне — нероздільні. Предмет, що не приносить задоволення при погляді, не вартий свого місця." />
            <Principle num="03" title="Чесність у деталях" desc="Відкрита комунікація, прозорі умови, оплата при отриманні. Довіра будується на простих речах." />
          </div>
        </div>
      </section>

      {/* Story */}
      <section style={{ padding: "80px 0", background: "var(--bg-soft)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }} className="container-pad">
          <div style={{ maxWidth: "700px" }}>
            <div style={{ fontSize: "11px", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 500, marginBottom: "20px" }}>
              — Наша історія —
            </div>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", lineHeight: "1.05", fontWeight: 400, marginBottom: "28px" }}>
              Від однієї ідеї до{" "}
              <em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>чотирьох колекцій</em>
            </h2>
            <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: "1.85", marginBottom: "18px" }}>
              <strong style={{ color: "var(--ink)", fontWeight: 500 }}>Talira народилась у 2024 році</strong>{" "}
              як спроба відповісти на просте питання: чому предмети для дому обираються за ціною, а не за враженням, яке вони залишають?
            </p>
            <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: "1.85", marginBottom: "18px" }}>
              Ми почали з однієї категорії — меблів з підсвіткою. Побачили, як змінюється простір навколо людини, коли в ньому з&apos;являється продумана деталь. І зрозуміли: це треба масштабувати.
            </p>
            <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: "1.85" }}>
              Сьогодні Talira — це чотири ретельно сформовані колекції: меблі, здоров&apos;я, електроніка, краса. Об&apos;єднані одним поглядом на естетику щоденного життя.
            </p>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section style={{ padding: "72px 0", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px", textAlign: "center" }} className="container-pad grid-trust">
          <NumBlock num="12K+" label="Задоволених клієнтів" />
          <NumBlock num="4.9" label="Середній рейтинг" />
          <NumBlock num="57" label="Товарів у колекції" />
          <NumBlock num="24" label="Міста доставки" />
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", color: "var(--bg)", padding: "80px 0", textAlign: "center" }}>
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "0 48px" }} className="container-pad">
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 4vw, 48px)", lineHeight: "1.05", fontWeight: 400, marginBottom: "20px" }}>
            Почніть з{" "}
            <em style={{ color: "var(--gold-soft)", fontStyle: "italic", fontWeight: 300 }}>однієї</em>{" "}
            речі
          </h2>
          <p style={{ color: "rgba(245,241,232,.7)", fontSize: "15px", marginBottom: "32px", lineHeight: "1.7" }}>
            Одна продумана деталь — і простір стає вашим. Оберіть свою з нашої колекції.
          </p>
          <Link href="/catalog" style={{ background: "var(--gold-soft)", color: "var(--ink)", padding: "16px 36px", fontSize: "11px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "10px" }}>
            Дослідити каталог
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}

function Principle({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div style={{ padding: "0 32px", borderRight: "1px solid var(--line)" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "56px", color: "var(--gold-deep)", lineHeight: ".85", marginBottom: "24px", fontWeight: 300 }}>
        {num}
      </div>
      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, marginBottom: "12px" }}>
        {title}
      </h3>
      <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: "1.75" }}>{desc}</p>
    </div>
  );
}

function NumBlock({ num, label }: { num: string; label: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "56px", lineHeight: 1, color: "var(--gold-deep)", fontWeight: 300, fontStyle: "italic", marginBottom: "10px" }}>
        {num}
      </div>
      <div style={{ fontSize: "11px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--text)" }}>
        {label}
      </div>
    </div>
  );
}
