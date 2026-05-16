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

interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  location?: string;
  type: string;
  budget: number;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    eventDate: "",
    location: "",
    type: "picnic",
    budget: 0,
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredEvents(filtered);
  }, [searchTerm, events]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/events");
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

  const handleDelete = async (id: string) => {
    if (!confirm("এই ইভেন্ট মুছে দিতে নিশ্চিত?")) return;

    try {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete event");
      setEvents(events.filter((e) => e.id !== id));
    } catch (err) {
      setError("ইভেন্ট মুছতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingId(event.id);
    setFormData({
      name: event.name,
      description: event.description || "",
      eventDate: event.eventDate.split("T")[0],
      location: event.location || "",
      type: event.type,
      budget: event.budget,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      const url = editingId
        ? `/api/admin/events/${editingId}`
        : "/api/admin/events";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to save event");
      setDialogOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        description: "",
        eventDate: "",
        location: "",
        type: "picnic",
        budget: 0,
      });
      await fetchEvents();
    } catch (err) {
      setError("ইভেন্ট সংরক্ষণ করতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  const eventTypes = [
    { value: "picnic", label: "পিকনিক" },
    { value: "eid-reunion", label: "ঈদ পুনর্মিলনী" },
    { value: "cultural", label: "সাংস্কৃতিক অনুষ্ঠান" },
    { value: "training", label: "প্রশিক্ষণ" },
    { value: "other", label: "অন্যান্য" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">ইভেন্ট ব্যবস্থাপনা</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingId(null);
              setFormData({
                name: "",
                description: "",
                eventDate: "",
                location: "",
                type: "picnic",
                budget: 0,
              });
            }}>
              <Plus className="w-4 h-4 mr-2" />
              নতুন ইভেন্ট
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingId ? "ইভেন্ট সম্পাদনা করুন" : "নতুন ইভেন্ট তৈরি করুন"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">ইভেন্টের নাম *</label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="ইভেন্টের নাম"
                />
              </div>
              <div>
                <label className="text-sm font-medium">বর্ণনা</label>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="ইভেন্টের বর্ণনা"
                />
              </div>
              <div>
                <label className="text-sm font-medium">তারিখ *</label>
                <Input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventDate: e.target.value })
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
                  placeholder="ইভেন্টের স্থান"
                />
              </div>
              <div>
                <label className="text-sm font-medium">ধরন</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-md"
                >
                  {eventTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">বাজেট</label>
                <Input
                  type="number"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: parseFloat(e.target.value) })
                  }
                  placeholder="বাজেট"
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
          placeholder="ইভেন্ট খুঁজুন..."
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
            <CardTitle>ইভেন্ট তালিকা ({filteredEvents.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold">নাম</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">তারিখ</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">স্থান</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">ধরন</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold">বাজেট</th>
                    <th className="px-6 py-3 text-center text-sm font-semibold">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredEvents.map((event) => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">{event.name}</td>
                      <td className="px-6 py-4 text-sm">
                        {new Date(event.eventDate).toLocaleDateString("bn-BD")}
                      </td>
                      <td className="px-6 py-4 text-sm">{event.location || "-"}</td>
                      <td className="px-6 py-4 text-sm">{event.type}</td>
                      <td className="px-6 py-4 text-sm">৳{event.budget.toLocaleString()}</td>
                      <td className="px-6 py-4 text-center space-x-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
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
