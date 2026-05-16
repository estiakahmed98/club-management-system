"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Edit2, Trash2 } from "lucide-react";

interface Payment {
  id: string;
  name: string;
  email: string;
  amount: number;
  purpose: string;
  description?: string;
  status: string;
  paymentDate: string;
}

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    userId: "",
    amount: 0,
    purpose: "monthly",
    description: "",
    status: "paid",
  });

  useEffect(() => {
    fetchPayments();
    fetchMembers();
  }, []);

  useEffect(() => {
    const filtered = payments.filter(
      (payment) =>
        payment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPayments(filtered);
  }, [searchTerm, payments]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/payments");
      if (!response.ok) throw new Error("Failed to fetch payments");
      const data = await response.json();
      setPayments(data);
    } catch (err) {
      setError("পেমেন্ট লোড করতে ব্যর্থ হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await fetch("/api/admin/members");
      if (!response.ok) throw new Error("Failed to fetch members");
      const data = await response.json();
      setMembers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই পেমেন্ট মুছে দিতে নিশ্চিত?")) return;

    try {
      const response = await fetch(`/api/admin/payments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete payment");
      setPayments(payments.filter((p) => p.id !== id));
    } catch (err) {
      setError("পেমেন্ট মুছতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingId
        ? `/api/admin/payments/${editingId}`
        : "/api/admin/payments";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save payment");
      setDialogOpen(false);
      setEditingId(null);
      setFormData({
        userId: "",
        amount: 0,
        purpose: "monthly",
        description: "",
        status: "paid",
      });
      await fetchPayments();
    } catch (err) {
      setError("পেমেন্ট সংরক্ষণ করতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  const purposeOptions = [
    { value: "monthly", label: "মাসিক" },
    { value: "iftary", label: "ইফতার" },
    { value: "match", label: "ম্যাচ" },
    { value: "event", label: "ইভেন্ট" },
    { value: "tournament", label: "টুর্নামেন্ট" },
    { value: "other", label: "অন্যান্য" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">পেমেন্ট ব্যবস্থাপনা</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingId(null);
              setFormData({
                userId: "",
                amount: 0,
                purpose: "monthly",
                description: "",
                status: "paid",
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন পেমেন্ট
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "পেমেন্ট সম্পাদনা করুন" : "নতুন পেমেন্ট রেকর্ড করুন"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">সদস্য *</label>
                <select
                  value={formData.userId}
                  onChange={(e) =>
                    setFormData({ ...formData, userId: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">সদস্য নির্বাচন করুন</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">পরিমাণ *</label>
                <Input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: parseFloat(e.target.value) })
                  }
                  placeholder="পরিমাণ"
                />
              </div>
              <div>
                <label className="text-sm font-medium">উদ্দেশ্য</label>
                <select
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {purposeOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">বর্ণনা</label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="বর্ণনা"
                />
              </div>
              <div>
                <label className="text-sm font-medium">স্থিতি</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="paid">অর্থপ্রদান করা হয়েছে</option>
                  <option value="pending">অপেক্ষমাণ</option>
                  <option value="cancelled">বাতিল করা হয়েছে</option>
                </select>
              </div>
              <Button onClick={handleSave} className="w-full">
                সংরক্ষণ করুন
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          {error}
        </div>
      )}

      <div className="mb-6">
        <Input
          placeholder="পেমেন্ট খুঁজুন..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">লোড হচ্ছে...</p>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>পেমেন্ট তালিকা ({filteredPayments.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">সদস্য</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">পরিমাণ</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">উদ্দেশ্য</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">তারিখ</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">স্থিতি</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{payment.name}</td>
                      <td className="px-6 py-4 text-sm font-semibold">৳{payment.amount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm">{payment.purpose}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(payment.paymentDate).toLocaleDateString("bn-BD")}
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
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleDelete(payment.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
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
