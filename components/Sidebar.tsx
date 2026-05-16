"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
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

  return (
    <aside
      className={`${
        sidebarOpen ? "w-64" : "w-20"
      } bg-slate-900 text-white transition-all duration-300 overflow-y-auto flex flex-col h-full`}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-slate-800">
        {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-slate-800 rounded-lg transition"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 mt-8 space-y-2 px-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-slate-800 transition group relative"
          >
            <item.icon size={20} className="shrink-0" />

            {sidebarOpen && <span>{item.label}</span>}

            {!sidebarOpen && (
              <span className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-sm rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900 transition text-white group relative"
        >
          <LogOut size={20} className="shrink-0" />

          {sidebarOpen && <span>Logout</span>}

          {!sidebarOpen && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-red-900 text-sm rounded opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap z-50">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
}
