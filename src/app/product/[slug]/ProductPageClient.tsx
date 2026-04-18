"use client";

import { useState } from "react";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";

const builder = imageUrlBuilder({
  projectId: "777maat6",
  dataset: "production",
});

function urlForClient(source: any) {
  return builder.image(source);
}

export default function ProductPageClient({
  images,
  productName,
}: {
  images: any[];
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);

  const cols = Math.min(images.length, 5);

  function prev() {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  const arrowStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: "48px",
    height: "48px",
    background: "rgba(255,255,255,.9)",
    border: "1px solid var(--line-soft)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    zIndex: 3,
    color: "var(--ink)",
    fontSize: "20px",
    transition: "all .2s",
  };

  return (
    <div>
      <div
        style={{
          aspectRatio: "1",
          background: "var(--bg-card)",
          border: "1px solid var(--line-soft)",
          marginBottom: "14px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {images[activeIndex] && (
          <Image
            src={urlForClient(images[activeIndex]).width(800).height(800).url()}
            alt={productName}
            fill
            style={{ objectFit: "cover" }}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        )}

        {images.length > 1 && (
          <>
            <button onClick={prev} style={{ ...arrowStyle, left: "16px" }}>
              ‹
            </button>
            <button onClick={next} style={{ ...arrowStyle, right: "16px" }}>
              ›
            </button>
          </>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            background: "rgba(0,0,0,.5)",
            color: "#fff",
            padding: "4px 12px",
            fontSize: "12px",
            borderRadius: "100px",
            zIndex: 3,
          }}
        >
          {activeIndex + 1} / {images.length}
        </div>
      </div>

      {images.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(" + cols + ", 1fr)",
            gap: "12px",
          }}
        >
          {images.map((img: any, i: number) => (
            <div
              key={i}
              onClick={() => setActiveIndex(i)}
              style={{
                aspectRatio: "1",
                background: "var(--bg-card)",
                border: i === activeIndex ? "2px solid var(--ink)" : "1px solid var(--line-soft)",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Image
                src={urlForClient(img).width(200).height(200).url()}
                alt={productName + " " + (i + 1)}
                fill
                style={{ objectFit: "cover" }}
                sizes="100px"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}