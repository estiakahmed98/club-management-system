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
  { id: "1", title: "ম্যাচের মুহূর্ত", imageUrl: "/assets/image.jpeg", description: "ক্রীড়া • ২০২৫" },
  { id: "2", title: "ইফতার পার্টি ২০২৫", imageUrl: "/assets/image1.jpeg", description: "ইভেন্ট • রমজান" },
  { id: "3", title: "চ্যাম্পিয়নস কাপ", imageUrl: "/assets/image3.jpeg", description: "টুর্নামেন্ট • ২০২৪" },
  { id: "4", title: "ঈদ সেলিব্রেশন", imageUrl: "/assets/image4.jpeg", description: "ইভেন্ট • ২০২৪" },
  { id: "5", title: "পিকনিক ২০২৪", imageUrl: "/assets/image5.jpeg", description: "আনন্দ • প্রকৃতি" },
  { id: "6", title: "ট্রেনিং সেশন", imageUrl: "/assets/image6.jpeg", description: "প্রস্তুতি • ২০২৫" },
];

interface GalleryProps {
  items?: GalleryItem[];
}

export default function Gallery({ items = DEFAULT_GALLERY }: GalleryProps) {
  return (
    <section id="gallery" className="bg-[#134d2e] py-24 px-6 md:px-10 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <SectionHeader tag="স্মৃতির ভাণ্ডার" title="ফটো গ্যালারি" />

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item, i) => (
            <div key={item.id} className="relative overflow-hidden group cursor-pointer h-[220px]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  fill
                  className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
                />
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

              {/* Overlay */}
              <div className="absolute inset-0 bg-[#0a2e1a]/80 flex flex-col items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <p
                  className="text-white text-center px-4"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem" }}
                >
                  {item.title}
                </p>
                {item.description && (
                  <span className="text-[#c9a227] text-[10px] tracking-[3px] uppercase mt-2">
                    {item.description}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center mt-8 text-[#a8b8a0] text-xs tracking-[2px] uppercase">
          Admin প্যানেল থেকে ছবি আপলোড করুন এবং গ্যালারি আপডেট করুন
        </p>
      </div>
    </section>
  );
}
