"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // Next.js Image component import করা হয়েছে
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Login failed");
        return;
      }

      const data = await response.json();

      // Store user info in localStorage for client-side access
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role
      if (data.user.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        const next =
          typeof window === "undefined"
            ? null
            : new URLSearchParams(window.location.search).get("next");
        router.push(next || "/member/dashboard");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat px-4 relative"
      style={{ backgroundImage: "url('/loginimage.png')" }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-0"></div>

      <Card className="w-full max-w-md z-10 backdrop-blur-lg bg-white/25 dark:bg-black/35 shadow-2xl border-white/20 dark:border-zinc-800/40 transition-all duration-300">
        <CardHeader className="space-y-3 text-center pt-8">
          <div className="flex justify-center mb-1">
            {/* Logo container কেও সামান্য ট্রান্সপারেন্ট করা হয়েছে */}
            <div className="relative w-20 h-20 rounded-full bg-white/80 dark:bg-zinc-900/80 p-2 shadow-md flex items-center justify-center border border-white/40 dark:border-zinc-700/50">
              <Image
                src="/amfff.png"
                alt="FFF Club Logo"
                width={70}
                height={70}
                className="object-cover"
                priority
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                  const fallback = e.currentTarget.nextSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="hidden absolute inset-0 items-center justify-center font-bold text-xl text-primary bg-primary/10 rounded-full">
                FFF
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              Awlai Mohonpur
            </CardTitle>
            <p className="text-sm font-semibold text-primary tracking-wide uppercase">
              Friend For Future Club
            </p>
            {/* টেক্সটের কালার একটু ব্রাইট করা হয়েছে ট্রান্সপারেন্ট ব্যাকগ্রাউন্ডে ভালো দেখানোর জন্য */}
            <CardDescription className="text-zinc-700 dark:text-zinc-300 pt-1">
              Sign in to your account to continue
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50/90 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-md text-red-800 dark:text-red-200 text-sm font-medium">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-zinc-800 dark:text-zinc-200"
              >
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/40 dark:bg-zinc-950/40 border-white/30 dark:border-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-2 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-zinc-800 dark:text-zinc-200"
              >
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-white/40 dark:bg-zinc-950/40 border-white/30 dark:border-zinc-800/50 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-2 backdrop-blur-sm"
              />
            </div>

            <Button
              type="submit"
              className="w-full py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-zinc-800 dark:text-zinc-300">
            Don't have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-primary font-bold hover:underline"
            >
              Register here
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
