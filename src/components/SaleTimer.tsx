"use client";

import { useState, useEffect } from "react";

export default function SaleTimer() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calcTimeLeft() {
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      const diff = endOfDay.getTime() - now.getTime();
      if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0 };
      return {
        hours: Math.floor(diff / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      };
    }
    setTimeLeft(calcTimeLeft());
    const interval = setInterval(() => setTimeLeft(calcTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, "0");

  return (
    <div className="sale-timer" style={{ background: "var(--ink)", color: "var(--bg)", marginBottom: "28px" }}>
      <div style={{ fontSize: "11px", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold-soft)", fontWeight: 500 }}>
        Акція закінчується:
      </div>
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <TimeBlock value={pad(timeLeft.hours)} label="год" />
        <span style={{ color: "var(--gold-soft)", fontSize: "20px", fontFamily: "'Cormorant Garamond', serif" }}>:</span>
        <TimeBlock value={pad(timeLeft.minutes)} label="хв" />
        <span style={{ color: "var(--gold-soft)", fontSize: "20px", fontFamily: "'Cormorant Garamond', serif" }}>:</span>
        <TimeBlock value={pad(timeLeft.seconds)} label="сек" />
      </div>
    </div>
  );
}

function TimeBlock({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 500, lineHeight: "1", color: "var(--bg)", background: "rgba(255,255,255,.1)", padding: "6px 10px", minWidth: "44px" }}>
        {value}
      </div>
      <div style={{ fontSize: "9px", letterSpacing: ".15em", textTransform: "uppercase", color: "rgba(245,241,232,.5)", marginTop: "4px" }}>
        {label}
      </div>
    </div>
  );
}
