"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin } from "lucide-react";

interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  location?: string;
  type: string;
  budget: number;
  isParticipating?: boolean;
}

export default function MemberEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchEvents(userData.id);
    }
  }, []);

  const fetchEvents = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/member/events?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch events");

      const data = await response.json();
      setEvents(data);
    } catch (err) {
      setError("ইভেন্ট লোড করতে ব্যর্থ হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleParticipate = async (eventId: string) => {
    try {
      if (!user) return;

      const response = await fetch("/api/member/events/participate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, userId: user.id }),
      });

      if (!response.ok) throw new Error("Failed to participate");

      await fetchEvents(user.id);
    } catch (err) {
      setError("অংশগ্রহণ করতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  const eventTypeLabels: Record<string, string> = {
    "picnic": "পিকনিক",
    "eid-reunion": "ঈদ পুনর্মিলনী",
    "cultural": "সাংস্কৃতিক",
    "training": "প্রশিক্ষণ",
    "other": "অন্যান্য",
  };

  if (loading) {
    return <div className="text-center py-12"><p className="text-gray-600">লোড হচ্ছে...</p></div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">ইভেন্ট এবং কার্যক্রম</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          {error}
        </div>
      )}

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-gray-600">কোনো ইভেন্ট পাওয়া যায়নি</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{event.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {event.description && (
                  <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                )}

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                    {new Date(event.eventDate).toLocaleDateString("bn-BD", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  {event.location && (
                    <div className="flex items-center text-sm">
                      <MapPin className="w-4 h-4 mr-2 text-red-600" />
                      {event.location}
                    </div>
                  )}

                  <div className="text-sm text-gray-600">
                    ধরন: {eventTypeLabels[event.type] || event.type}
                  </div>

                  <div className="text-sm text-gray-600">
                    বাজেট: ৳{event.budget.toLocaleString()}
                  </div>
                </div>
              </CardContent>
              <div className="pt-4 border-t">
                {event.isParticipating ? (
                  <div className="px-4 py-2 bg-green-50 rounded text-center text-sm font-medium text-green-800">
                    আপনি অংশগ্রহণ করছেন
                  </div>
                ) : (
                  <Button
                    onClick={() => handleParticipate(event.id)}
                    className="w-full"
                  >
                    অংশগ্রহণ করুন
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
