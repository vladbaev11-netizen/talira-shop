import { Suspense } from 'react';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import HomeContent from "@/components/HomeContent";

export default function HomePage() {
  return (
    <>
      <Header />
      <HeroSlider />
      
      <Suspense fallback={<HomeLoading />}>
        <HomeContent />
      </Suspense>
      
      <Footer />
    </>
  );
}

function HomeLoading() {
  return (
    <div style={{ padding: "60px 0" }}>
      <div style={{ maxWidth: "1400px", margin: "0 auto", padding: "0 20px", textAlign: "center" }}>
        <div className="spinner" />
        <p style={{ color: "var(--text-dim)" }}>Завантаження товарів...</p>
      </div>
    </div>
  );
}
