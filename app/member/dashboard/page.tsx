"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Trophy, DollarSign, User } from "lucide-react";

interface MemberStats {
  memberName: string;
  email: string;
  totalPayments: number;
  totalEvents: number;
  totalMatches: number;
  recentPayments: Array<{ id: string; amount: number; purpose: string; date: string }>;
}

export default function MemberDashboard() {
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchStats(userData.id);
    }
  }, []);

  const fetchStats = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/member/stats?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch stats");

      const data = await response.json();
      setStats(data);
    } catch (err) {
      setError("পরিসংখ্যান লোড করতে ব্যর্থ হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">স্বাগতম, {stats?.memberName}!</h1>
        <p className="text-gray-600">আপনার ক্লাব প্রোফাইল এবং কার্যকলাপ এখানে দেখুন</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          {error}
        </div>
      )}

      {stats && (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">মোট অবদান</CardTitle>
                <DollarSign className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">৳{stats.totalPayments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">সকল সময়ে</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">অংশগৃহীত ইভেন্ট</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalEvents}</div>
                <p className="text-xs text-muted-foreground">ইভেন্টে উপস্থিত</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">খেলার অংশ</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMatches}</div>
                <p className="text-xs text-muted-foreground">ম্যাচে খেলেছেন</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Links */}
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">দ্রুত লিঙ্ক</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/member/profile">
                <Button variant="outline" className="w-full justify-start">
                  <User className="w-4 h-4 mr-2" />
                  আপনার প্রোফাইল দেখুন
                </Button>
              </Link>
              <Link href="/member/payments">
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="w-4 h-4 mr-2" />
                  পেমেন্ট ইতিহাস
                </Button>
              </Link>
              <Link href="/member/events">
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  আসন্ন ইভেন্ট
                </Button>
              </Link>
              <Link href="/member/matches">
                <Button variant="outline" className="w-full justify-start">
                  <Trophy className="w-4 h-4 mr-2" />
                  আসন্ন ম্যাচ
                </Button>
              </Link>
            </div>
          </div>

          {/* Recent Payments */}
          {stats.recentPayments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>সাম্প্রতিক পেমেন্ট</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentPayments.slice(0, 5).map((payment) => (
                    <div key={payment.id} className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium text-sm">{payment.purpose}</p>
                        <p className="text-xs text-gray-600">
                          {new Date(payment.date).toLocaleDateString("bn-BD")}
                        </p>
                      </div>
                      <p className="font-semibold text-green-600">
                        ৳{payment.amount.toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
