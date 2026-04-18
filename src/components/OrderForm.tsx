"use client";

import { useState, useEffect, useRef } from "react";
import { trackEvent } from "@/components/FacebookPixel";

interface OrderFormProps {
  productName: string;
  productPrice: number;
}

interface City {
  ref: string;
  name: string;
}

interface Warehouse {
  ref: string;
  name: string;
  number: string;
}

export default function OrderForm({ productName, productPrice }: OrderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  // NP city search
  const [cityQuery, setCityQuery] = useState("");
  const [cities, setCities] = useState<City[]>([]);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);
  const [showCities, setShowCities] = useState(false);
  const cityTimeout = useRef<any>(null);

  // NP warehouse search
  const [warehouseQuery, setWarehouseQuery] = useState("");
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);
  const [showWarehouses, setShowWarehouses] = useState(false);
  const warehouseTimeout = useRef<any>(null);

  const total = productPrice * quantity;

  // Search cities
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
      } catch {
        setCities([]);
      }
    }, 300);
  }, [cityQuery, selectedCity]);

  // Search warehouses
  useEffect(() => {
    if (!selectedCity) return;
    clearTimeout(warehouseTimeout.current);
    warehouseTimeout.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/novaposhta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getWarehouses",
            cityRef: selectedCity.ref,
            query: warehouseQuery,
          }),
        });
        const data = await res.json();
        setWarehouses(data.warehouses || []);
        if (warehouseQuery.length > 0) setShowWarehouses(true);
      } catch {
        setWarehouses([]);
      }
    }, 300);
  }, [selectedCity, warehouseQuery]);

  // Load warehouses when city selected
  useEffect(() => {
    if (!selectedCity) return;
    (async () => {
      try {
        const res = await fetch("/api/novaposhta", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "getWarehouses",
            cityRef: selectedCity.ref,
            query: "",
          }),
        });
        const data = await res.json();
        setWarehouses(data.warehouses || []);
      } catch {
        setWarehouses([]);
      }
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

    const cityText = selectedCity ? selectedCity.name : cityQuery;
    const warehouseText = selectedWarehouse ? selectedWarehouse.name : warehouseQuery;

    setStatus("sending");

    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          city: cityText + (warehouseText ? ", " + warehouseText : ""),
          product: productName,
          price: productPrice,
          quantity,
        }),
      });

      if (res.ok) {
        setStatus("success");
        trackEvent("Lead", {
          content_name: productName,
          value: productPrice * quantity,
          currency: "UAH",
        });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div style={{ padding: "40px 32px", background: "var(--paper)", border: "1px solid var(--line-soft)", textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>&#10003;</div>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 400, marginBottom: "12px" }}>
          Дякуємо за замовлення!
        </h3>
        <p style={{ color: "var(--text)", fontSize: "14px", lineHeight: "1.7", marginBottom: "8px" }}>
          Ми зв&apos;яжемося з вами протягом 15–30 хвилин для підтвердження.
        </p>
        <p style={{ color: "var(--text-dim)", fontSize: "13px" }}>
          {productName} &middot; {quantity} шт. &middot; {total.toLocaleString("uk-UA")} &#8372;
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--bg-card)",
    border: "1px solid var(--line)",
    color: "var(--ink)",
    padding: "16px 18px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "10px",
    letterSpacing: ".22em",
    textTransform: "uppercase" as const,
    color: "var(--text)",
    marginBottom: "8px",
    fontWeight: 500,
  };

  const dropdownStyle: React.CSSProperties = {
    position: "absolute",
    top: "100%",
    left: 0,
    right: 0,
    background: "var(--bg-card)",
    border: "1px solid var(--line)",
    borderTop: "none",
    maxHeight: "200px",
    overflowY: "auto",
    zIndex: 50,
    boxShadow: "0 8px 24px -8px rgba(26,22,18,.15)",
  };

  const dropdownItemStyle: React.CSSProperties = {
    padding: "12px 18px",
    fontSize: "14px",
    color: "var(--ink)",
    cursor: "pointer",
    borderBottom: "1px solid var(--line-soft)",
    transition: "background .15s",
  };

  return (
    <div>
      {/* Quantity + Total */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", padding: "16px 20px", background: "var(--paper)", border: "1px solid var(--line-soft)" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} style={{ width: "40px", height: "40px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            &#8722;
          </button>
          <div style={{ width: "48px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px" }}>
            {quantity}
          </div>
          <button onClick={() => setQuantity((q) => q + 1)} style={{ width: "40px", height: "40px", background: "transparent", border: "1px solid var(--line)", color: "var(--ink)", fontSize: "18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            +
          </button>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 500, color: "var(--ink)" }}>
          {total.toLocaleString("uk-UA")} &#8372;
        </div>
      </div>

      {/* Name */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Ваше ім&apos;я *</label>
        <input type="text" placeholder="Введіть ім'я" value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} />
      </div>

      {/* Phone */}
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Телефон *</label>
        <input type="tel" placeholder="+380 ___ ___ __ __" value={phone} onChange={(e) => setPhone(e.target.value)} style={inputStyle} />
      </div>

      {/* City with autocomplete */}
      <div style={{ marginBottom: "16px", position: "relative" }}>
        <label style={labelStyle}>Місто *</label>
        <input
          type="text"
          placeholder="Почніть вводити назву міста..."
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value);
            setSelectedCity(null);
            setSelectedWarehouse(null);
            setWarehouseQuery("");
          }}
          onFocus={() => { if (cities.length > 0 && !selectedCity) setShowCities(true); }}
          onBlur={() => setTimeout(() => setShowCities(false), 200)}
          style={inputStyle}
        />
        {showCities && cities.length > 0 && (
          <div style={dropdownStyle}>
            {cities.map((city) => (
              <div
                key={city.ref}
                onClick={() => selectCity(city)}
                onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "var(--bg-soft)"; }}
                onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "var(--bg-card)"; }}
                style={dropdownItemStyle}
              >
                {city.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Warehouse with autocomplete */}
      <div style={{ marginBottom: "24px", position: "relative" }}>
        <label style={labelStyle}>Відділення Нової Пошти *</label>
        <input
          type="text"
          placeholder={selectedCity ? "Введіть номер або назву відділення..." : "Спочатку оберіть місто"}
          value={warehouseQuery}
          onChange={(e) => {
            setWarehouseQuery(e.target.value);
            setSelectedWarehouse(null);
          }}
          onFocus={() => { if (warehouses.length > 0 && !selectedWarehouse) setShowWarehouses(true); }}
          onBlur={() => setTimeout(() => setShowWarehouses(false), 200)}
          disabled={!selectedCity}
          style={{
            ...inputStyle,
            opacity: selectedCity ? 1 : 0.5,
            cursor: selectedCity ? "text" : "not-allowed",
          }}
        />
        {showWarehouses && warehouses.length > 0 && (
          <div style={dropdownStyle}>
            {warehouses
              .filter((wh) =>
                warehouseQuery
                  ? wh.name.toLowerCase().includes(warehouseQuery.toLowerCase()) ||
                    wh.number.includes(warehouseQuery)
                  : true
              )
              .slice(0, 15)
              .map((wh) => (
                <div
                  key={wh.ref}
                  onClick={() => selectWarehouse(wh)}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.background = "var(--bg-soft)"; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.background = "var(--bg-card)"; }}
                  style={dropdownItemStyle}
                >
                  {wh.name}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={status === "sending"}
        style={{
          width: "100%",
          background: status === "sending" ? "var(--text-dim)" : "var(--ink)",
          color: "var(--bg)",
          border: "none",
          padding: "20px",
          fontFamily: "'Inter', sans-serif",
          fontSize: "13px",
          fontWeight: 500,
          letterSpacing: ".22em",
          textTransform: "uppercase",
          cursor: status === "sending" ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "14px",
          marginBottom: "24px",
        }}
      >
        {status === "sending" ? "Відправляємо..." : "Оформити замовлення"}
        {status !== "sending" && (
          <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        )}
      </button>

      {status === "error" && (
        <p style={{ color: "#c0392b", fontSize: "13px", textAlign: "center", marginBottom: "16px" }}>
          Помилка при відправці. Спробуйте ще раз або зателефонуйте нам.
        </p>
      )}

      {/* Trust */}
      <div style={{ display: "flex", gap: "24px", padding: "24px", background: "var(--bg-soft)", border: "1px solid var(--line-soft)", flexWrap: "wrap" }}>
        <TrustItem text="Гарантія 12 міс." />
        <TrustItem text="Оплата при отриманні" />
        <TrustItem text="Відправка сьогодні" />
      </div>
    </div>
  );
}

function TrustItem({ text }: { text: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "12px", color: "var(--text)" }}>
      <svg width="16" height="16" fill="none" stroke="var(--gold-deep)" strokeWidth="1.5" viewBox="0 0 24 24">
        <path d="M20 6 9 17l-5-5" />
      </svg>
      {text}
    </div>
  );
}
