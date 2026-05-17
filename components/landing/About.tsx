import SectionHeader from "./SectionHeader";
import Image from "next/image";

export default function About() {
  return (
    <section 
      id="about" 
      className="bg-[#0a2e1a] py-20 md:py-24 px-6 md:px-10 relative overflow-hidden"
    >
      {/* 1. EMOTIONAL OVERLAY: Subtle atmospheric glow */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-[#0d3d22] to-transparent opacity-60"></div>
      
      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-20 items-center">
        {/* TEXT SECTION */}
        <div className="space-y-6">
          <SectionHeader 
            tag="A Legacy Built on Friendship" 
            title={"More Than A Club.\nA Family.\nA Future."} 
          />
          
          <div 
            className="space-y-6 mt-6 border-l-2 border-[#c9a227]/30 pl-6" 
            style={{ fontFamily: "'Tiro Bangla', serif" }}
          >
            <p className="text-[#a8b8a0] leading-[2.1] text-[1.1rem]">
              The{" "}
              <span className="text-[#c9a227] font-semibold">
                Aulai Mohonpur Friend For Future Club (AMFFF)
              </span>{" "}
              isn't just an organization; it’s a living dream etched in the soul
              of our community. We are a collective promise to our own youth, a
              unique platform fueled by the unbreakable bonds of friendship,
              deep unity, and the unwavering conviction that{" "}
              <span className="text-white">together, we build better.</span>
            </p>
            
            <p className="text-[#a8b8a0] leading-[2.1] text-[1.1rem]">
              We believe the character forged on the field applies to every
              battlefield in life—integrity, humility, and raw passion. In this
              club, the hierarchy of Junior, Senior, and Guest members dissolves
              into a single, profound truth:{" "}
              <span className="font-bold text-[#f5f5f5]">
                We are One Family.
              </span>
            </p>
            
            <p className="text-[#a8b8a0] leading-[2.1] text-[1.1rem]">
              Our story is written in the joy of shared Iftar tables, the warmth
              of Eid reunions, and the sweat and tears from tournament battles.{" "}
              <span className="text-white/90">
                When we win, we win together. When we face challenges, we face
                them together. We are eternally bound.
              </span>
            </p>
          </div>
        </div>

        {/* EMBLEM & LOGO SECTION (NO SVG) */}
        <div className="flex justify-center md:justify-end relative">
          <img src="/logo.png" alt="AMFFF Club Logo" className="w-48 h-48" />
        </div>
      </div>
    </section>
  );
}
