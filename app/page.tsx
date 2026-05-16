"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user");
    
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Redirect based on role
        if (userData.role === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/member/dashboard");
        }
      } catch {
        router.push("/auth/login");
      }
    } else {
      router.push("/auth/login");
    }
  }, [router]);

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
        <p className="text-gray-600">লোড হচ্ছে...</p>
      </div>
    </main>
  );
}
