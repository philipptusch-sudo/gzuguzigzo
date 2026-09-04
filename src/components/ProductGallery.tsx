"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/data/products";

export function ProductGallery({
  images,
  name,
}: {
  images: readonly ProductImage[];
  name: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = images[activeIndex] ?? images[0];

  if (!active) return null;

  return (
    <div className="flex flex-col gap-4">
      <Image
        key={active.src}
        src={active.src}
        alt={active.alt}
        width={active.width}
        height={active.height}
        priority
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="bg-cream-200 w-full rounded-md object-cover"
      />

      {images.length > 1 ? (
        <ul className="grid grid-cols-5 gap-3" aria-label={`Weitere Ansichten von ${name}`}>
          {images.map((image, index) => (
            <li key={image.src}>
              <button
                type="button"
                onClick={() => setActiveIndex(index)}
                aria-current={index === activeIndex ? "true" : undefined}
                className={`bg-cream-200 block w-full overflow-hidden rounded-sm ring-offset-2 transition ${
                  index === activeIndex ? "ring-ink-900 ring-2" : "ring-cream-400 ring-1"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  width={240}
                  height={240}
                  sizes="120px"
                  className="aspect-square w-full object-cover"
                />
                <span className="sr-only">{image.alt}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
