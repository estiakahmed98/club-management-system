"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import type { HeroSlide } from "@/types/club";

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: "1",
    imageUrl: "/assets/image.jpeg",
    title: "Battle on the Field",
  },
  {
    id: "2",
    imageUrl: "/assets/image1.jpeg",
    title: "Power of Unity",
  },
  {
    id: "3",
    imageUrl: "/assets/image4.jpeg",
    title: "Youth Development",
  },
  {
    id: "4",
    imageUrl: "/assets/image3.jpeg",
    title: "Dream of the Future",
  },
  {
    id: "5",
    imageUrl: "/assets/image5.jpg",
    title: "Community Impact",
  },
];

const SLIDE_BG_FALLBACKS = [
  "from-[#0d3520] to-[#1e7a47]",
  "from-[#2d1a0a] to-[#8b5a1a]",
  "from-[#0a1a2e] to-[#1a4a7a]",
];

interface HeroProps {
  slides?: HeroSlide[];
}

export default function Hero({ slides = DEFAULT_SLIDES }: HeroProps) {
  const [current, setCurrent] = useState(0);

  const goSlide = useCallback(
    (n: number) =>
      setCurrent(((n % slides.length) + slides.length) % slides.length),
    [slides.length],
  );

  useEffect(() => {
    const timer = setInterval(() => goSlide(current + 1), 3500);
    return () => clearInterval(timer);
  }, [current, goSlide]);

  return (
    <section className="relative h-[90vh] min-h-[520px] overflow-hidden flex items-end">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1200 ease-in-out ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.imageUrl ? (
            <div className="relative w-full h-full">
              <Image
                src={slide.imageUrl}
                alt={slide.title ?? "Club photo"}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority={i === 0}
                onError={() => console.log("Image failed:", slide.imageUrl)}
              />
            </div>
          ) : (
            <div
              className={`absolute inset-0 bg-linear-to-br ${
                SLIDE_BG_FALLBACKS[i % SLIDE_BG_FALLBACKS.length]
              }`}
            >
              {/* Football pitch SVG overlay */}
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 1400 800"
                preserveAspectRatio="xMidYMid slice"
              >
                <circle
                  cx="700"
                  cy="400"
                  r="350"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="2"
                />
                <circle
                  cx="700"
                  cy="400"
                  r="250"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="1.5"
                />
                <line
                  x1="350"
                  y1="400"
                  x2="1050"
                  y2="400"
                  stroke="#c9a227"
                  strokeWidth="1.5"
                />
                <circle
                  cx="700"
                  cy="400"
                  r="60"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="1.5"
                />
                <rect
                  x="400"
                  y="100"
                  width="600"
                  height="600"
                  fill="none"
                  stroke="white"
                  strokeWidth="1"
                  opacity="0.3"
                />
                <rect
                  x="150"
                  y="250"
                  width="200"
                  height="300"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="1"
                />
                <rect
                  x="1050"
                  y="250"
                  width="200"
                  height="300"
                  fill="none"
                  stroke="#c9a227"
                  strokeWidth="1"
                />
              </svg>
            </div>
          )}

          {/* Overlay - darker at bottom */}
          <div className="absolute inset-0 bg-linear-to-t from-[#0a2e1a]/95 via-[#0a2e1a]/30 to-transparent" />
        </div>
      ))}

      {/* Content - Bottom Left */}
      <div className="relative z-10 px-6 md:px-12 pb-10 md:pb-14 w-full max-w-5xl">
        <span className="inline-block bg-[#c9a227] text-[#0a2e1a] text-[10px] md:text-[11px] font-bold tracking-[3px] uppercase px-3 py-1 mb-5">
          Founded with passion • Aulai Mohonpur
        </span>

        <h1
          className="font-black text-white leading-[0.9] mb-4 drop-shadow-2xl"
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(3rem, 8vw, 7rem)",
          }}
        >
          Friend
          <br />
          For <span className="text-[#c9a227]">Future</span>
          <br />
          Club
        </h1>

        <p className="text-[#d5e3cf] text-xs md:text-sm tracking-[3px] md:tracking-[4px] uppercase mb-8">
          Aulai Mohonpur · Unity · Spirit · Excellence
        </p>

        <a
          href="#about"
          className="inline-flex items-center gap-2 bg-[#c9a227] text-[#0a2e1a] px-6 md:px-8 py-3 md:py-4 text-[12px] md:text-[13px] font-bold tracking-[2px] uppercase no-underline transition-all duration-200 hover:bg-[#f0c94a] hover:-translate-y-1 hover:shadow-2xl"
          style={{
            clipPath:
              "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
          }}
        >
          Learn About Us →
        </a>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 right-6 md:right-12 z-10 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goSlide(i)}
            className={`h-[3px] transition-all duration-300 cursor-pointer border-none ${
              i === current ? "bg-[#c9a227] w-12" : "bg-white/30 w-7"
            }`}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
