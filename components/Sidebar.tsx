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
  Home,
  Image,
  Settings,
  HelpCircle,
  Award,
} from "lucide-react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      // On mobile, sidebar should be closed by default
      if (mobile) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, [setSidebarOpen]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      
      if (response.ok) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
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

  const toggleSidebar = () => {
    if (!isMobile) {
      setCollapsed(!collapsed);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const menuItems = [
    { href: "/admin/dashboard", icon: BarChart3, label: "Dashboard", color: "text-blue-400" },
    { href: "/admin/members", icon: Users, label: "Members", color: "text-green-400" },
    { href: "/admin/events", icon: Calendar, label: "Events", color: "text-purple-400" },
    { href: "/admin/matches", icon: Trophy, label: "Matches", color: "text-orange-400" },
    { href: "/admin/tournaments", icon: Award, label: "Tournaments", color: "text-yellow-400" },
    { href: "/admin/payments", icon: DollarSign, label: "Payments", color: "text-emerald-400" },
    { href: "/admin/expenses", icon: TrendingDown, label: "Expenses", color: "text-rose-400" },
    { href: "/admin/gallery", icon: Image, label: "Gallery", color: "text-pink-400" },
    { href: "/admin/reports", icon: BarChart3, label: "Reports", color: "text-cyan-400" },
  ];

  const isActive = (href: string) => {
    if (href === "/admin/dashboard" && pathname === "/admin/dashboard") return true;
    if (href !== "/admin/dashboard" && pathname.startsWith(href)) return true;
    return false;
  };

  const sidebarWidth = collapsed ? "w-20" : "w-64";
  const shouldShowText = sidebarOpen && !collapsed;

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden animate-fadeIn"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Button */}
      {!sidebarOpen && isMobile && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 p-2 bg-slate-800 rounded-lg shadow-lg lg:hidden"
          aria-label="Open menu"
        >
          <Menu size={24} className="text-white" />
        </button>
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900
          text-white overflow-hidden flex flex-col
          transition-all duration-300 ease-in-out shadow-2xl
          ${isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
          ${isMobile ? "w-64" : sidebarWidth}
        `}
      >
        {/* Header */}
        <div className={`p-4 flex items-center justify-between border-b border-white/10 min-h-[68px] ${!isMobile && collapsed ? "justify-center" : ""}`}>
          {shouldShowText && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Trophy className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Admin Panel
                </h1>
                <p className="text-[10px] text-white/50">Club Management</p>
              </div>
            </div>
          )}
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <Menu size={20} /> : <X size={20} />}
            </button>
          )}
          {isMobile && sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 ml-auto"
              aria-label="Close sidebar"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 mt-6 space-y-1 px-3 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group
                  ${active 
                    ? "bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-600/20" 
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                  }
                  ${!shouldShowText ? "justify-center" : ""}
                `}
                title={!shouldShowText ? item.label : undefined}
              >
                <item.icon 
                  size={20} 
                  className={`shrink-0 transition-transform group-hover:scale-110 ${active ? "text-white" : item.color}`} 
                />
                {shouldShowText && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {active && shouldShowText && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Version Info */}
        {shouldShowText && (
          <div className="px-4 pb-4 pt-2 border-t border-white/10">
            <p className="text-[10px] text-white/30 text-center">
              Version 2.0.0
            </p>
          </div>
        )}
      </aside>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </>
  );
}