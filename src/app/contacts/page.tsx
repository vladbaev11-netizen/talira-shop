import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export const metadata = { title: "Контакти — TALIRA", description: "Зв'яжіться з нами: телефон, Telegram, Viber, WhatsApp, email" };

export default function ContactsPage() {
  return (
    <>
      <Header />
      <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "20px 48px", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)" }}>
        <Link href="/" style={{ color: "var(--text)" }}>{"Головна"}</Link><span style={{ margin: "0 12px" }}>/</span><span style={{ color: "var(--ink)" }}>{"Контакти"}</span>
      </div>

      <section style={{ padding: "20px 0 80px" }}>
        <div className="container-pad grid-specs" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", alignItems: "start" }}>
          <div>
            <h1 className="title-page" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "20px" }}>
              {"Зв\u0027яжіться "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>{"з нами"}</em>
            </h1>
            <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: "1.75", marginBottom: "40px", maxWidth: "480px" }}>
              {"Ми завжди на зв\u0027язку. Оберіть зручний спосіб — відповідаємо швидко."}
            </p>
            <ContactItem icon="📱" label="Телефон" value="+380 63 529 41 05" sub="Щодня з 9:00 до 21:00" href="tel:+380635294105" />
            <ContactItem icon="✈️" label="Telegram" value="@talira_com_ua" sub="Найшвидший спосіб" href="https://t.me/talira_com_ua" />
            <ContactItem icon="💬" label="Viber" value="+380 63 529 41 05" sub="Напишіть або зателефонуйте" href="viber://chat?number=%2B380635294105" />
            <ContactItem icon="📱" label="WhatsApp" value="+380 63 529 41 05" sub="Зручно з-за кордону" href="https://wa.me/380635294105" />
            <ContactItem icon="📸" label="Instagram" value="@talira.com.ua" sub="Новинки та відгуки" href="https://www.instagram.com/talira.com.ua" />
            <ContactItem icon="📧" label="Email" value="talira.com.ua@gmail.com" sub="Для співпраці" href="mailto:talira.com.ua@gmail.com" />
          </div>
          <div style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", padding: "40px" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 400, marginBottom: "24px" }}>{"Графік роботи"}</h3>
            <ScheduleRow day="Понеділок — Четвер" time="9:00 — 21:00" />
            <ScheduleRow day="П'ятниця" time="Вихідний" />
            <ScheduleRow day="Субота" time="10:00 — 19:00" />
            <ScheduleRow day="Неділя" time="Вихідний" />
            <div style={{ padding: "24px", background: "var(--bg)", border: "1px solid var(--line-soft)", margin: "24px 0" }}>
              <h4 style={{ fontSize: "11px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 600, marginBottom: "12px", fontFamily: "'Inter', sans-serif" }}>{"Відправка замовлень"}</h4>
              <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.65" }}>{"Пн–Чт відправка до 16:00. Субота до 14:00. П\u0027ятниця та неділя — відправок немає."}</p>
            </div>
            {/* Quick contact buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <a href="https://t.me/talira_com_ua" target="_blank" rel="noopener noreferrer" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "#2AABEE", color: "#fff", borderRadius: "8px", fontSize: "14px", fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
                {"✈️ Написати в Telegram"}
              </a>
              <a href="tel:+380635294105" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", padding: "16px", background: "var(--ink)", color: "var(--bg)", borderRadius: "8px", fontSize: "14px", fontWeight: 600, fontFamily: "'Inter', sans-serif", textDecoration: "none" }}>
                {"📱 Зателефонувати"}
              </a>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

function ContactItem({ icon, label, value, sub, href }: { icon: string; label: string; value: string; sub: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={{ display: "flex", gap: "16px", padding: "24px 0", borderBottom: "1px solid var(--line-soft)", alignItems: "flex-start", textDecoration: "none", color: "inherit" }}>
      <div style={{ fontSize: "24px", width: "40px", textAlign: "center", flexShrink: 0 }}>{icon}</div>
      <div>
        <div style={{ fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase", color: "var(--gold-deep)", marginBottom: "6px", fontWeight: 500 }}>{label}</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500, marginBottom: "4px", color: "var(--ink)" }}>{value}</div>
        <div style={{ fontSize: "13px", color: "var(--text-dim)" }}>{sub}</div>
      </div>
    </a>
  );
}

function ScheduleRow({ day, time }: { day: string; time: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid var(--line-soft)", fontSize: "14px" }}>
      <span style={{ color: "var(--text)" }}>{day}</span>
      <span style={{ color: time === "Вихідний" ? "var(--text-dim)" : "var(--ink)", fontWeight: time === "Вихідний" ? 400 : 500 }}>{time}</span>
    </div>
  );
}
