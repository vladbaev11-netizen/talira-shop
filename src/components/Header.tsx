"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Головна" },
  { href: "/catalog", label: "Каталог" },
  { href: "/about", label: "Бренд" },
  { href: "/delivery", label: "Доставка" },
  { href: "/reviews", label: "Відгуки" },
  { href: "/contacts", label: "Контакти" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <style>{`
        .nav-link {
          color: var(--ink-soft); font-size: 11px; letter-spacing: .22em;
          text-transform: uppercase; font-weight: 500; padding: 8px 16px;
          transition: all .25s; text-decoration: none; border-bottom: 2px solid transparent;
        }
        .nav-link:hover { color: #fff; background: var(--gold-deep); }
        .nav-link.active { color: #fff; background: var(--gold-deep); font-weight: 600; }
      `}</style>

      <div style={{ background: "var(--ink)", color: "var(--bg)", padding: "9px 20px", fontSize: "10px", letterSpacing: ".18em", textTransform: "uppercase", textAlign: "center" }}>
        Безкоштовна доставка від 2000 ₴
        <span style={{ color: "var(--gold-soft)", fontStyle: "italic", textTransform: "none", letterSpacing: ".05em", fontFamily: "'Cormorant Garamond', serif", fontSize: "13px", margin: "0 6px" }}>·</span>
        Оплата при отриманні
      </div>

      <header style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(245,241,232,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid var(--line-soft)" }}>
        <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button className="mobile-only" onClick={() => setMenuOpen(!menuOpen)}
              style={{ background: "transparent", border: "none", cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "4px", zIndex: 101 }}
            >
              <span style={{ width: "20px", height: "1.5px", background: "var(--ink)", transition: "all .3s", transform: menuOpen ? "rotate(45deg) translateY(5.5px)" : "none" }} />
              <span style={{ width: "20px", height: "1.5px", background: "var(--ink)", transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ width: "20px", height: "1.5px", background: "var(--ink)", transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translateY(-5.5px)" : "none" }} />
            </button>

            <Link href="/" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 500, letterSpacing: ".3em", color: "var(--ink)", lineHeight: 1 }}>
              TAL<span style={{ color: "var(--gold-deep)", fontWeight: 500 }}>I</span>RA
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <nav className="desktop-only" style={{ display: "flex", gap: "0" }}>
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className={"nav-link" + (pathname === item.href ? " active" : "")}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <button style={{ background: "transparent", border: "none", color: "var(--ink-soft)", width: "42px", height: "42px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" /><path d="m21 21-4.35-4.35" /></svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — full screen with proper top padding */}
      {menuOpen && (
        <div className="mobile-only" style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "var(--bg)", zIndex: 98, paddingTop: "120px", padding: "120px 24px 40px", overflowY: "auto" }}>
          <nav style={{ display: "flex", flexDirection: "column" }}>
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMenuOpen(false)}
                style={{
                  fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400,
                  padding: "20px 0", borderBottom: "1px solid var(--line-soft)",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                  color: pathname === item.href ? "var(--gold-deep)" : "var(--ink)",
                }}
              >
                {item.label}
                <span style={{ color: "var(--gold-deep)", fontSize: "18px" }}>→</span>
              </Link>
            ))}
          </nav>

          <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--line-soft)" }}>
            <p style={{ fontSize: "12px", color: "var(--text-dim)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "16px" }}>Контакти</p>
            <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "8px" }}>+380 XX XXX XX XX</p>
            <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "8px" }}>hello@talira.com.ua</p>
            <p style={{ fontSize: "14px", color: "var(--text)" }}>@talira.com.ua</p>
          </div>
        </div>
      )}
    </>
  );
}
