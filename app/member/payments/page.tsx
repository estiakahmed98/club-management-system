"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

interface Payment {
  id: string;
  amount: number;
  purpose: string;
  description?: string;
  status: string;
  paymentDate: string;
}

export default function MemberPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [user, setUser] = useState<any>(null);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchPayments(userData.id);
    }
  }, []);

  const fetchPayments = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/member/payments?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch payments");

      const data = await response.json();
      setPayments(data.payments || []);
      setTotalPaid(data.totalPaid || 0);
      setTotalPending(data.totalPending || 0);
    } catch (err) {
      setError("পেমেন্ট লোড করতে ব্যর্থ হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const purposeLabels: Record<string, string> = {
    "monthly": "মাসিক",
    "iftary": "ইফতার",
    "match": "ম্যাচ",
    "event": "ইভেন্ট",
    "tournament": "টুর্নামেন্ট",
    "other": "অন্যান্য",
  };

  const filteredPayments = payments.filter((payment) =>
    payment.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">লোড হচ্ছে...</p></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">পেমেন্ট ইতিহাস</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">অর্থপ্রদান করা</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              ৳{totalPaid.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">অপেক্ষমাণ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              ৳{totalPending.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="mb-6">
        <Input
          placeholder="উদ্দেশ্য অনুযায়ী খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Payments List */}
      {filteredPayments.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-600">কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">তারিখ</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">উদ্দেশ্য</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">পরিমাণ</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">স্থিতি</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        {new Date(payment.paymentDate).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {purposeLabels[payment.purpose] || payment.purpose}
                        {payment.description && (
                          <p className="text-xs text-gray-600">{payment.description}</p>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold">
                        ৳{payment.amount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            payment.status === "paid"
                              ? "bg-green-100 text-green-800"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {payment.status === "paid"
                            ? "অর্থপ্রদান"
                            : payment.status === "pending"
                            ? "অপেক্ষমাণ"
                            : "বাতিল"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
