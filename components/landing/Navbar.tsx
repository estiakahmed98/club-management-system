"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#about", label: "আমরা" },
  { href: "#events", label: "ইভেন্ট" },
  { href: "#matches", label: "ম্যাচ" },
  { href: "#gallery", label: "গ্যালারি" },
  { href: "#members", label: "সদস্য" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a2e1a]/97 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
          : "bg-gradient-to-b from-[#0a2e1a]/97 to-transparent"
      }`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline group">
        <div className="w-12 h-12 rounded-full bg-[#c9a227] flex items-center justify-center font-black text-[#0a2e1a] text-sm tracking-widest shadow-[0_0_0_3px_#0a2e1a,0_0_0_5px_#c9a227] transition-transform group-hover:scale-105">
          AMFF
        </div>
        <div className="leading-tight">
          <span className="block text-[#c9a227] text-lg tracking-[3px] font-black uppercase">
            Friend For Future
          </span>
          <span className="block text-[#a8b8a0] text-[10px] tracking-[4px] uppercase">
            Aulai Mohonpur
          </span>
        </div>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-8 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[#f5f0e8] text-[13px] tracking-[2px] uppercase font-semibold relative pb-1 no-underline transition-colors hover:text-[#c9a227] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c9a227] after:scale-x-0 after:transition-transform hover:after:scale-x-100"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        className="md:hidden text-[#c9a227] text-2xl leading-none"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute top-full left-0 right-0 bg-[#0a2e1a]/98 backdrop-blur-md border-t border-[#c9a227]/20 flex flex-col md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="px-6 py-4 text-[#f5f0e8] text-sm tracking-[2px] uppercase font-semibold border-b border-[#c9a227]/10 hover:text-[#c9a227] hover:bg-[#c9a227]/5 transition-colors no-underline"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
}
