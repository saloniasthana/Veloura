"use client";

import { useState } from "react";
import ProductImage from "../ProductImage";

export default function Gallery({
  seed,
  images,
  label,
}: {
  seed: number;
  images: string[];
  label: string;
}) {
  const hasRealImages = images.length > 0;
  const shots = hasRealImages
    ? images
    : [seed, (seed + 1) % 4, (seed + 2) % 4, (seed + 3) % 4];
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-4">
      {shots.length > 1 ? (
        <div className="hidden sm:flex flex-col gap-3">
          {shots.map((shot, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-20 w-16 overflow-hidden border transition-colors ${
                active === i ? "border-ink" : "border-transparent"
              }`}
            >
              <ProductImage
                src={hasRealImages ? (shot as string) : undefined}
                seed={hasRealImages ? 0 : (shot as number)}
                alt={`${label} thumbnail ${i + 1}`}
                className="h-full w-full"
              />
            </button>
          ))}
        </div>
      ) : null}

      <div className="relative min-w-0 flex-1 h-140 md:h-170 overflow-hidden bg-ivory-dim">
        <ProductImage
          src={hasRealImages ? (shots[active] as string) : undefined}
          seed={hasRealImages ? 0 : (shots[active] as number)}
          alt={label}
          className="h-full w-full"
          label={hasRealImages ? undefined : label}
        />
      </div>
    </div>
  );
}
