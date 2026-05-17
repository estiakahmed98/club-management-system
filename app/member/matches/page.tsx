"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Users } from "lucide-react";

interface Match {
  id: string;
  name: string;
  opponent: string;
  matchDate: string;
  location?: string;
  matchType: string;
  result?: string;
  score?: string;
  isParticipating?: boolean;
}

export default function MemberMatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchMatches(userData.id);
    }
  }, []);

  const fetchMatches = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/member/matches?userId=${userId}`);
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

  const handleRegister = async (matchId: string) => {
    try {
      if (!user) return;

      const response = await fetch("/api/member/matches/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, userId: user.id }),
      });

      if (!response.ok) throw new Error("Failed to register");

      await fetchMatches(user.id);
    } catch (err) {
      setError("নিবন্ধন করতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  const matchTypeLabels: Record<string, string> = {
    "friendly": "বন্ধুত্বপূর্ণ",
    "league": "লীগ",
    "tournament": "টুর্নামেন্ট",
    "other": "অন্যান্য",
  };

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">লোড হচ্ছে...</p></div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">ম্যাচ এবং প্রতিযোগিতা</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          {error}
        </div>
      )}

      {matches.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-600">কোনো ম্যাচ পাওয়া যায়নি</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((match) => {
            const matchDate = new Date(match.matchDate);
            const isUpcoming = matchDate > new Date();

            return (
              <Card key={match.id} className={`flex flex-col ${!isUpcoming ? "opacity-75" : ""}`}>
                <CardHeader>
                  <CardTitle className="text-lg">{match.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-3 mb-4">
                    {/* Opponents */}
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between text-center">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">আমাদের দল</p>
                        </div>
                        <Users className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{match.opponent}</p>
                        </div>
                      </div>
                    </div>

                    {/* Date and Time */}
                    <div className="flex items-center text-sm">
                      <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                      {matchDate.toLocaleDateString("bn-BD", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    {/* Location */}
                    {match.location && (
                      <div className="text-sm text-gray-600">
                        স্থান: {match.location}
                      </div>
                    )}

                    {/* Match Type */}
                    <div className="text-sm text-gray-600">
                      ধরন: {matchTypeLabels[match.matchType] || match.matchType}
                    </div>

                    {/* Result */}
                    {match.result && !isUpcoming && (
                      <div className={`text-sm font-medium p-2 rounded ${
                        match.result === "win"
                          ? "bg-green-100 text-green-800"
                          : match.result === "loss"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        ফলাফল: {match.result === "win" ? "জয়" : match.result === "loss" ? "পরাজয়" : "ড্র"}
                        {match.score && ` (${match.score})`}
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="pt-4 border-t">
                  {match.isParticipating ? (
                    <div className="px-4 py-2 bg-green-50 rounded text-center text-sm font-medium text-green-800">
                      আপনি খেলছেন
                    </div>
                  ) : isUpcoming ? (
                    <Button
                      onClick={() => handleRegister(match.id)}
                      className="w-full"
                    >
                      খেলতে রেজিস্টার করুন
                    </Button>
                  ) : (
                    <div className="px-4 py-2 bg-gray-50 rounded text-center text-sm font-medium text-gray-600">
                      ম্যাচ শেষ হয়েছে
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
