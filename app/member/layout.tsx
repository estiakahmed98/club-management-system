"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, LayoutDashboard, UserCircle, Calendar, Trophy, DollarSign } from "lucide-react";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      router.push("/auth/login");
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      if (userData.role === "admin") {
        router.push("/admin/dashboard");
        return;
      }
      setUser(userData);
    } catch {
      router.push("/auth/login");
    }
    setLoading(false);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <p className="text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-blue-900 text-white transition-all duration-300 overflow-y-auto`}
      >
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold">ক্লাব</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-blue-800 rounded-lg"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-2">
          <Link
            href="/member/dashboard"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>ড্যাশবোর্ড</span>}
          </Link>

          <Link
            href="/member/profile"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            <UserCircle size={20} />
            {sidebarOpen && <span>আমার প্রোফাইল</span>}
          </Link>

          <Link
            href="/member/events"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            <Calendar size={20} />
            {sidebarOpen && <span>ইভেন্ট</span>}
          </Link>

          <Link
            href="/member/matches"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            <Trophy size={20} />
            {sidebarOpen && <span>ম্যাচ</span>}
          </Link>

          <Link
            href="/member/payments"
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-800 transition"
          >
            <DollarSign size={20} />
            {sidebarOpen && <span>পেমেন্ট ইতিহাস</span>}
          </Link>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-900 transition text-white"
          >
            <LogOut size={20} />
            {sidebarOpen && <span>লগ আউট করুন</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
