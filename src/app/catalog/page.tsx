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
          <div style={{ 
            width: "40px", 
            height: "40px", 
            border: "3px solid var(--line)",
            borderTopColor: "var(--gold-deep)",
            borderRadius: "50%",
            animation: "spin 0.8s linear infinite",
            margin: "0 auto 16px"
          }} />
          <p style={{ color: "var(--text-dim)" }}>Завантаження...</p>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
