"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({ projectId: "777maat6", dataset: "production" });
function imgUrl(source: any) { return builder.image(source); }

interface Category {
  name: string;
  slug: { current: string };
  image?: any;
}

export default function CategoryCarousel({ categories }: { categories: Category[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  function updateScrollState() {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
  }

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", updateScrollState);
    return () => { if (el) el.removeEventListener("scroll", updateScrollState); };
  }, []);

  // Auto scroll
  useEffect(() => {
    if (categories.length <= 4) return;
    const interval = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      if (scrollLeft >= scrollWidth - clientWidth - 5) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [categories.length]);

  function scrollLeftFn() { scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" }); }
  function scrollRightFn() { scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" }); }

  return (
    <div style={{ position: "relative" }}>
      {canScrollLeft && (
        <button onClick={scrollLeftFn} style={{ position: "absolute", left: "-16px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", background: "rgba(255,255,255,.95)", border: "1px solid var(--line-soft)", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "var(--ink)", zIndex: 3, boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
          {"‹"}
        </button>
      )}
      {canScrollRight && categories.length > 4 && (
        <button onClick={scrollRightFn} style={{ position: "absolute", right: "-16px", top: "50%", transform: "translateY(-50%)", width: "40px", height: "40px", background: "rgba(255,255,255,.95)", border: "1px solid var(--line-soft)", borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "var(--ink)", zIndex: 3, boxShadow: "0 2px 8px rgba(0,0,0,.08)" }}>
          {"›"}
        </button>
      )}

      <div
        ref={scrollRef}
        style={{
          display: "flex", gap: "12px", overflowX: "auto",
          scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none", paddingBottom: "4px",
        }}
      >
        <style>{`.cat-scroll::-webkit-scrollbar{display:none}`}</style>
        {categories.map((cat, i) => (
          <Link
            key={cat.slug?.current || i}
            href={"/catalog?category=" + (cat.slug?.current || "")}
            style={{
              flex: "0 0 calc(25% - 9px)", minWidth: "200px",
              scrollSnapAlign: "start", position: "relative",
              aspectRatio: "16/9", overflow: "hidden",
              background: "linear-gradient(135deg, #e8dcc0 0%, #cdb88e 100%)",
              display: "block", borderRadius: "8px",
            }}
          >
            {cat.image && cat.image.asset && (
              <Image src={imgUrl(cat.image).width(400).height(225).url()} alt={cat.name} fill style={{ objectFit: "cover" }} sizes="25vw" />
            )}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "16px", background: "linear-gradient(180deg, transparent 0%, rgba(26,22,18,.75) 100%)", color: "var(--bg)" }}>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontWeight: 400, lineHeight: "1.2" }}>{cat.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
