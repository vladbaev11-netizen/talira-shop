"use client";

import { useRef } from "react";

interface Review {
  name: string;
  city?: string;
  rating?: number;
  text: string;
  reply?: string;
  createdAt?: string;
  product?: { name: string; slug: { current: string } };
}

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scrollLeft() {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: -340, behavior: "smooth" });
  }
  function scrollRight() {
    if (scrollRef.current) scrollRef.current.scrollBy({ left: 340, behavior: "smooth" });
  }

  if (!reviews || reviews.length === 0) return null;

  return (
    <div style={{ position: "relative" }}>
      {/* Arrows */}
      {reviews.length > 3 && (
        <>
          <button onClick={scrollLeft} style={{ position: "absolute", left: "-20px", top: "50%", transform: "translateY(-50%)", width: "44px", height: "44px", background: "rgba(255,255,255,.95)", border: "1px solid var(--line-soft)", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "var(--ink)", zIndex: 3, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}>
            ‹
          </button>
          <button onClick={scrollRight} style={{ position: "absolute", right: "-20px", top: "50%", transform: "translateY(-50%)", width: "44px", height: "44px", background: "rgba(255,255,255,.95)", border: "1px solid var(--line-soft)", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px", color: "var(--ink)", zIndex: 3, boxShadow: "0 4px 12px rgba(0,0,0,.08)" }}>
            ›
          </button>
        </>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          paddingBottom: "8px",
          scrollbarWidth: "none",
        }}
      >
        <style>{`.reviews-scroll::-webkit-scrollbar { display: none; }`}</style>
        {reviews.map((review, i) => (
          <div
            key={i}
            style={{
              minWidth: "320px",
              maxWidth: "360px",
              flex: "0 0 auto",
              scrollSnapAlign: "start",
              background: "var(--bg-card)",
              border: "1px solid var(--line-soft)",
              borderRadius: "8px",
              padding: "28px",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", top: "14px", right: "18px", fontFamily: "'Cormorant Garamond', serif", fontSize: "50px", lineHeight: "1", color: "var(--line-soft)" }}>&ldquo;</div>

            <div style={{ display: "flex", gap: "3px", marginBottom: "14px" }}>
              {[1,2,3,4,5].map(s => (
                <svg key={s} width="15" height="15" viewBox="0 0 24 24" fill={s <= (review.rating || 5) ? "var(--gold-deep)" : "var(--line)"} stroke="none">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              ))}
            </div>

            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: "italic", fontSize: "16px", lineHeight: "1.5", marginBottom: "20px", color: "var(--ink)", position: "relative", zIndex: 1, minHeight: "72px" }}>
              &ldquo;{review.text}&rdquo;
            </p>

            {review.reply && (
              <div style={{ marginBottom: "16px", padding: "12px", background: "var(--paper)", borderLeft: "3px solid var(--gold-deep)", borderRadius: "0 4px 4px 0", fontSize: "13px" }}>
                <div style={{ fontSize: "10px", letterSpacing: ".1em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 600, marginBottom: "4px" }}>TALIRA</div>
                <p style={{ color: "var(--text)", lineHeight: "1.5" }}>{review.reply}</p>
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: "10px", paddingTop: "14px", borderTop: "1px solid var(--line-soft)" }}>
              <div style={{ width: "38px", height: "38px", borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-deep), var(--gold-soft))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 600, flexShrink: 0 }}>
                {review.name.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>{review.name}</div>
                {review.city && (
                  <div style={{ fontSize: "10px", color: "var(--text-dim)" }}>
                    {review.city}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
