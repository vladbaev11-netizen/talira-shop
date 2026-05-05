"use client";

import { useState, useEffect, useRef } from "react";
import { trackEvent } from "@/components/FacebookPixel";
import { useCart } from "@/components/CartContext";

interface City { ref: string; name: string; }
interface Warehouse { ref: string; name: string; number: string; }

interface CheckoutFormProps {
  onSuccess: (orderNumber: string) => void;
}

export default function CheckoutForm({ onSuccess }: CheckoutFormProps) {
  const { items, totalPrice, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payment, setPayment] = useState<"cod" | "card">("cod");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCities, setShowCities] = useState(false);
  const cityTimeout = useRef<any>(null);

  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [showWarehouses, setShowWarehouses] = useState(false);
  const warehouseTimeout = useRef<any>(null);

  useEffect(() => {
    if (cityQuery.length < 2 || selectedCity) return;
    clearTimeout(cityTimeout.current);
    cityTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/novaposhta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "searchCity", query: cityQuery }),
        });
        const data = await res.json();
        setCities(data.cities || []);
        setShowCities(true);
      } catch { setCities([]); }
    }, 300);
  }, [cityQuery, selectedCity]);

  useEffect(() => {
    if (!selectedCity) return;
    clearTimeout(warehouseTimeout.current);
    warehouseTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/novaposhta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getWarehouses", cityRef: selectedCity.ref, query: warehouseQuery }),
        });
        const data = await res.json();
        setWarehouses(data.warehouses || []);
        if (warehouseQuery.length > 0) setShowWarehouses(true);
      } catch { setWarehouses([]); }
    }, 300);
  }, [selectedCity, warehouseQuery]);

  useEffect(() => {
    if (!selectedCity) return;
    (async () => {
      try {
        const res = await fetch("/api/novaposhta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "getWarehouses", cityRef: selectedCity.ref, query: "" }),
        });
        const data = await res.json();
        setWarehouses(data.warehouses || []);
      } catch { setWarehouses([]); }
    })();
  }, [selectedCity]);

  function selectCity(city: City) {
    setSelectedCity(city);
    setCityQuery(city.name);
    setShowCities(false);
    setSelectedWarehouse(null);
    setWarehouseQuery("");
  }

  function selectWarehouse(wh: Warehouse) {
    setSelectedWarehouse(wh);
    setWarehouseQuery(wh.name);
    setShowWarehouses(false);
  }

  async function handleSubmit() {
    if (!name.trim() || !phone.trim()) {
      alert("Будь ласка, заповніть ім'я та телефон");
      return;
    }
    if (!selectedCity || !selectedWarehouse) {
      alert("Оберіть місто та відділення Нової Пошти");
      return;
    }

    setStatus("sending");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: selectedCity.name,
          warehouse: selectedWarehouse.name,
          payment,
          comment: comment.trim(),
          items: items.map(i => ({ name: i.name, price: i.price, quantity: i.quantity })),
          total: totalPrice,
        }),
      });

      if (res.ok) {
        trackEvent("Purchase", {
          content_name: items.map(i => i.name).join(", "),
          value: totalPrice,
          currency: "UAH",
          num_items: items.reduce((s, i) => s + i.quantity, 0),
        });
        const num = "T-" + Date.now().toString().slice(-6);
        clearCart();
        onSuccess(num);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--bg-card)", border: "1px solid var(--line)", color: "var(--ink)",
    padding: "16px 18px", fontFamily: "'Inter', sans-serif", fontSize: "15px", outline: "none", borderRadius: "6px",
  };
  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "10px", letterSpacing: ".22em", textTransform: "uppercase",
    color: "var(--text)", marginBottom: "8px", fontWeight: 500,
  };
  const dropdownStyle: React.CSSProperties = {
    position: "absolute", top: "100%", left: 0, right: 0, background: "var(--bg-card)",
    border: "1px solid var(--line)", borderTop: "none", maxHeight: "200px", overflowY: "auto",
    zIndex: 50, boxShadow: "0 8px 24px -8px rgba(26,22,18,.15)",
  };
  const itemStyle: React.CSSProperties = {
    padding: "12px 18px", fontSize: "14px", color: "var(--ink)", cursor: "pointer", borderBottom: "1px solid var(--line-soft)",
  };

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "12px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 600, marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>{"Контактні дані"}</h3>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>{"Ваше ім\u0027я *"}</label>
          <input type="text" placeholder="Введіть ім'я" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={labelStyle}>{"Телефон *"}</label>
          <input type="tel" placeholder="+380 ___ ___ __ __" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "12px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 600, marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>{"Доставка — Нова Пошта"}</h3>

        <div style={{ marginBottom: "16px", position: "relative" }}>
          <label style={labelStyle}>{"Місто *"}</label>
          <input type="text" placeholder="Почніть вводити назву міста..." value={cityQuery}
            onChange={(e) => { setCityQuery(e.target.value); setSelectedCity(null); setSelectedWarehouse(null); setWarehouseQuery(""); }}
            onFocus={() => { if (cities.length > 0 && !selectedCity) setShowCities(true); }}
            onBlur={() => setTimeout(() => setShowCities(false), 200)}
            style={inputStyle} />
          {showCities && cities.length > 0 && (
            <div style={dropdownStyle}>
              {cities.map((c) => (
                <div key={c.ref} onClick={() => selectCity(c)} style={itemStyle}>{c.name}</div>
              ))}
            </div>
          )}
        </div>

        <div style={{ position: "relative" }}>
          <label style={labelStyle}>{"Відділення Нової Пошти *"}</label>
          <input type="text" placeholder={selectedCity ? "Введіть номер або назву відділення..." : "Спочатку оберіть місто"}
            value={warehouseQuery} onChange={(e) => { setWarehouseQuery(e.target.value); setSelectedWarehouse(null); }}
            onFocus={() => { if (warehouses.length > 0 && !selectedWarehouse) setShowWarehouses(true); }}
            onBlur={() => setTimeout(() => setShowWarehouses(false), 200)}
            disabled={!selectedCity}
            style={{ ...inputStyle, opacity: selectedCity ? 1 : 0.5, cursor: selectedCity ? "text" : "not-allowed" }} />
          {showWarehouses && warehouses.length > 0 && (
            <div style={dropdownStyle}>
              {warehouses.filter((wh) => warehouseQuery ? wh.name.toLowerCase().includes(warehouseQuery.toLowerCase()) || wh.number.includes(warehouseQuery) : true).slice(0, 15).map((wh) => (
                <div key={wh.ref} onClick={() => selectWarehouse(wh)} style={itemStyle}>{wh.name}</div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <h3 style={{ fontSize: "12px", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 600, marginBottom: "16px", fontFamily: "'Inter', sans-serif" }}>{"Спосіб оплати"}</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <label onClick={() => setPayment("cod")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", border: payment === "cod" ? "2px solid var(--gold-deep)" : "1px solid var(--line)", borderRadius: "8px", cursor: "pointer", background: payment === "cod" ? "rgba(160,125,61,.05)" : "transparent" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid " + (payment === "cod" ? "var(--gold-deep)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {payment === "cod" && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--gold-deep)" }} />}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{"📦 Накладений платіж"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{"Оплата при отриманні на пошті"}</div>
            </div>
          </label>
          <label onClick={() => setPayment("card")} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px", border: payment === "card" ? "2px solid var(--gold-deep)" : "1px solid var(--line)", borderRadius: "8px", cursor: "pointer", background: payment === "card" ? "rgba(160,125,61,.05)" : "transparent" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid " + (payment === "card" ? "var(--gold-deep)" : "var(--line)"), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {payment === "card" && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "var(--gold-deep)" }} />}
            </div>
            <div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--ink)" }}>{"💳 Оплата на картку"}</div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>{"Переказ перед відправкою"}</div>
            </div>
          </label>
        </div>
      </div>

      <div style={{ marginBottom: "32px" }}>
        <textarea placeholder="Коментар до замовлення (необов'язково)" value={comment} onChange={(e) => setComment(e.target.value)}
          style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} />
      </div>

      <button onClick={handleSubmit} disabled={status === "sending"}
        style={{ width: "100%", background: status === "sending" ? "var(--text-dim)" : "var(--gold-deep)", color: "#fff", padding: "20px", fontSize: "14px", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", border: "none", cursor: status === "sending" ? "wait" : "pointer", borderRadius: "6px", fontFamily: "'Inter', sans-serif" }}>
        {status === "sending" ? "Оформлюємо..." : "Підтвердити замовлення"}
      </button>

      {status === "error" && (
        <p style={{ color: "#c0392b", fontSize: "13px", textAlign: "center", marginTop: "16px" }}>
          {"Помилка при відправці. Спробуйте ще раз або зателефонуйте нам."}
        </p>
      )}
    </div>
  );
}
