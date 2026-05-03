"use client";

import { useState } from "react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({ projectId: "777maat6", dataset: "production" });
function urlFor(source: any) { return builder.image(source); }

interface ProductPageClientProps {
  images: any[];
  externalImages?: string[];
  productName: string;
}

export default function ProductPageClient({ images, externalImages, productName }: ProductPageClientProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // Build unified image list: Sanity images first, then external URLs
  const allImages: { type: "sanity" | "external"; src: string; thumb: string }[] = [];

  // Sanity images
  for (const img of images) {
    if (img && img.asset) {
      allImages.push({
        type: "sanity",
        src: urlFor(img).width(800).height(800).url(),
        thumb: urlFor(img).width(200).height(200).url(),
      });
    }
  }

  // External images (if no Sanity images)
  if (allImages.length === 0 && externalImages) {
    for (const url of externalImages) {
      if (url && url.startsWith("http")) {
        allImages.push({ type: "external", src: url, thumb: url });
      }
    }
  }

  if (allImages.length === 0) {
    return <div style={{ aspectRatio: "1", background: "var(--bg-card)", border: "1px solid var(--line-soft)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-dim)", fontSize: "14px" }}>{"Фото відсутнє"}</div>;
  }

  return (
    <div>
      {/* Main image */}
      <div style={{ aspectRatio: "1", background: "var(--bg-card)", border: "1px solid var(--line-soft)", marginBottom: "14px", position: "relative", overflow: "hidden" }}>
        <Image
          src={allImages[activeIndex].src}
          alt={productName + " — фото " + (activeIndex + 1)}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          unoptimized={allImages[activeIndex].type === "external"}
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(" + Math.min(allImages.length, 5) + ", 1fr)", gap: "12px" }}>
          {allImages.map((img, i) => (
            <div
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{ aspectRatio: "1", background: "var(--bg-card)", border: i === activeIndex ? "2px solid var(--ink)" : "1px solid var(--line-soft)", cursor: "pointer", position: "relative", overflow: "hidden" }}
            >
              <Image
                src={img.thumb}
                alt={productName + " — мініатюра " + (i + 1)}
                fill
                style={{ objectFit: "cover" }}
                sizes="100px"
                unoptimized={img.type === "external"}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
