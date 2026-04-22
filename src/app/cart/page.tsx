"use client";

import { useCart } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderForm from "@/components/OrderForm";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, totalItems, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <>
        <Header />
        <div className="container-pad" style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 48px", textAlign: "center" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🛒</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 400, marginBottom: "16px" }}>
            Кошик <em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>порожній</em>
          </h1>
          <p style={{ color: "var(--text)", fontSize: "15px", marginBottom: "32px" }}>
            Додайте товари з каталогу, щоб оформити замовлення
          </p>
          <Link href="/catalog" style={{ background: "var(--ink)", color: "var(--bg)", padding: "16px 36px", fontSize: "11px", fontWeight: 500, letterSpacing: ".22em", textTransform: "uppercase", display: "inline-flex", alignItems: "center", gap: "10px", borderRadius: "4px" }}>
            Перейти до каталогу
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const allProductNames = items.map((i) => i.name).join(", ");

  return (
    <>
      <Header />

      <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "20px 48px", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)" }}>
        <Link href="/" style={{ color: "var(--text)" }}>Головна</Link>
        <span style={{ margin: "0 12px" }}>/</span>
        <span style={{ color: "var(--ink)" }}>Кошик</span>
      </div>

      <section style={{ padding: "20px 0 80px" }}>
        <div className="container-pad grid-specs" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px", alignItems: "start" }}>

          {/* Cart items */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 400 }}>
                Кошик <span style={{ fontSize: "18px", color: "var(--text-dim)", fontStyle: "italic" }}>({totalItems})</span>
              </h1>
              <button onClick={clearCart} style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: "12px", cursor: "pointer", textDecoration: "underline" }}>
                Очистити
              </button>
            </div>

            {items.map((item) => (
              <div key={item.slug} style={{ display: "flex", gap: "16px", padding: "20px 0", borderBottom: "1px solid var(--line-soft)", alignItems: "center" }}>
                {/* Image */}
                <Link href={"/product/" + item.slug} style={{ width: "100px", height: "100px", background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "4px", overflow: "hidden", flexShrink: 0, position: "relative", display: "block" }}>
                  {item.image && (
                    <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  )}
                </Link>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Link href={"/product/" + item.slug} style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500, color: "var(--ink)", display: "block", marginBottom: "4px" }}>
                    {item.name}
                  </Link>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 500 }}>
                      {item.price.toLocaleString("uk-UA")} ₴
                    </span>
                    {item.oldPrice && (
                      <span style={{ fontSize: "13px", color: "var(--text-dim)", textDecoration: "line-through" }}>
                        {item.oldPrice.toLocaleString("uk-UA")} ₴
                      </span>
                    )}
                  </div>

                  {/* Quantity */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <button onClick={() => updateQuantity(item.slug, item.quantity - 1)} style={{ width: "32px", height: "32px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "4px 0 0 4px" }}>−</button>
                      <div style={{ width: "36px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontSize: "14px", fontWeight: 500 }}>{item.quantity}</div>
                      <button onClick={() => updateQuantity(item.slug, item.quantity + 1)} style={{ width: "32px", height: "32px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "0 4px 4px 0" }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.slug)} style={{ background: "none", border: "none", color: "var(--text-dim)", fontSize: "12px", cursor: "pointer" }}>
                      Видалити
                    </button>
                  </div>
                </div>

                {/* Line total */}
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, color: "var(--ink)", whiteSpace: "nowrap" }}>
                  {(item.price * item.quantity).toLocaleString("uk-UA")} ₴
                </div>
              </div>
            ))}

            {/* Total */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "24px 0", borderBottom: "1px solid var(--line)" }}>
              <span style={{ fontSize: "14px", color: "var(--text)", fontWeight: 500 }}>Разом:</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 600, color: "var(--ink)" }}>
                {totalPrice.toLocaleString("uk-UA")} ₴
              </span>
            </div>

            <div style={{ display: "flex", gap: "24px", padding: "20px 0", flexWrap: "wrap" }}>
              <TrustMini text="Оплата при отриманні" />
              <TrustMini text="Доставка 1–3 дні" />
              <TrustMini text="Гарантія 14 днів" />
            </div>
          </div>

          {/* Order form */}
          <div style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "8px", padding: "32px", position: "sticky", top: "100px" }}>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, marginBottom: "24px" }}>
              Оформлення замовлення
            </h2>
            <OrderForm productName={allProductNames} productPrice={totalPrice} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

function TrustMini({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--text)" }}>
      <svg width="14" height="14" fill="none" stroke="var(--gold-deep)" strokeWidth="2" viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
      {text}
    </div>
  );
}
