"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
        setError(data.error || "লগইন ব্যর্থ হয়েছে");
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
      setError("একটি ত্রুটি ঘটেছে। আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">ক্লাব ম্যানেজমেন্ট সিস্টেম</CardTitle>
          <CardDescription>আপনার অ্যাকাউন্টে লগইন করুন</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-800 text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                ইমেইল
              </label>
              <Input
                id="email"
                type="email"
                placeholder="আপনার ইমেইল"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                পাসওয়ার্ড
              </label>
              <Input
                id="password"
                type="password"
                placeholder="আপনার পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
            </Button>
          </form>

          <div className="mt-4 text-center text-sm">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/auth/signup" className="text-primary hover:underline">
              এখানে নিবন্ধন করুন
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs">
            <p className="font-semibold text-blue-900 mb-1">ডেমো সংগ্রহস্থল:</p>
            <p className="text-blue-800">ইমেইল: admin@fff.local</p>
            <p className="text-blue-800">পাসওয়ার্ড: admin12345</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
