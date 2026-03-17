"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=85",
    caption: "Relax in elegance",
    location: "Victoria Island, Lagos",
  },
  {
    src: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1400&q=85",
    caption: "Wake up refreshed",
    location: "Lekki Phase 1, Lagos",
  },
  {
    src: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1400&q=85",
    caption: "Your home away from home",
    location: "Ikoyi, Lagos",
  },
  {
    src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=85",
    caption: "Live beautifully",
    location: "Abuja, FCT",
  },
  {
    src: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1400&q=85",
    caption: "Curated for the discerning",
    location: "Banana Island, Lagos",
  },
];

export function ImageCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-full">
      {/* Slides */}
      {SLIDES.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={i !== current}
        >
          <Image
            src={slide.src}
            alt={slide.caption}
            fill
            sizes="(min-width: 1024px) 50vw, 0vw"
            className="object-cover"
            priority={i === 0}
          />
        </div>
      ))}

      {/* Cinematic gradient overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-black/25 pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-r from-black/10 to-transparent pointer-events-none" />

      {/* Brand watermark */}
      <div className="absolute top-8 right-8">
        <span className="text-white/50 text-[11px] font-medium tracking-[0.2em] uppercase">
          Still Homes
        </span>
      </div>

      {/* Caption */}
      <div className="absolute bottom-16 left-10 right-10">
        <p
          key={`loc-${current}`}
          className="text-white/55 text-[11px] font-medium tracking-[0.18em] uppercase mb-2 flex items-center gap-2.5"
        >
          <span className="w-5 h-px bg-white/40 inline-block" />
          {SLIDES[current].location}
        </p>
        <p
          key={`cap-${current}`}
          className="text-white text-[22px] font-semibold leading-snug"
        >
          {SLIDES[current].caption}
        </p>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-7 left-10 flex items-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-0.75 rounded-full transition-all duration-500 ${
              i === current
                ? "bg-white w-8"
                : "bg-white/30 w-3 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
