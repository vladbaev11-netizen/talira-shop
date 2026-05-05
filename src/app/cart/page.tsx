"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutForm from "@/components/CheckoutForm";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "checkout" | "success">("cart");
  const [orderNumber, setOrderNumber] = useState("");

  if (items.length === 0 && step !== "success") {
    return (
      <>
        <Header />
        <div className="container-pad" style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>{"🛒"}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 400, marginBottom: "16px" }}>
            {"Кошик "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"порожній"}</em>
          </h1>
          <p style={{ color: "var(--text)", fontSize: "15px", marginBottom: "32px" }}>{"Додайте товари з каталогу, щоб оформити замовлення"}</p>
          <Link href="/catalog" style={{ background: "var(--ink)", color: "var(--bg)", padding: "16px 36px", fontSize: "11px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "10px", borderRadius: "4px" }}>
            {"Перейти до каталогу"}
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (step === "success") {
    return (
      <>
        <Header />
        <div className="container-pad" style={{ maxWidth: "700px", margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
          <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "var(--gold-deep)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
            <svg width="36" height="36" fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 400, marginBottom: "12px" }}>
            {"Замовлення "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"прийнято!"}</em>
          </h1>
          <p style={{ color: "var(--text)", fontSize: "16px", marginBottom: "8px" }}>{"Замовлення №"}{orderNumber}</p>
          <p style={{ color: "var(--text)", fontSize: "15px", lineHeight: "1.7", marginBottom: "32px" }}>
            {"Ми зв\u0027яжемося з вами протягом 15-30 хвилин для підтвердження."}
          </p>
          <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/catalog" style={{ background: "var(--ink)", color: "var(--bg)", padding: "16px 28px", fontSize: "11px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", borderRadius: "4px" }}>{"Продовжити покупки"}</Link>
            <Link href="/" style={{ border: "1px solid var(--ink)", color: "var(--ink)", padding: "16px 28px", fontSize: "11px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", borderRadius: "4px" }}>{"На головну"}</Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "20px 48px", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)" }}>
        <Link href="/" style={{ color: "var(--text)" }}>{"Головна"}</Link>
        <span style={{ margin: "0 12px" }}>/</span>
        <span style={{ color: "var(--ink)" }}>{step === "cart" ? "Кошик" : "Оформлення"}</span>
      </div>

      <section style={{ padding: "20px 0 80px" }}>
        <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "40px" }}>
            <StepIndicator num="1" label="Кошик" active={step === "cart"} done={step === "checkout"} onClick={() => setStep("cart")} />
            <StepIndicator num="2" label="Оформлення" active={step === "checkout"} done={false} />
          </div>

          {step === "cart" ? (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400 }}>
                  {"Кошик "}<span style={{ fontSize: "18px", color: "var(--text-dim)", fontStyle: "italic" }}>({totalItems})</span>
                </h1>
                <button onClick={clearCart} style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>{"Очистити"}</button>
              </div>

              {items.map((item) => (
                <div key={item.slug} style={{ display: "flex", gap: "16px", padding: "20px 0", borderBottom: "1px solid var(--line-soft)", alignItems: "center", flexWrap: "wrap" }}>
                  <Link href={"/product/" + item.slug} style={{ width: "100px", height: "100px", background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "4px", overflow: "hidden", flexShrink: 0, display: "block" }}>
                    {item.image && <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </Link>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <Link href={"/product/" + item.slug} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500, color: "var(--ink)", display: "block", marginBottom: "4px" }}>{item.name}</Link>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500 }}>{item.price.toLocaleString("uk-UA")} {"₴"}</span>
                      {item.oldPrice && <span style={{ fontSize: "13px", color: "var(--text-dim)", textDecoration: "line-through" }}>{item.oldPrice.toLocaleString("uk-UA")} {"₴"}</span>}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ display: "flex" }}>
                        <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} style={{ width: "32px", height: "32px", background: "transparent", border: "1px solid var(--line)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px", color: "var(--ink)" }}>{"−"}</button>
                        <div style={{ width: "36px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontSize: "14px", fontWeight: 500 }}>{item.quantity}</div>
                        <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} style={{ width: "32px", height: "32px", background: "transparent", border: "1px solid var(--line)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0", color: "var(--ink)" }}>{"+"}</button>
                      </div>
                      <button onClick={() => removeItem(item.slug)} style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: "12px", cursor: "pointer" }}>{"Видалити"}</button>
                    </div>
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap" }}>
                    {(item.price * item.quantity).toLocaleString("uk-UA")} {"₴"}
                  </div>
                </div>
              ))}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px 0", borderBottom: "1px solid var(--line)", flexWrap: "wrap", gap: "16px" }}>
                <span style={{ fontSize: "14px", color: "var(--text)", fontWeight: 500 }}>{"Разом:"}</span>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 600, color: "var(--ink)" }}>
                  {totalPrice.toLocaleString("uk-UA")} {"₴"}
                </span>
              </div>

              <div style={{ display: "flex", gap: "16px", marginTop: "24px", flexWrap: "wrap" }}>
                <button onClick={() => setStep("checkout")} style={{ background: "var(--ink)", color: "var(--bg)", padding: "18px 48px", fontSize: "13px", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", border: "none", cursor: "pointer", borderRadius: "4px", fontFamily: "'Inter', sans-serif" }}>
                  {"Оформити замовлення"}
                </button>
                <Link href="/catalog" style={{ border: "1px solid var(--line)", color: "var(--ink)", padding: "18px 28px", fontSize: "11px", fontWeight: 500, letterSpacing: ".18em", textTransform: "uppercase", borderRadius: "4px", display: "inline-flex", alignItems: "center" }}>
                  {"Продовжити покупки"}
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "40px", alignItems: "start" }} className="grid-checkout">
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400, marginBottom: "32px" }}>
                  {"Оформлення "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"замовлення"}</em>
                </h1>
                <CheckoutForm onSuccess={(num) => { setOrderNumber(num); setStep("success"); }} />
              </div>

              <div style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "8px", padding: "28px", position: "sticky", top: "100px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontWeight: 400, marginBottom: "20px" }}>{"Ваше замовлення"}</h3>
                {items.map((item) => (
                  <div key={item.slug} style={{ display: "flex", gap: "12px", padding: "12px 0", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
                    <div style={{ width: "50px", height: "50px", background: "var(--bg-card)", borderRadius: "4px", overflow: "hidden", flexShrink: 0 }}>
                      {item.image && <img src={item.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: "13px", color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                      <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{item.quantity} {"×"} {item.price.toLocaleString("uk-UA")} {"₴"}</div>
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap" }}>{(item.price * item.quantity).toLocaleString("uk-UA")} {"₴"}</div>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 0 0", marginTop: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 500 }}>{"Разом:"}</span>
                  <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "26px", fontWeight: 600, color: "var(--gold-deep)" }}>{totalPrice.toLocaleString("uk-UA")} {"₴"}</span>
                </div>
                <div style={{ fontSize: "12px", color: "var(--text-dim)", marginTop: "12px", lineHeight: "1.5" }}>
                  {"Доставка Новою Поштою. Вартість доставки згідно тарифів НП."}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
}

function StepIndicator({ num, label, active, done, onClick }: { num: string; label: string; active: boolean; done: boolean; onClick?: () => void }) {
  return (
    <div onClick={done ? onClick : undefined} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: done ? "pointer" : "default", opacity: active || done ? 1 : 0.4 }}>
      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: active ? "var(--gold-deep)" : done ? "var(--ink)" : "var(--line)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 600 }}>
        {done ? "✓" : num}
      </div>
      <span style={{ fontSize: "12px", fontWeight: active ? 600 : 400, letterSpacing: ".12em", textTransform: "uppercase", color: active ? "var(--ink)" : "var(--text-dim)" }}>{label}</span>
    </div>
  );
}
