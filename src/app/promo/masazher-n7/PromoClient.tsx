"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { useCart } from "@/components/CartContext";

const builder = imageUrlBuilder({ projectId: "777maat6", dataset: "production" });
function imgUrl(source: any) { return builder.image(source); }

interface PromoProps {
  product: {
    name: string;
    slug: { current: string };
    price: number;
    oldPrice?: number;
    mainImage: any;
    gallery?: any[];
    shortDescription?: string;
    benefits?: string[];
    specs?: { label: string; value: string }[];
    reviews?: { name: string; city?: string; rating?: number; text: string }[];
  };
}

export default function PromoClient({ product }: PromoProps) {
  const { addItem } = useCart();
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  const allImages = [product.mainImage, ...(product.gallery || [])].filter((img) => img && img.asset);
  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;
  const mainImageUrl = allImages[0] ? imgUrl(allImages[0]).width(800).height(800).url() : "";

  useEffect(() => {
    function calc() {
      const now = new Date();
      const end = new Date(now);
      end.setHours(23, 59, 59, 999);
      const diff = end.getTime() - now.getTime();
      return {
        hours: Math.floor(diff / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    }
    setTimeLeft(calc());
    const i = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(i);
  }, []);

  function handleAddToCart() {
    addItem({
      slug: product.slug.current,
      name: product.name,
      price: product.price,
      oldPrice: product.oldPrice,
      image: mainImageUrl,
    });
  }

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div>
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.03); } }
        .promo-fade { animation: fadeUp .8s ease both; }
        .promo-fade-2 { animation: fadeUp .8s ease .2s both; }
        .promo-fade-3 { animation: fadeUp .8s ease .4s both; }
        .promo-cta-pulse { animation: pulse 2s ease infinite; }
      `}</style>

      {/* ========== HERO ========== */}
      <section style={{ background: "linear-gradient(135deg, #1a1612 0%, #2a2218 50%, #1a1612 100%)", color: "var(--bg)", padding: "60px 0 80px", position: "relative", overflow: "hidden" }}>
        {/* Radial glow */}
        <div style={{ position: "absolute", top: "-200px", right: "-200px", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(160,125,61,.15) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          {/* Left — text */}
          <div>
            <div className="promo-fade" style={{ display: "inline-block", padding: "8px 20px", border: "1px solid var(--gold-deep)", fontSize: "10px", letterSpacing: ".3em", textTransform: "uppercase", color: "var(--gold-soft)", marginBottom: "24px" }}>
              {"🔥 Акція — тільки сьогодні"}
            </div>

            <h1 className="promo-fade" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)", lineHeight: "1.05", fontWeight: 400, marginBottom: "24px" }}>
              {"Забудьте про біль у шиї та спині за "}
              <em style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>{"15 хвилин"}</em>
            </h1>

            <p className="promo-fade-2" style={{ fontSize: "16px", color: "rgba(245,241,232,.75)", lineHeight: "1.7", marginBottom: "32px", maxWidth: "480px" }}>
              {"Бездротовий масажер N7 з інфрачервоним підігрівом глибоко розминає м\u0027язи, покращує кровообіг та знімає напруження — вдома, в офісі чи в дорозі."}
            </p>

            {/* Price block */}
            <div className="promo-fade-2" style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "20px", flexWrap: "wrap" }}>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontWeight: 600, color: "var(--bg)" }}>
                {product.price.toLocaleString("uk-UA")} <span style={{ fontSize: "24px", color: "var(--gold-soft)" }}>{"₴"}</span>
              </span>
              {product.oldPrice && (
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", color: "rgba(245,241,232,.4)", textDecoration: "line-through" }}>
                  {product.oldPrice.toLocaleString("uk-UA")} {"₴"}
                </span>
              )}
              {discount > 0 && (
                <span style={{ background: "#d4380d", color: "#fff", padding: "6px 16px", fontSize: "14px", fontWeight: 700, borderRadius: "4px" }}>
                  {"-"}{discount}{"%"}
                </span>
              )}
            </div>

            {/* Timer */}
            <div className="promo-fade-3" style={{ display: "inline-flex", alignItems: "center", gap: "14px", padding: "14px 24px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "8px", marginBottom: "32px" }}>
              <span style={{ fontSize: "11px", color: "var(--gold-soft)", letterSpacing: ".12em", textTransform: "uppercase" }}>{"Закінчується:"}</span>
              <div style={{ display: "flex", gap: "6px", fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500 }}>
                <span style={{ background: "rgba(255,255,255,.1)", padding: "4px 10px", borderRadius: "4px" }}>{pad(timeLeft.hours)}</span>
                <span style={{ color: "var(--gold-soft)" }}>{":"}</span>
                <span style={{ background: "rgba(255,255,255,.1)", padding: "4px 10px", borderRadius: "4px" }}>{pad(timeLeft.minutes)}</span>
                <span style={{ color: "var(--gold-soft)" }}>{":"}</span>
                <span style={{ background: "rgba(255,255,255,.1)", padding: "4px 10px", borderRadius: "4px" }}>{pad(timeLeft.seconds)}</span>
              </div>
            </div>

            <div className="promo-fade-3">
              <button onClick={handleAddToCart} className="promo-cta-pulse"
                style={{ background: "var(--gold-deep)", color: "#fff", border: "none", padding: "20px 48px", fontSize: "14px", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", borderRadius: "6px", fontFamily: "'Inter', sans-serif", display: "inline-flex", alignItems: "center", gap: "14px" }}>
                {"Замовити зараз"}
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </button>
              <div style={{ display: "flex", gap: "20px", marginTop: "16px" }}>
                <MiniCheck text="Безкоштовна доставка" />
                <MiniCheck text="Оплата при отриманні" />
              </div>
            </div>
          </div>

          {/* Right — image */}
          <div className="promo-fade" style={{ position: "relative" }}>
            <div style={{ position: "absolute", inset: "-20px", borderRadius: "50%", background: "radial-gradient(circle, rgba(160,125,61,.2) 0%, transparent 70%)", pointerEvents: "none" }} />
            {mainImageUrl && (
              <Image src={mainImageUrl} alt={product.name} width={600} height={600} style={{ width: "100%", height: "auto", position: "relative", zIndex: 1 }} priority />
            )}
          </div>
        </div>
      </section>

      {/* ========== PROBLEM / SOLUTION ========== */}
      <section style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 400, marginBottom: "20px" }}>
            {"Біль у шиї та спині — "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"знайоме?"}</em>
          </h2>
          <p style={{ fontSize: "16px", color: "var(--text)", lineHeight: "1.8", marginBottom: "48px", maxWidth: "640px", margin: "0 auto 48px" }}>
            {"Сидяча робота, стрес, постійний телефон — все це створює напругу в м\u0027язах. Масажер N7 вирішує проблему за 15 хвилин на день, не виходячи з дому."}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" }}>
            <ProblemCard icon="😣" before="Біль та скутість" after="Глибоке розслаблення" />
            <ProblemCard icon="🧊" before="Холодні м'язи" after="Інфрачервоний підігрів" />
            <ProblemCard icon="💸" before="Дорогі масажисти" after="Масаж вдома щодня" />
          </div>
        </div>
      </section>

      {/* ========== FEATURES ========== */}
      <section style={{ padding: "80px 0", background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container-pad" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 400, textAlign: "center", marginBottom: "48px" }}>
            {"Чому саме "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"N7?"}</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" }}>
            <FeatureCard icon="🔥" title="Підігрів" desc="Інфрачервоне прогрівання для глибокого розслаблення" />
            <FeatureCard icon="⚡" title="10 режимів" desc="Від легкого до інтенсивного — підберіть свій" />
            <FeatureCard icon="🔋" title="Бездротовий" desc="Вбудований акумулятор, зарядка через USB" />
            <FeatureCard icon="🎯" title="5 зон тіла" desc="Шия, плечі, спина, руки, ноги" />
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 400, textAlign: "center", marginBottom: "48px" }}>
            {"Як це "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"працює"}</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "40px", textAlign: "center" }}>
            <StepCard num="01" title="Оберіть зону" desc="Шия, плечі, спина — масажер адаптується" />
            <StepCard num="02" title="Увімкніть режим" desc="10 режимів інтенсивності + підігрів" />
            <StepCard num="03" title="Насолоджуйтесь" desc="15 хвилин — і напруга зникає" />
          </div>
        </div>
      </section>

      {/* ========== GALLERY ========== */}
      {allImages.length > 1 && (
        <section style={{ padding: "60px 0", background: "var(--bg-soft)" }}>
          <div className="container-pad" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {allImages.slice(0, 4).map((img: any, i: number) => (
                <div key={i} style={{ aspectRatio: "1", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                  <Image src={imgUrl(img).width(400).height(400).url()} alt={product.name + " " + (i + 1)} fill style={{ objectFit: "cover" }} sizes="25vw" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== REVIEWS ========== */}
      {product.reviews && product.reviews.length > 0 && (
        <section style={{ padding: "80px 0", background: "var(--bg)" }}>
          <div className="container-pad" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(28px, 4vw, 36px)", fontWeight: 400, textAlign: "center", marginBottom: "48px" }}>
              {"Що кажуть "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"клієнти"}</em>
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(" + Math.min(product.reviews.length, 3) + ", 1fr)", gap: "24px" }}>
              {product.reviews.map((r, i) => (
                <div key={i} style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "12px", padding: "32px" }}>
                  <div style={{ display: "flex", gap: "3px", marginBottom: "16px" }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="18" height="18" viewBox="0 0 24 24" fill={s <= (r.rating || 5) ? "var(--gold-deep)" : "var(--line)"} stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "18px", lineHeight: "1.5", marginBottom: "20px", color: "var(--ink)" }}>
                    {"\u201C"}{r.text}{"\u201D"}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-deep), var(--gold-soft))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600 }}>
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{r.name}</div>
                      {r.city && <div style={{ fontSize: "11px", color: "var(--text-dim)" }}>{r.city}</div>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== SPECS ========== */}
      {product.specs && product.specs.length > 0 && (
        <section style={{ padding: "60px 0", background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
          <div className="container-pad" style={{ maxWidth: "700px", margin: "0 auto", padding: "0 48px" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400, textAlign: "center", marginBottom: "32px" }}>{"Характеристики"}</h3>
            <div style={{ background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "8px", overflow: "hidden" }}>
              {product.specs.map((s, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "14px 24px", background: i % 2 === 0 ? "var(--bg-card)" : "var(--paper)", fontSize: "14px" }}>
                  <span style={{ color: "var(--text)" }}>{s.label}</span>
                  <span style={{ color: "var(--ink)", fontWeight: 600 }}>{s.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ========== FINAL CTA ========== */}
      <section style={{ padding: "80px 0", background: "var(--ink)", color: "var(--bg)", textAlign: "center" }}>
        <div className="container-pad" style={{ maxWidth: "700px", margin: "0 auto", padding: "0 48px" }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, marginBottom: "20px" }}>
            {"Замовте N7 "}<em style={{ color: "var(--gold-soft)", fontStyle: "italic" }}>{"зараз"}</em>
          </h2>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "44px", fontWeight: 600 }}>
              {product.price.toLocaleString("uk-UA")} {"₴"}
            </span>
            {product.oldPrice && (
              <span style={{ fontSize: "22px", color: "rgba(245,241,232,.4)", textDecoration: "line-through" }}>
                {product.oldPrice.toLocaleString("uk-UA")} {"₴"}
              </span>
            )}
          </div>

          {/* Timer */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: "14px", padding: "14px 24px", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.1)", borderRadius: "8px", marginBottom: "24px" }}>
            <span style={{ fontSize: "11px", color: "var(--gold-soft)", letterSpacing: ".12em", textTransform: "uppercase" }}>{"Акція до:"}</span>
            <div style={{ display: "flex", gap: "6px", fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500 }}>
              <span style={{ background: "rgba(255,255,255,.1)", padding: "4px 10px", borderRadius: "4px" }}>{pad(timeLeft.hours)}</span>
              <span style={{ color: "var(--gold-soft)" }}>{":"}</span>
              <span style={{ background: "rgba(255,255,255,.1)", padding: "4px 10px", borderRadius: "4px" }}>{pad(timeLeft.minutes)}</span>
              <span style={{ color: "var(--gold-soft)" }}>{":"}</span>
              <span style={{ background: "rgba(255,255,255,.1)", padding: "4px 10px", borderRadius: "4px" }}>{pad(timeLeft.seconds)}</span>
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <button onClick={handleAddToCart} className="promo-cta-pulse"
              style={{ background: "var(--gold-deep)", color: "#fff", border: "none", padding: "20px 56px", fontSize: "14px", fontWeight: 600, letterSpacing: ".2em", textTransform: "uppercase", cursor: "pointer", borderRadius: "6px", fontFamily: "'Inter', sans-serif", display: "inline-flex", alignItems: "center", gap: "14px" }}>
              {"Замовити зараз"}
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </button>
          </div>

          <div style={{ display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
            <MiniCheckDark text="Безкоштовна доставка" />
            <MiniCheckDark text="Оплата при отриманні" />
            <MiniCheckDark text="Гарантія 14 днів" />
          </div>
        </div>
      </section>
    </div>
  );
}

function MiniCheck({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(245,241,232,.65)" }}>
      <svg width="14" height="14" fill="none" stroke="var(--gold-soft)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
      {text}
    </div>
  );
}

function MiniCheckDark({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "rgba(245,241,232,.6)" }}>
      <svg width="14" height="14" fill="none" stroke="var(--gold-soft)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
      {text}
    </div>
  );
}

function ProblemCard({ icon, before, after }: { icon: string; before: string; after: string }) {
  return (
    <div style={{ padding: "32px 24px", background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "12px" }}>
      <div style={{ fontSize: "36px", marginBottom: "16px" }}>{icon}</div>
      <div style={{ fontSize: "13px", color: "var(--text-dim)", textDecoration: "line-through", marginBottom: "8px" }}>{before}</div>
      <div style={{ fontSize: "15px", color: "var(--gold-deep)", fontWeight: 600 }}>{after}</div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div style={{ textAlign: "center", padding: "32px 16px", background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "12px" }}>
      <div style={{ fontSize: "32px", marginBottom: "14px" }}>{icon}</div>
      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, marginBottom: "8px", color: "var(--ink)" }}>{title}</h4>
      <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: "1.5" }}>{desc}</p>
    </div>
  );
}

function StepCard({ num, title, desc }: { num: string; title: string; desc: string }) {
  return (
    <div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontStyle: "italic", color: "var(--gold-deep)", fontWeight: 300, lineHeight: 1, marginBottom: "16px" }}>{num}</div>
      <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 500, marginBottom: "8px" }}>{title}</h4>
      <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.6" }}>{desc}</p>
    </div>
  );
}
