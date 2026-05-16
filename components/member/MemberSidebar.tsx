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
  Image,
  Users,
  Settings,
  HelpCircle,
  TrendingUp,
  CreditCard,
  Activity,
} from "lucide-react";

interface MemberSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    section: "Main",
    items: [
      { name: "Dashboard", href: "/member/dashboard", icon: LayoutDashboard },
      { name: "My Profile", href: "/member/profile", icon: UserCircle },
      { name: "Events", href: "/member/events", icon: Calendar },
      { name: "Matches", href: "/member/matches", icon: Trophy },
    ],
  },
  {
    section: "Finance",
    items: [
      { name: "Payments", href: "/member/payments", icon: DollarSign },
      { name: "My Expenses", href: "/member/expenses", icon: CreditCard },
      { name: "Payment History", href: "/member/payment-history", icon: TrendingUp },
    ],
  },
  {
    section: "Community",
    items: [
      { name: "Gallery", href: "/member/gallery", icon: Image },
      { name: "Members", href: "/member/members", icon: Users },
      { name: "Activities", href: "/member/activities", icon: Activity },
    ],
  },
  {
    section: "Support",
    items: [
      { name: "Help", href: "/member/help", icon: HelpCircle },
      { name: "Settings", href: "/member/settings", icon: Settings },
    ],
  },
];

export function MemberSidebar({ isOpen, onClose }: MemberSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Overlay */}
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
          h-screen bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900
          transition-all duration-300 ease-in-out
          flex flex-col
          ${isOpen ? "w-64" : "w-0 lg:w-20"}
          overflow-hidden
        `}
      >
        {/* Logo Section */}
        <div className={`flex items-center h-16 px-4 border-b border-gray-700 ${!isOpen && "lg:justify-center"}`}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            {(isOpen || window.innerWidth >= 1024) && (
              <span className="font-bold text-lg text-white whitespace-nowrap">
                ClubManager
              </span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((section) => (
            <div key={section.section} className="mb-6">
              {/* Section Title */}
              {(isOpen || window.innerWidth >= 1024) && (
                <div className="px-4 mb-2">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {section.section}
                  </p>
                </div>
              )}
              
              {/* Menu Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className={`
                        flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg
                        transition-all duration-200 group
                        ${active 
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                          : "text-gray-300 hover:bg-gray-700/50 hover:text-white"
                        }
                        ${!isOpen && "lg:justify-center lg:px-2"}
                      `}
                    >
                      <Icon className={`h-5 w-5 flex-shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-white"}`} />
                      {(isOpen || window.innerWidth >= 1024) && (
                        <span className="text-sm font-medium whitespace-nowrap">
                          {item.name}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Section */}
        <div className="p-4 border-t border-gray-700">
          <div className={`flex items-center gap-3 ${!isOpen && "lg:justify-center"}`}>
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-bold">U</span>
            </div>
            {(isOpen || window.innerWidth >= 1024) && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">Member User</p>
                <p className="text-xs text-gray-400 truncate">Premium Member</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}