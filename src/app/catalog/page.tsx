import { Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogContent from "@/components/CatalogContent";

export default function CatalogPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<CatalogLoading />}>
        <CatalogContent />
      </Suspense>
      <Footer />
    </>
  );
}

function CatalogLoading() {
  return (
    <div style={{ padding: "40px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
        <div style={{ padding: "80px 20px" }}>
          <div className="spinner" />
          <p style={{ color: "var(--text-dim)" }}>Завантаження...</p>
        </div>
      </div>
    </div>
  );
}
