import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "Контакти — TALIRA", description: "Зв'яжіться з нами: телефон, Telegram, Instagram, email" };

export default function ContactsPage() {
  return (
    <>
      <Header />
      <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "20px 48px", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)" }}>
        <Link href="/" style={{ color: "var(--text)" }}>Головна</Link><span style={{ margin: "0 12px" }}>/</span><span style={{ color: "var(--ink)" }}>Контакти</span>
      </div>

      <section style={{ padding: "20px 0 80px" }}>
        <div className="container-pad grid-specs" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", alignItems: "start" }}>
          <div>
            <h1 className="title-page" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "20px" }}>
              Зв&apos;яжіться <em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>з нами</em>
            </h1>
            <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: "1.75", marginBottom: "40px", maxWidth: "480px" }}>
              Ми завжди на зв&apos;язку. Оберіть зручний спосіб — відповідаємо швидко.
            </p>
            <ContactItem icon="📱" label="Телефон" value="+380 XX XXX XX XX" sub="Щодня з 9:00 до 21:00" />
            <ContactItem icon="✈️" label="Telegram" value="@talira_shop" sub="Найшвидший спосіб" />
            <ContactItem icon="📸" label="Instagram" value="@talira.com.ua" sub="Новинки та відгуки" />
            <ContactItem icon="📧" label="Email" value="hello@talira.com.ua" sub="Для співпраці" />
          </div>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", padding: "40px" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400, marginBottom: "24px" }}>Графік роботи</h3>
            <ScheduleRow day="Понеділок — П'ятниця" time="9:00 — 21:00" />
            <ScheduleRow day="Субота" time="10:00 — 19:00" />
            <ScheduleRow day="Неділя" time="10:00 — 18:00" />
            <div style={{ padding: "24px", background: "var(--bg)", border: "1px solid var(--line-soft)", margin: "24px 0" }}>
              <h4 style={{ fontSize: "11px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 600, marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>Обробка замовлень</h4>
              <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.65" }}>Відправка Новою Поштою до 17:00 (крім неділі). Підтвердження за 15–30 хвилин.</p>
            </div>
            <div style={{ padding: "24px", background: "var(--ink)", color: "var(--bg)", textAlign: "center" }}>
              <p style={{ fontSize: "12px", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "8px", color: "var(--gold-soft)" }}>Швидкий зв&apos;язок</p>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px" }}>Telegram — відповімо за 5 хвилин</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function ContactItem({ icon, label, value, sub }: { icon: string; label: string; value: string; sub: string }) {
  return (
    <div style={{ display: "flex", gap: "16px", padding: "24px 0", borderBottom: "1px solid var(--line-soft)", alignItems: "flex-start" }}>
      <div style={{ fontSize: "24px", width: "40px", textAlign: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "6px", fontWeight: 500 }}>{label}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500, marginBottom: "4px" }}>{value}</div>
        <div style={{ fontSize: "13px", color: "var(--text-dim)" }}>{sub}</div>
      </div>
    </div>
  );
}

function ScheduleRow({ day, time }: { day: string; time: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line-soft)", fontSize: "14px" }}>
      <span style={{ color: "var(--text)" }}>{day}</span>
      <span style={{ color: "var(--ink)", fontWeight: 500 }}>{time}</span>
    </div>
  );
}
