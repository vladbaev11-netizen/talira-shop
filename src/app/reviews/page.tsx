import { client } from "@/sanity/client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import ReviewsPageClient from "./ReviewsPageClient";

const TAG_LABELS: Record<string, string> = {
  fast_delivery: "Швидка доставка",
  quality_product: "Якісний товар",
  good_communication: "Гарне спілкування",
  recommend: "Рекомендую",
  good_packaging: "Гарна упаковка",
  matches_description: "Відповідає опису",
};

async function getReviews() {
  return client.fetch(`
    *[_type == "customerReview" && approved == true] | order(createdAt desc) {
      _id, name, rating, tags, text, reply, createdAt,
      "product": product->{ name, slug }
    }
  `);
}

export const revalidate = 60;
export const metadata = { title: "Відгуки — TALIRA", description: "Відгуки наших клієнтів" };

export default async function ReviewsPage() {
  const reviews = await getReviews();

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  return (
    <>
      <Header />

      <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "20px 48px", fontSize: "11px", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--text-dim)" }}>
        <Link href="/" style={{ color: "var(--text)" }}>Головна</Link>
        <span style={{ margin: "0 12px" }}>/</span>
        <span style={{ color: "var(--ink)" }}>Відгуки</span>
      </div>

      {/* Hero */}
      <section style={{ padding: "20px 0 48px", borderBottom: "1px solid var(--line)" }}>
        <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: "24px" }}>
            <div>
              <h1 className="title-page" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, marginBottom: "16px" }}>
                Відгуки <em style={{ color: "var(--gold-deep)", fontStyle: "italic", fontWeight: 300 }}>клієнтів</em>
              </h1>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ display: "flex", gap: "4px" }}>
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} width="22" height="22" viewBox="0 0 24 24" fill="var(--gold-deep)" stroke="none">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                    </svg>
                  ))}
                </div>
                <span style={{ fontSize: "18px", fontWeight: 700, color: "var(--ink)" }}>{avgRating}</span>
                <span style={{ fontSize: "14px", color: "var(--text-dim)" }}>({reviews.length} відгуків)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews + Form */}
      <section style={{ padding: "48px 0 80px" }}>
        <div className="container-pad" style={{ maxWidth: "1320px", margin: "0 auto", padding: "0 48px" }}>
          <ReviewsPageClient reviews={JSON.parse(JSON.stringify(reviews))} tagLabels={TAG_LABELS} />
        </div>
      </section>

      <Footer />
    </>
  );
}
