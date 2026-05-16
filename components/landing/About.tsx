import SectionHeader from "./SectionHeader";

export default function About() {
  return (
    <section id="about" className="bg-[#0a2e1a] py-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
        {/* Text */}
        <div>
          <SectionHeader tag="আমাদের গল্প" title={"একতা, উদ্যম\nও ভবিষ্যৎ"} />
          <div className="space-y-4 mt-2" style={{ fontFamily: "'Tiro Bangla', serif" }}>
            <p className="text-[#a8b8a0] leading-[1.9] text-[1.05rem]">
              আউলাই মহনপুর ফ্রেন্ড ফর ফিউচার ক্লাব — একটি স্বপ্নের নাম। এই ক্লাব শুধু ফুটবল খেলার জায়গা নয়, এটি আমাদের বন্ধুত্বের, একতার এবং ভবিষ্যৎ গড়ার এক অনন্য প্ল্যাটফর্ম।
            </p>
            <p className="text-[#a8b8a0] leading-[1.9] text-[1.05rem]">
              আমরা বিশ্বাস করি যে খেলার মাঠে যে চরিত্র গড়ে ওঠে, তা জীবনের প্রতিটি ক্ষেত্রে কাজে লাগে। আমাদের জুনিয়র, সিনিয়র এবং গেস্ট — সকল সদস্যরা মিলে এক পরিবার গঠন করেছি।
            </p>
            <p className="text-[#a8b8a0] leading-[1.9] text-[1.05rem]">
              ইফতার পার্টি থেকে ঈদ পুনর্মিলনী, মাঠের লড়াই থেকে টুর্নামেন্টের মঞ্চ — আমরা সবসময় একসাথে।
            </p>
          </div>
        </div>

        {/* Shield SVG */}
        <div className="flex justify-center">
          <div className="w-[280px] h-[320px]">
            <svg viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
              <path
                d="M140 10 L260 55 L260 160 Q260 250 140 310 Q20 250 20 160 L20 55 Z"
                fill="#0d3d22"
                stroke="#c9a227"
                strokeWidth="2.5"
              />
              <path
                d="M140 30 L245 68 L245 160 Q245 238 140 292 Q35 238 35 160 L35 68 Z"
                fill="none"
                stroke="rgba(201,162,39,0.3)"
                strokeWidth="1"
              />
              <line x1="35" y1="160" x2="245" y2="160" stroke="rgba(201,162,39,0.4)" strokeWidth="1.5" />
              <line x1="140" y1="68" x2="140" y2="160" stroke="rgba(201,162,39,0.4)" strokeWidth="1.5" />
              {/* Football */}
              <circle cx="88" cy="114" r="28" fill="none" stroke="rgba(201,162,39,0.5)" strokeWidth="1.5" />
              <polygon
                points="88,86 97,100 113,100 101,110 105,126 88,117 71,126 75,110 63,100 79,100"
                fill="none"
                stroke="rgba(201,162,39,0.7)"
                strokeWidth="1.2"
              />
              {/* Star */}
              <text
                x="192"
                y="124"
                textAnchor="middle"
                fontFamily="Bebas Neue, sans-serif"
                fontSize="44"
                fill="rgba(201,162,39,0.6)"
              >
                ★
              </text>
              {/* Text */}
              <text x="140" y="205" textAnchor="middle" fontFamily="Bebas Neue, sans-serif" fontSize="20" fill="#c9a227" letterSpacing="3">
                AMFFC
              </text>
              <text x="140" y="225" textAnchor="middle" fontFamily="Bebas Neue, sans-serif" fontSize="11" fill="rgba(201,162,39,0.6)" letterSpacing="2">
                AULAI MOHONPUR
              </text>
              <text x="140" y="245" textAnchor="middle" fontFamily="Bebas Neue, sans-serif" fontSize="9" fill="rgba(201,162,39,0.5)" letterSpacing="2">
                FRIEND FOR FUTURE
              </text>
              {/* Ornaments */}
              <circle cx="140" cy="10" r="5" fill="#c9a227" />
              <circle cx="20" cy="55" r="4" fill="rgba(201,162,39,0.5)" />
              <circle cx="260" cy="55" r="4" fill="rgba(201,162,39,0.5)" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
