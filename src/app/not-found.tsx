import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Header />
      <section style={{ padding: "100px 0", textAlign: "center" }}>
        <div className="container-pad" style={{ maxWidth: "600px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "120px", fontWeight: 300, color: "var(--line)", lineHeight: 1, marginBottom: "16px" }}>
            404
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400, marginBottom: "16px" }}>
            {"Сторінку"} <em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"не знайдено"}</em>
          </h1>
          <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: "1.7", marginBottom: "32px" }}>
            {"Можливо, ця сторінка була видалена або ви перейшли за невірним посиланням."}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" style={{ background: "var(--ink)", color: "var(--bg)", padding: "14px 28px", fontSize: "11px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              {"Головна"}
            </Link>
            <Link href="/catalog" style={{ padding: "14px 28px", border: "1px solid var(--ink)", color: "var(--ink)", fontSize: "11px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", borderRadius: "4px", display: "inline-flex", alignItems: "center", gap: "8px" }}>
              {"Каталог"}
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
