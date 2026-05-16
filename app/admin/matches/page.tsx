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

interface Match {
  id: string;
  name: string;
  opponent: string;
  matchDate: string;
  location?: string;
  matchType: string;
  result?: string;
  score?: string;
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    opponent: "",
    matchDate: "",
    location: "",
    matchType: "friendly",
    result: "",
    score: "",
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    const filtered = matches.filter(
      (match) =>
        match.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        match.opponent.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMatches(filtered);
  }, [searchTerm, matches]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/matches");
      if (!response.ok) throw new Error("Failed to fetch matches");
      const data = await response.json();
      setMatches(data);
    } catch (err) {
      setError("ম্যাচ লোড করতে ব্যর্থ হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("এই ম্যাচ মুছে দিতে নিশ্চিত?")) return;

    try {
      const response = await fetch(`/api/admin/matches/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete match");
      setMatches(matches.filter((m) => m.id !== id));
    } catch (err) {
      setError("ম্যাচ মুছতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  const handleEdit = (match: Match) => {
    setEditingId(match.id);
    setFormData({
      name: match.name,
      opponent: match.opponent,
      matchDate: match.matchDate.split("T")[0],
      location: match.location || "",
      matchType: match.matchType,
      result: match.result || "",
      score: match.score || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = editingId
        ? `/api/admin/matches/${editingId}`
        : "/api/admin/matches";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save match");
      setDialogOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        opponent: "",
        matchDate: "",
        location: "",
        matchType: "friendly",
        result: "",
        score: "",
      });
      await fetchMatches();
    } catch (err) {
      setError("ম্যাচ সংরক্ষণ করতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  const matchTypes = [
    { value: "friendly", label: "বন্ধুত্বপূর্ণ" },
    { value: "league", label: "লীগ" },
    { value: "tournament", label: "টুর্নামেন্ট" },
    { value: "other", label: "অন্যান্য" },
  ];

  const results = [
    { value: "win", label: "জয়" },
    { value: "loss", label: "পরাজয়" },
    { value: "draw", label: "ড্র" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">ম্যাচ ব্যবস্থাপনা</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                opponent: "",
                matchDate: "",
                location: "",
                matchType: "friendly",
                result: "",
                score: "",
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন ম্যাচ
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "ম্যাচ সম্পাদনা করুন" : "নতুন ম্যাচ যোগ করুন"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">ম্যাচের নাম *</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ম্যাচের নাম"
                />
              </div>
              <div>
                <label className="text-sm font-medium">প্রতিপক্ষী দল *</label>
                <Input
                  value={formData.opponent}
                  onChange={(e) =>
                    setFormData({ ...formData, opponent: e.target.value })
                  }
                  placeholder="প্রতিপক্ষী দল"
                />
              </div>
              <div>
                <label className="text-sm font-medium">তারিখ *</label>
                <Input
                  type="date"
                  value={formData.matchDate}
                  onChange={(e) =>
                    setFormData({ ...formData, matchDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">স্থান</label>
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="ম্যাচের স্থান"
                />
              </div>
              <div>
                <label className="text-sm font-medium">ধরন</label>
                <select
                  value={formData.matchType}
                  onChange={(e) =>
                    setFormData({ ...formData, matchType: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {matchTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">ফলাফল</label>
                <select
                  value={formData.result}
                  onChange={(e) =>
                    setFormData({ ...formData, result: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="">ফলাফল নির্বাচন করুন</option>
                  {results.map((result) => (
                    <option key={result.value} value={result.value}>
                      {result.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">স্কোর</label>
                <Input
                  value={formData.score}
                  onChange={(e) =>
                    setFormData({ ...formData, score: e.target.value })
                  }
                  placeholder="যেমন: 3-2"
                />
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
          placeholder="ম্যাচ খুঁজুন..."
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
            <CardTitle>ম্যাচ তালিকা ({filteredMatches.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">নাম</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">প্রতিদ্বন্দ্বী</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">তারিখ</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ধরন</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ফলাফল</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredMatches.map((match) => (
                    <tr key={match.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{match.name}</td>
                      <td className="px-6 py-4 text-sm">{match.opponent}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(match.matchDate).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-6 py-4 text-sm">{match.matchType}</td>
                      <td className="px-6 py-4 text-sm">
                        {match.result || "-"} {match.score ? `(${match.score})` : ""}
                      </td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(match)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(match.id)}
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
