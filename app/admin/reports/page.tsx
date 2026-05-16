"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ReportData {
  totalMembers: number;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  totalEvents: number;
  totalMatches: number;
  memberPayments: Array<{ name: string; amount: number }>;
  monthlyIncome: Array<{ month: string; income: number }>;
  expensesByCategory: Array<{ category: string; amount: number }>;
}

export default function ReportsPage() {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/reports");
      if (!response.ok) throw new Error("Failed to fetch report data");

      const data = await response.json();
      setReportData(data);
    } catch (err) {
      setError("রিপোর্ট লোড করতে ব্যর্থ হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">রিপোর্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
        {error}
      </div>
    );
  }

  if (!reportData) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">রিপোর্ট এবং বিশ্লেষণ</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">মোট সদস্য</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{reportData.totalMembers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">মোট আয়</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ৳{reportData.totalIncome.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">মোট খরচ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              ৳{reportData.totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">নেট ব্যালেন্স</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-3xl font-bold ${
                reportData.balance >= 0 ? "text-blue-600" : "text-red-600"
              }`}
            >
              ৳{reportData.balance.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>কার্যকলাপ সংক্ষিপ্ত</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">মোট ইভেন্ট</span>
                <span className="text-xl font-bold">{reportData.totalEvents}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">মোট ম্যাচ</span>
                <span className="text-xl font-bold">{reportData.totalMatches}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">আয়ের অনুপাত</span>
                <span className="text-xl font-bold">
                  {reportData.totalExpenses > 0
                    ? ((reportData.totalIncome / (reportData.totalIncome + reportData.totalExpenses)) * 100).toFixed(1)
                    : "N/A"}
                  %
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>খরচ বিভাজন</CardTitle>
          </CardHeader>
          <CardContent>
            {reportData.expensesByCategory.length > 0 ? (
              <div className="space-y-3">
                {reportData.expensesByCategory.map((expense, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-gray-600">{expense.category}</span>
                    <span className="font-semibold">
                      ৳{expense.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">খরচ ডেটা উপলব্ধ নেই</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      {reportData.monthlyIncome.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>মাসিক আয়</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={reportData.monthlyIncome}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="income" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Top Members by Payment */}
      {reportData.memberPayments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>শীর্ষ অবদানকারী সদস্য</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportData.memberPayments.slice(0, 10).map((member, idx) => (
                <div key={idx} className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">{idx + 1}. {member.name}</span>
                  <span className="text-green-600 font-semibold">
                    ৳{member.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
