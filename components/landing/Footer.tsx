const LINKS = [
  { href: "#about", label: "About" },
  { href: "#events", label: "Events" },
  { href: "#matches", label: "Matches" },
  { href: "#gallery", label: "Gallery" },
  { href: "#members", label: "Members" },
];

export default function Footer() {
  return (
    <footer className="bg-black/50 border-t border-[#c9a227]/15 py-12 px-6 text-center">
      <div
        className="text-[#c9a227] tracking-[4px] mb-1"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "2rem" }}
      >
        Aulai Mohonpur FFF Club
      </div>

      <div className="text-[#a8b8a0] text-[11px] tracking-[4px] uppercase mb-8">
        Unity · Passion · Future
      </div>

      <ul className="flex justify-center gap-8 list-none mb-8 flex-wrap">
        {LINKS.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className="text-[#a8b8a0] text-xs tracking-[2px] uppercase no-underline transition-colors hover:text-[#c9a227]"
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <div className="text-[#a8b8a0]/50 text-xs">
        © {new Date().getFullYear()} Aulai Mohonpur Friend For Future Club • All Rights Reserved
      </div>
    </footer>
  );
}