"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bloodGroup?: string;
  jerseySize?: string;
  address?: string;
  joiningDate: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    jerseySize: "",
    address: "",
  });
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      setUser(userData);
      fetchProfile(userData.id);
    }
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/member/profile?userId=${userId}`);
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        bloodGroup: data.bloodGroup || "",
        jerseySize: data.jerseySize || "",
        address: data.address || "",
      });
    } catch (err) {
      setError("প্রোফাইল লোড করতে ব্যর্থ হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      setError("");
      setSuccess("");

      if (!user || !profile) return;

      const response = await fetch(`/api/member/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          ...formData,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      setSuccess("প্রোফাইল সফলভাবে আপডেট করা হয়েছে");
      setEditing(false);
      await fetchProfile(user.id);
    } catch (err) {
      setError("প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">লোড হচ্ছে...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
        প্রোফাইল খুঁজে পাওয়া যায়নি
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">আপনার প্রোফাইল</h1>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 mb-6">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 mb-6">
          {success}
        </div>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>ব্যক্তিগত তথ্য</CardTitle>
          <Button
            variant={editing ? "destructive" : "default"}
            onClick={() => {
              if (editing) {
                fetchProfile(user.id);
              }
              setEditing(!editing);
            }}
          >
            {editing ? "বাতিল করুন" : "সম্পাদনা করুন"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div>
                <label className="text-sm font-medium">নাম</label>
                {editing ? (
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-2"
                  />
                ) : (
                  <p className="mt-2 text-gray-900">{profile.name}</p>
                )}
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="text-sm font-medium">ইমেইল</label>
                <p className="mt-2 text-gray-900">{profile.email}</p>
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium">ফোন</label>
                {editing ? (
                  <Input
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="mt-2"
                    placeholder="ফোন নম্বর"
                  />
                ) : (
                  <p className="mt-2 text-gray-900">{profile.phone || "-"}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="text-sm font-medium">ঠিকানা</label>
                {editing ? (
                  <Input
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="mt-2"
                    placeholder="আপনার ঠিকানা"
                  />
                ) : (
                  <p className="mt-2 text-gray-900">{profile.address || "-"}</p>
                )}
              </div>

              {/* Blood Group */}
              <div>
                <label className="text-sm font-medium">রক্ত গ্রুপ</label>
                {editing ? (
                  <Input
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, bloodGroup: e.target.value })
                    }
                    className="mt-2"
                    placeholder="A+, B+, O+, ইত্যাদি"
                  />
                ) : (
                  <p className="mt-2 text-gray-900">{profile.bloodGroup || "-"}</p>
                )}
              </div>

              {/* Jersey Size */}
              <div>
                <label className="text-sm font-medium">জার্সি সাইজ</label>
                {editing ? (
                  <Input
                    value={formData.jerseySize}
                    onChange={(e) =>
                      setFormData({ ...formData, jerseySize: e.target.value })
                    }
                    className="mt-2"
                    placeholder="S, M, L, XL"
                  />
                ) : (
                  <p className="mt-2 text-gray-900">{profile.jerseySize || "-"}</p>
                )}
              </div>

              {/* Joining Date */}
              <div>
                <label className="text-sm font-medium">যোগদানের তারিখ</label>
                <p className="mt-2 text-gray-900">
                  {new Date(profile.joiningDate).toLocaleDateString("bn-BD")}
                </p>
              </div>
            </div>

            {editing && (
              <Button onClick={handleUpdate} className="w-full mt-6">
                পরিবর্তন সংরক্ষণ করুন
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
