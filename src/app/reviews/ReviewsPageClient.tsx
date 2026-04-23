"use client";

import { useState } from "react";
import ReviewForm from "@/components/ReviewForm";
import Link from "next/link";

interface Review {
  _id: string;
  name: string;
  rating: number;
  tags?: string[];
  text?: string;
  reply?: string;
  createdAt: string;
  product?: { name: string; slug: { current: string } };
}

export default function ReviewsPageClient({ reviews, tagLabels }: { reviews: Review[]; tagLabels: Record<string, string> }) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);

  const filtered = filterRating ? reviews.filter(r => r.rating === filterRating) : reviews;

  return (
    <div className="grid-specs" style={{ alignItems: "start" }}>
      {/* Left — reviews list */}
      <div>
        {/* Filter by stars */}
        <div style={{ display: "flex", gap: "8px", marginBottom: "32px", flexWrap: "wrap" }}>
          <button onClick={() => setFilterRating(null)}
            style={{ padding: "8px 16px", fontSize: "12px", borderRadius: "20px", cursor: "pointer", border: filterRating === null ? "1px solid var(--gold-deep)" : "1px solid var(--line)", background: filterRating === null ? "var(--gold-deep)" : "transparent", color: filterRating === null ? "#fff" : "var(--text)", fontFamily: "'Inter', sans-serif" }}
          >
            Всі ({reviews.length})
          </button>
          {[5,4,3,2,1].map(s => {
            const count = reviews.filter(r => r.rating === s).length;
            if (count === 0) return null;
            return (
              <button key={s} onClick={() => setFilterRating(filterRating === s ? null : s)}
                style={{ padding: "8px 16px", fontSize: "12px", borderRadius: "20px", cursor: "pointer", border: filterRating === s ? "1px solid var(--gold-deep)" : "1px solid var(--line)", background: filterRating === s ? "var(--gold-deep)" : "transparent", color: filterRating === s ? "#fff" : "var(--text)", fontFamily: "'Inter', sans-serif", display: "flex", alignItems: "center", gap: "6px" }}
              >
                {s} <svg width="14" height="14" viewBox="0 0 24 24" fill={filterRating === s ? "#fff" : "var(--gold-deep)"} stroke="none"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg> ({count})
              </button>
            );
          })}
        </div>

        {/* Reviews */}
        {filtered.length > 0 ? filtered.map(review => (
          <div key={review._id} style={{ background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "8px", padding: "28px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, var(--gold-deep), var(--gold-soft))", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 600, flexShrink: 0 }}>
                  {review.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: "var(--ink)" }}>{review.name}</div>
                  <div style={{ display: "flex", gap: "2px", marginTop: "4px" }}>
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="14" height="14" viewBox="0 0 24 24" fill={s <= review.rating ? "var(--gold-deep)" : "var(--line)"} stroke="none">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: "12px", color: "var(--text-dim)" }}>
                {new Date(review.createdAt).toLocaleDateString("uk-UA")}
              </div>
            </div>

            {/* Product link */}
            {review.product && (
              <Link href={"/product/" + review.product.slug.current}
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "var(--gold-deep)", fontWeight: 500, marginBottom: "12px", borderBottom: "1px solid var(--gold-deep)", paddingBottom: "2px" }}
              >
                📦 {review.product.name}
              </Link>
            )}

            {/* Tags */}
            {review.tags && review.tags.length > 0 && (
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                {review.tags.map(tag => (
                  <span key={tag} style={{ padding: "4px 12px", fontSize: "11px", borderRadius: "12px", background: "var(--bg-soft)", color: "var(--text)", border: "1px solid var(--line-soft)" }}>
                    {tagLabels[tag] || tag}
                  </span>
                ))}
              </div>
            )}

            {/* Text */}
            {review.text && (
              <p style={{ fontSize: "15px", color: "var(--ink)", lineHeight: "1.65", marginBottom: review.reply ? "16px" : "0" }}>{review.text}</p>
            )}

            {/* Reply */}
            {review.reply && (
              <div style={{ marginTop: "12px", padding: "16px", background: "var(--paper)", borderLeft: "3px solid var(--gold-deep)", borderRadius: "0 4px 4px 0" }}>
                <div style={{ fontSize: "11px", letterSpacing: ".15em", textTransform: "uppercase", color: "var(--gold-deep)", fontWeight: 600, marginBottom: "8px" }}>
                  Відповідь TALIRA
                </div>
                <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.6" }}>{review.reply}</p>
              </div>
            )}
          </div>
        )) : (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-dim)" }}>
            <p style={{ fontSize: "16px" }}>Поки немає відгуків з такою оцінкою</p>
          </div>
        )}
      </div>

      {/* Right — form */}
      <div style={{ position: "sticky", top: "100px" }}>
        {showForm ? (
          <ReviewForm onSuccess={() => setShowForm(false)} />
        ) : (
          <div style={{ background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "8px", padding: "36px", textAlign: "center" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 400, marginBottom: "12px" }}>
              Маєте досвід з TALIRA?
            </h3>
            <p style={{ fontSize: "14px", color: "var(--text)", marginBottom: "24px", lineHeight: "1.6" }}>
              Поділіться враженнями — ваш відгук допоможе іншим клієнтам
            </p>
            <button onClick={() => setShowForm(true)}
              style={{ background: "var(--gold-deep)", color: "#fff", border: "none", padding: "16px 32px", fontSize: "13px", fontWeight: 600, letterSpacing: ".18em", textTransform: "uppercase", cursor: "pointer", borderRadius: "4px", fontFamily: "'Inter', sans-serif" }}
            >
              Залишити відгук
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
