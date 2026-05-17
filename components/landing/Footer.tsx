"use client";

import Link from "next/link";
import {
  Facebook,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  Trophy,
  Heart,
} from "lucide-react";

const LINKS = [
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#matches", label: "Matches" },
  { href: "#gallery", label: "Gallery" },
  { href: "#members", label: "Members" },
];

const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

const CONTACT_INFO = [
  { icon: MapPin, text: "Aulai Mohonpur, Jamalpur Sadar, Jamalpur" },
  { icon: Phone, text: "+880 1720151612" },
  { icon: Mail, text: "ffclub@gmail.com" },
];

export default function Footer() {
  return (
    <footer className="relative bg-linear-to-b from-[#0a2e1a] to-[#071f12] border-t border-[#c9a227]/20 pt-16 pb-8 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-[#c9a227]/5 rounded-full blur-3xl -translate-x-32 -translate-y-32" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#c9a227]/5 rounded-full blur-3xl translate-x-32 translate-y-32" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#c9a227] flex items-center justify-center">
                <img src="/logo.png" alt="" />
              </div>
              <div>
                <div
                  className="text-[#c9a227] tracking-[2px] font-black"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.5rem",
                  }}
                >
                  Aulai Mohonpur
                </div>
                <div className="text-[#a8b8a0] text-[8px] tracking-[3px] uppercase">
                  FRIEND FOR FUTURE CLUB
                </div>
              </div>
            </div>
            <p className="text-[#a8b8a0]/70 text-sm leading-relaxed">
              Building a community through sports, unity, and friendship. Join
              us in our journey to excellence.
            </p>
            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {SOCIAL_LINKS.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-[#a8b8a0] hover:bg-[#c9a227] hover:text-[#0a2e1a] transition-all duration-300 hover:scale-110"
                    aria-label={social.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase border-l-3 border-[#c9a227] pl-3">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-[#a8b8a0] text-sm hover:text-[#c9a227] transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-[#c9a227] transition-all duration-200" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase border-l-3 border-[#c9a227] pl-3">
              Contact Us
            </h3>
            <ul className="space-y-3">
              {CONTACT_INFO.map((info, index) => {
                const Icon = info.icon;
                return (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-[#a8b8a0] text-sm"
                  >
                    <Icon className="w-4 h-4 text-[#c9a227] shrink-0" />
                    <span>{info.text}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-4">
            <h3 className="text-white text-sm font-semibold tracking-wider uppercase border-l-3 border-[#c9a227] pl-3">
              Stay Connected
            </h3>
            <p className="text-[#a8b8a0] text-sm">
              Subscribe to get updates about events, matches, and club news.
            </p>
            <div className="flex flex-col gap-3">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-white/5 border border-[#c9a227]/20 rounded-l-lg text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[#c9a227] transition-colors"
                />
                <button className="px-4 py-2 bg-[#c9a227] text-[#0a2e1a] font-semibold text-sm rounded-r-lg hover:bg-[#f0c94a] transition-colors">
                  Subscribe
                </button>
              </div>
              <p className="text-[#a8b8a0]/50 text-[10px]">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#c9a227]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="text-[#a8b8a0]/50 text-xs">
            © {new Date().getFullYear()} Aulai Mohonpur Friend For Future Club.
            All Rights Reserved.
          </div>
          <div className="flex items-center gap-2 text-[#a8b8a0]/50 text-xs">
            <span>Made with</span>
            <Heart className="w-3 h-3 text-red-500 fill-red-500" />
            <span>for the community</span>
          </div>
          <div className="flex gap-4 text-[10px]">
            <a
              href="#"
              className="text-[#a8b8a0]/50 hover:text-[#c9a227] transition-colors"
            >
              Privacy Policy
            </a>
            <span className="text-[#a8b8a0]/20">|</span>
            <a
              href="#"
              className="text-[#a8b8a0]/50 hover:text-[#c9a227] transition-colors"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
