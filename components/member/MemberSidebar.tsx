// components/member/MemberSidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserCircle,
  Calendar,
  Trophy,
  DollarSign,
} from "lucide-react";

interface MemberSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const menuItems = [
  { name: "Dashboard", href: "/member/dashboard", icon: LayoutDashboard },
  { name: "Profile", href: "/member/profile", icon: UserCircle },
  { name: "Events", href: "/member/events", icon: Calendar },
  { name: "Matches", href: "/member/matches", icon: Trophy },
  { name: "Payments", href: "/member/payments", icon: DollarSign },
];

export function MemberSidebar({ isOpen, onClose }: MemberSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Overlay - only shows on mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen bg-linear-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "w-64" : "w-0 lg:w-64"}
          overflow-hidden
          ${!isOpen && "lg:overflow-visible lg:w-64"}
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center h-16 px-4 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-linear-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center shrink-0">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-white whitespace-nowrap">
              Member Portal
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    // Only close sidebar on mobile
                    if (window.innerWidth < 1024 && onClose) {
                      onClose();
                    }
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg
                    transition-all duration-200 group
                    ${active 
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                      : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                  <span className="text-sm font-medium whitespace-nowrap">
                    {item.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-r from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Member User</p>
              <p className="text-xs text-gray-400 truncate">Premium Member</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}