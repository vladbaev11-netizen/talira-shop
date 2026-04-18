"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div
        style={{
          background: "var(--ink)",
          color: "var(--bg)",
          padding: "9px 20px",
          fontSize: "10px",
          letterSpacing: ".18em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        Безкоштовна доставка від 2000 ₴
        <span
          style={{
            color: "var(--gold-soft)",
            fontStyle: "italic",
            textTransform: "none",
            letterSpacing: ".05em",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "13px",
            margin: "0 6px",
          }}
        >
          ·
        </span>
        Оплата при отриманні
      </div>

      {/* Main header */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          background: "rgba(245,241,232,.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--line-soft)",
        }}
      >
        <div
          style={{
            maxWidth: "1320px",
            margin: "0 auto",
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            height: "64px",
          }}
        >
          {/* Left: burger (mobile) + nav (desktop) */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* Burger - mobile only */}
            <button
              className="mobile-only"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                display: "flex",
                flexDirection: "column",
                gap: "4px",
              }}
            >
              <span style={{ width: "20px", height: "1.5px", background: "var(--ink)", transition: "all .3s", transform: menuOpen ? "rotate(45deg) translateY(5.5px)" : "none" }} />
              <span style={{ width: "20px", height: "1.5px", background: "var(--ink)", transition: "all .3s", opacity: menuOpen ? 0 : 1 }} />
              <span style={{ width: "20px", height: "1.5px", background: "var(--ink)", transition: "all .3s", transform: menuOpen ? "rotate(-45deg) translateY(-5.5px)" : "none" }} />
            </button>

            {/* Desktop nav */}
            <div className="desktop-only" style={{ display: "flex", gap: "8px" }}>
              <NavLink href="/catalog">Каталог</NavLink>
              <NavLink href="/about">Бренд</NavLink>
            </div>
          </div>

          {/* Logo */}
          <Link
            href="/"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "28px",
              fontWeight: 500,
              letterSpacing: ".42em",
              color: "var(--ink)",
              lineHeight: 1,
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            TAL
            <em style={{ color: "var(--gold-deep)", fontWeight: 400, letterSpacing: 0, fontStyle: "italic" }}>I</em>
            RA
          </Link>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div className="desktop-only" style={{ display: "flex", gap: "8px" }}>
              <NavLink href="/delivery">Доставка</NavLink>
              <NavLink href="/contacts">Контакти</NavLink>
            </div>
            <button
              style={{
                background: "transparent",
                border: "none",
                color: "var(--ink-soft)",
                width: "42px",
                height: "42px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu drawer */}
      {menuOpen && (
        <div
          className="mobile-only"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--bg)",
            zIndex: 99,
            padding: "80px 24px 40px",
            overflowY: "auto",
          }}
        >
          <nav style={{ display: "flex", flexDirection: "column", gap: "0" }}>
            <MobileNavLink href="/catalog" onClick={() => setMenuOpen(false)}>Каталог</MobileNavLink>
            <MobileNavLink href="/about" onClick={() => setMenuOpen(false)}>Про бренд</MobileNavLink>
            <MobileNavLink href="/delivery" onClick={() => setMenuOpen(false)}>Доставка та оплата</MobileNavLink>
            <MobileNavLink href="/contacts" onClick={() => setMenuOpen(false)}>Контакти</MobileNavLink>
          </nav>

          <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--line-soft)" }}>
            <p style={{ fontSize: "12px", color: "var(--text-dim)", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: "16px" }}>
              Контакти
            </p>
            <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "8px" }}>+380 XX XXX XX XX</p>
            <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "8px" }}>hello@talira.com.ua</p>
            <p style={{ fontSize: "14px", color: "var(--text)" }}>@talira.com.ua</p>
          </div>
        </div>
      )}
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      style={{
        color: "var(--ink-soft)",
        fontSize: "11px",
        letterSpacing: ".22em",
        textTransform: "uppercase",
        fontWeight: 500,
        padding: "8px 14px",
        transition: "color .25s",
      }}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: "28px",
        fontWeight: 400,
        padding: "20px 0",
        borderBottom: "1px solid var(--line-soft)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "var(--ink)",
      }}
    >
      {children}
      <span style={{ color: "var(--gold-deep)", fontSize: "18px" }}>→</span>
    </Link>
  );
}
