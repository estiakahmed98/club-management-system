"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  LogOut,
  Users,
  Calendar,
  Trophy,
  DollarSign,
  BarChart3,
  TrendingDown,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is lg breakpoint
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      
      if (response.ok) {
        localStorage.removeItem("user");
        router.push("/auth/login");
      } else {
        console.error("Logout failed:", await response.text());
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleLinkClick = () => {
    // Only close sidebar on mobile devices
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  const menuItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard" },
    { href: "/admin/members", icon: Users, label: "Members" },
    { href: "/admin/events", icon: Calendar, label: "Events" },
    { href: "/admin/matches", icon: Trophy, label: "Matches" },
    { href: "/admin/tournaments", icon: Trophy, label: "Tournaments" },
    { href: "/admin/payments", icon: DollarSign, label: "Payments" },
    { href: "/admin/expenses", icon: TrendingDown, label: "Expenses" },
    { href: "/admin/reports", icon: BarChart3, label: "Reports" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard" && pathname === "/admin/dashboard") return true;
    if (href !== "/admin/dashboard" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen
          bg-linear-to-b from-slate-900 to-slate-800
          text-white
          overflow-y-auto flex flex-col
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-20"}
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Header */}
        <div className="p-4 flex items-center justify-between border-b border-slate-700/50 min-h-[68px]">
          {sidebarOpen && (
            <h1 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors ml-auto"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-6 space-y-1 px-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
                  ${active 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }
                  ${!sidebarOpen ? "justify-center" : ""}
                `}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon size={20} className="shrink-0" />
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-slate-700/50 mt-auto">
          <button
            onClick={handleLogout}
            className={`
              w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200
              text-red-300 hover:bg-red-900/50 hover:text-red-100
              ${!sidebarOpen ? "justify-center" : ""}
            `}
            title={!sidebarOpen ? "Logout" : undefined}
          >
            <LogOut size={20} className="shrink-0" />
            {sidebarOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}