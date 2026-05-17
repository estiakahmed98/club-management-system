"use client";

import Image from "next/image";
import type { GalleryItem } from "@/types/club";
import SectionHeader from "./SectionHeader";

const FALLBACK_COLORS = [
  "from-[#0d3520] to-[#196b3a]",
  "from-[#1a4a10] to-[#2d7a1a]",
  "from-[#3d2a0d] to-[#7a5a1a]",
  "from-[#0d2a3d] to-[#1a4a6b]",
  "from-[#2d0d3d] to-[#5a1a7a]",
];

const FALLBACK_ICONS = ["⚽", "🌙", "🏆", "🎉", "🏖️"];

const DEFAULT_GALLERY: GalleryItem[] = [
  { id: "1", title: "FFF Squad in One Frame", imageUrl: "/assets/image.jpeg", description: "Match Day • 2025" },
  { id: "2", title: "The Senior Football Team", imageUrl: "/assets/image1.jpeg", description: "Club Tournament • 2025" },
  { id: "3", title: "Throwback Memories", imageUrl: "/assets/image3.jpeg", description: "Founding Days • 2013" },
  { id: "4", title: "Respect to Senior Members", imageUrl: "/assets/image4.jpeg", description: "Executive Committee • 2019" },
  { id: "5", title: "Away Match Travel Diary", imageUrl: "/assets/image5.jpeg", description: "Tour & Travel • 2026" },
  { id: "6", title: "Post Eid-ul-Fitr Congregation", imageUrl: "/assets/image6.jpeg", description: "Community Festival • 2026" },
];

interface GalleryProps {
  items?: GalleryItem[];
}

export default function Gallery({ items = DEFAULT_GALLERY }: GalleryProps) {
  return (
    <section id="gallery" className="bg-[#134d2e] py-24 px-6 md:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeader tag="Treasury of Memories" title="Photo Gallery" />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => (
            <div
              key={item.id}
              className="relative overflow-hidden group cursor-pointer h-[220px] min-h-[220px]"
            >
              {item.imageUrl ? (
                <div className="absolute inset-0">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    fill
                    sizes="(min-width: 1280px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${
                    FALLBACK_COLORS[i % FALLBACK_COLORS.length]
                  } flex flex-col items-center justify-center transition-transform duration-500 group-hover:scale-105`}
                >
                  <span className="text-4xl mb-2">{FALLBACK_ICONS[i % FALLBACK_ICONS.length]}</span>
                  <span
                    className="text-[#c9a227]/60 tracking-widest text-center px-4"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}
                  >
                    {item.title}
                  </span>
                </div>
              )}

              {/* Bottom Right Corner Info - Always Visible */}
              <div className="absolute bottom-0 right-0 p-3 bg-gradient-to-tl from-black/80 via-black/50 to-transparent w-full text-right">
                <p
                  className="text-white text-sm font-bold"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {item.title}
                </p>
                {item.description && (
                  <span className="text-[#c9a227] text-[9px] tracking-[2px] uppercase">
                    {item.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}