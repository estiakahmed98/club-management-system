"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LayoutDashboard, LogOut } from "lucide-react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/landing/members", label: "Members" },
  { href: "/landing/aboutus", label: "About Us" },
];

export default function Navbar() {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(
    null,
  );
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const userStr =
      typeof window === "undefined" ? null : window.localStorage.getItem("user");
    if (!userStr) return;

    try {
      const parsed = JSON.parse(userStr) as { id?: string; email?: string; role?: string };
      if (!parsed?.id || !parsed?.email || !parsed?.role) return;
      setUser({ id: parsed.id, email: parsed.email, role: parsed.role });

      if (parsed.role === "member") {
        fetch(`/api/member/profile?userId=${encodeURIComponent(parsed.id)}`)
          .then(async (res) => {
            if (!res.ok) return null;
            return res.json();
          })
          .then((data) => {
            const img = data?.imageUrl as string | undefined;
            if (img) setPhotoUrl(img);
          })
          .catch(() => {
            // ignore
          });
      }
    } catch {
      // ignore
    }
  }, []);

  const dashboardHref =
    user?.role === "admin" ? "/admin/dashboard" : "/member/dashboard";

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore
    } finally {
      localStorage.removeItem("user");
      setUser(null);
      setPhotoUrl(null);
      router.push("/");
    }
  };

  const initials = (email: string) =>
    email
      .split("@")[0]
      .split(/[.\-_ ]+/g)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase())
      .join("") || "U";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-4 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a2e1a]/97 backdrop-blur-md shadow-[0_2px_20px_rgba(0,0,0,0.4)]"
          : "bg-linear-to-b from-[#0a2e1a]/97 to-transparent"
      }`}
    >
      <Link href="/" className="flex items-center gap-3 no-underline group">
        {/* Logo */}

        <Image
          src="/amfff.png"
          alt="AMFF Logo"
          width={72}
          height={72}
          className="object-cover"
          priority
        />

        {/* Text */}
        <div className="leading-none">
          <span
            className="block text-[#c9a227] uppercase"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              letterSpacing: "4px",
            }}
          >
            Friend For Future
          </span>

          <span className="block text-[#a8b8a0] text-[10px] md:text-[11px] tracking-[5px] uppercase mt-1">
            Aulai Mohonpur
          </span>
        </div>
      </Link>

      {/* Desktop links */}
      <ul className="hidden md:flex gap-8 list-none">
        {NAV_LINKS.map((link) => (
          <li key={link.href}>
            {link.href.startsWith("#") ? (
              <a
                href={link.href}
                className="text-[#f5f0e8] text-[13px] tracking-[2px] uppercase font-semibold relative pb-1 no-underline transition-colors hover:text-[#c9a227] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c9a227] after:scale-x-0 after:transition-transform hover:after:scale-x-100"
              >
                {link.label}
              </a>
            ) : (
              <Link
                href={link.href}
                className="text-[#f5f0e8] text-[13px] tracking-[2px] uppercase font-semibold relative pb-1 no-underline transition-colors hover:text-[#c9a227] after:content-[''] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#c9a227] after:scale-x-0 after:transition-transform hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            )}
          </li>
        ))}
      </ul>

      {/* Desktop auth */}
      <div className="hidden md:flex items-center gap-3">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-white/5 text-[#f5f0e8] px-2"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={photoUrl || "/default-player.png"}
                    alt={user.email}
                    className="object-cover object-top"
                  />
                  <AvatarFallback className="bg-white/10 text-[#f5f0e8] text-xs font-semibold">
                    {initials(user.email)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs tracking-[2px] uppercase">
                  Dashboard
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href={dashboardHref} className="cursor-pointer">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Go to Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button
            asChild
            className="bg-linear-to-r from-[#c9a227] to-[#f0c94a] text-[#0a2e1a] hover:from-[#f0c94a] hover:to-[#c9a227] font-bold tracking-wide"
          >
            <Link href="/auth/login">Login</Link>
          </Button>
        )}
      </div>

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
            link.href.startsWith("#") ? (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-6 py-4 text-[#f5f0e8] text-sm tracking-[2px] uppercase font-semibold border-b border-[#c9a227]/10 hover:text-[#c9a227] hover:bg-[#c9a227]/5 transition-colors no-underline"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="px-6 py-4 text-[#f5f0e8] text-sm tracking-[2px] uppercase font-semibold border-b border-[#c9a227]/10 hover:text-[#c9a227] hover:bg-[#c9a227]/5 transition-colors no-underline"
              >
                {link.label}
              </Link>
            )
          ))}

          {user ? (
            <>
              <Link
                href={dashboardHref}
                onClick={() => setMenuOpen(false)}
                className="px-6 py-4 text-[#f5f0e8] text-sm tracking-[2px] uppercase font-semibold border-b border-[#c9a227]/10 hover:text-[#c9a227] hover:bg-[#c9a227]/5 transition-colors no-underline"
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setMenuOpen(false);
                  void logout();
                }}
                className="text-left px-6 py-4 text-[#f5f0e8] text-sm tracking-[2px] uppercase font-semibold hover:text-[#c9a227] hover:bg-[#c9a227]/5 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/auth/login"
              onClick={() => setMenuOpen(false)}
              className="px-6 py-4 text-[#f5f0e8] text-sm tracking-[2px] uppercase font-semibold hover:text-[#c9a227] hover:bg-[#c9a227]/5 transition-colors no-underline"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
