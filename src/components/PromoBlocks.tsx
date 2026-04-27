"use client";

import promoData from "./promo-data.json";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({ projectId: "777maat6", dataset: "production" });
function imgUrl(source: any) { return builder.image(source); }

interface PromoSection {
  problem_title: string;
  problem_desc: string;
  problems: { icon: string; before: string; after: string }[];
  why_title: string;
  features: { icon: string; title: string; desc: string }[];
  steps_title: string;
  steps: { num: string; title: string; desc: string }[];
}

export default function PromoBlocks({ sku, images, productName }: { sku: string; images?: any[]; productName?: string }) {
  const data = (promoData as Record<string, PromoSection>)[sku?.toLowerCase()] || null;
  if (!data) return null;

  return (
    <>
      {/* Problem / Solution */}
      <section style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px", textAlign: "center" }}>
          <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "20px" }}>
            {data.problem_title}
          </h2>
          <p style={{ fontSize: "15px", color: "var(--text)", lineHeight: "1.8", marginBottom: "40px", maxWidth: "640px", margin: "0 auto 40px" }}>
            {data.problem_desc}
          </p>
          <div className="grid-n7-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
            {data.problems.map((p, i) => (
              <div key={i} style={{ padding: "28px 20px", background: "var(--paper)", border: "1px solid var(--line-soft)", borderRadius: "12px" }}>
                <div style={{ fontSize: "32px", marginBottom: "14px" }}>{p.icon}</div>
                <div style={{ fontSize: "13px", color: "var(--text-dim)", textDecoration: "line-through", marginBottom: "8px" }}>{p.before}</div>
                <div style={{ fontSize: "15px", color: "var(--gold-deep)", fontWeight: 600 }}>{p.after}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why this product */}
      <section style={{ padding: "80px 0", background: "var(--paper)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="container-pad" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
          <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, textAlign: "center", marginBottom: "48px" }}>
            {data.why_title}
          </h2>
          <div className="grid-4">
            {data.features.map((f, i) => (
              <div key={i} style={{ textAlign: "center", padding: "28px 16px", background: "var(--bg-card)", border: "1px solid var(--line-soft)", borderRadius: "12px" }}>
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>{f.icon}</div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "19px", fontWeight: 500, marginBottom: "8px" }}>{f.title}</h4>
                <p style={{ fontSize: "13px", color: "var(--text)", lineHeight: "1.5" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "80px 0", background: "var(--bg)" }}>
        <div className="container-pad" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 48px" }}>
          <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, textAlign: "center", marginBottom: "48px" }}>
            {data.steps_title}
          </h2>
          <div className="grid-n7-cards" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "40px", textAlign: "center" }}>
            {data.steps.map((s, i) => (
              <div key={i}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "48px", fontStyle: "italic", color: "var(--gold-deep)", fontWeight: 300, lineHeight: 1, marginBottom: "16px" }}>{s.num}</div>
                <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", fontWeight: 500, marginBottom: "8px" }}>{s.title}</h4>
                <p style={{ fontSize: "14px", color: "var(--text)", lineHeight: "1.6" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo gallery */}
      {images && images.length > 2 && (
        <section style={{ padding: "60px 0", background: "var(--bg-soft)" }}>
          <div className="container-pad" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 48px" }}>
            <h2 className="title-section" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, textAlign: "center", marginBottom: "32px" }}>
              {"Товар "}<em style={{ color: "var(--gold-deep)", fontStyle: "italic" }}>{"зблизька"}</em>
            </h2>
            <div className="grid-n7-gallery" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
              {images.slice(0, 4).map((img: any, i: number) => (
                <div key={i} style={{ aspectRatio: "1", position: "relative", borderRadius: "8px", overflow: "hidden" }}>
                  <img src={imgUrl(img).width(400).height(400).url()} alt={(productName || "Товар") + " " + (i + 1)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
