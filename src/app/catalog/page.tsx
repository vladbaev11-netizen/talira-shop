import { Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CatalogContent from "@/components/CatalogContent";

export default function CatalogPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div style={{ 
        padding: '80px 20px',
        textAlign: 'center',
        color: '#8a7a6a'
      }}>Завантаження...</div>}>
        <CatalogContent />
      </Suspense>
      <Footer />
    </>
  );
}
