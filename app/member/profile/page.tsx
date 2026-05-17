"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  Shirt,
  Calendar,
  Award,
  Footprints,
  Target,
  Trophy,
  TrendingUp,
  Edit2,
  Users,
  Camera,
  X,
  Save,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

/* ─── Types ─────────────────────────────────────────── */
interface MemberProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bloodGroup?: string;
  jerseySize?: string;
  jerseyNumber?: string;
  address?: string;
  bio?: string;
  imageUrl?: string | null;
  joiningDate: string;
  playsFootball: boolean;
  footballPosition?: string;
  playsCricket: boolean;
  cricketRole?: string;
  rating: number;
  teamCategory: "JUNIOR" | "SENIOR" | "GUEST";
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const jerseySizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const footballPositions = [
  "Goalkeeper",
  "Defender",
  "Midfielder",
  "Forward",
  "Winger",
];
const cricketRoles = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];
const teamCategories = [
  { value: "JUNIOR", label: "Junior" },
  { value: "SENIOR", label: "Senior" },
  { value: "GUEST", label: "Guest" },
];

/* ─── Main Component ─────────────────────────────────── */
export default function PlayerProfile() {
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "stats">("info");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    bloodGroup: "",
    jerseySize: "",
    jerseyNumber: "",
    address: "",
    bio: "",
    imageUrl: "",
    playsFootball: true,
    footballPosition: "",
    playsCricket: false,
    cricketRole: "",
    teamCategory: "JUNIOR" as "JUNIOR" | "SENIOR" | "GUEST",
  });

  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const userStr = localStorage.getItem("user");
      if (!userStr) {
        router.push("/auth/login");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id;

      if (!userId) {
        setError("User not found. Please login again.");
        return;
      }

      const response = await fetch(`/api/member/profile?userId=${userId}`);

      if (!response.ok) {
        if (response.status === 401) {
          router.push("/auth/login");
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data);
      setFormData({
        name: data.name || "",
        phone: data.phone || "",
        bloodGroup: data.bloodGroup || "",
        jerseySize: data.jerseySize || "",
        jerseyNumber: data.jerseyNumber || "",
        address: data.address || "",
        bio: data.bio || "",
        imageUrl: data.imageUrl || "",
        playsFootball: data.playsFootball ?? true,
        footballPosition: data.footballPosition || "",
        playsCricket: data.playsCricket ?? false,
        cricketRole: data.cricketRole || "",
        teamCategory: data.teamCategory || "JUNIOR",
      });
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setImageUploading(true);
      const uploadForm = new FormData();
      uploadForm.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadForm,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Failed to upload image");
      }

      const fileUrl = data?.fileUrl as string | undefined;
      if (!fileUrl) {
        throw new Error("Upload succeeded but no file URL returned");
      }

      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
      toast({
        title: "Success",
        description: "Profile photo uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      if (imageUploading) {
        toast({
          title: "Please wait",
          description: "Image upload is still in progress",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`/api/member/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile?.id,
          ...formData,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      setEditModalOpen(false);
      await fetchProfile();
    } catch (err) {
      console.error("Error updating profile:", err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleEdit = () => {
    setEditModalOpen(true);
  };

  const getTeamCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      JUNIOR:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      SENIOR:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      GUEST: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error || "Profile not found"}
          </p>
          <Button onClick={() => router.push("/member/dashboard")}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const joinDate = new Date(profile.joiningDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Calculate stats based on rating
  const calculatedStats = {
    goals: Math.floor((profile.rating / 10) * 24 * 0.8),
    assists: Math.floor((profile.rating / 10) * 24 * 0.5),
    matches: 24,
    goalsPerMatch: parseFloat(((profile.rating / 10) * 0.8).toFixed(1)),
    shooting: Math.min(95, Math.floor(profile.rating * 10)),
    passing: Math.min(92, Math.floor(profile.rating * 9.5)),
    dribbling: Math.min(90, Math.floor(profile.rating * 9.3)),
    defense: Math.min(85, Math.floor(profile.rating * 8.5)),
    pace: Math.min(88, Math.floor(profile.rating * 9)),
  };

  return (
    <div className="p-8">
      {/* Main Content - 2 Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Profile Photo & Basic Info */}
        <div className="space-y-6">
          {/* Profile Photo Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-lg mb-4">
                  {profile.imageUrl ? (
                    <img
                      src={profile.imageUrl}
                      alt={profile.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl font-bold text-gray-400">
                      {profile.name?.charAt(0)?.toUpperCase()}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.name}
                </h3>
                <Badge
                  className={`mt-2 ${getTeamCategoryColor(profile.teamCategory)}`}
                >
                  {profile.teamCategory.charAt(0) +
                    profile.teamCategory.slice(1).toLowerCase()}
                </Badge>
                {profile.rating > 0 && (
                  <div className="flex items-center gap-1 mt-3">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Rating: {profile.rating.toFixed(1)} / 10.0
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <Target className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calculatedStats.goals}
                  </p>
                  <p className="text-xs text-gray-500">Goals</p>
                </div>
                <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Users className="w-5 h-5 text-green-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calculatedStats.assists}
                  </p>
                  <p className="text-xs text-gray-500">Assists</p>
                </div>
                <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <Trophy className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calculatedStats.matches}
                  </p>
                  <p className="text-xs text-gray-500">Matches</p>
                </div>
                <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {calculatedStats.goalsPerMatch}
                  </p>
                  <p className="text-xs text-gray-500">G/Match</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sports Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sports</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Footprints className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Football</span>
                </div>
                <Badge
                  variant={profile.playsFootball ? "default" : "secondary"}
                >
                  {profile.playsFootball
                    ? profile.footballPosition || "Active"
                    : "Inactive"}
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-medium">Cricket</span>
                </div>
                <Badge variant={profile.playsCricket ? "default" : "secondary"}>
                  {profile.playsCricket
                    ? profile.cricketRole || "Active"
                    : "Inactive"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN - Stats & Info Tabs */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="border-b">
              <div className="flex justify-between gap-4">
                <button
                  onClick={() => setActiveTab("info")}
                  className={`px-4 py-2 text-sm font-medium transition-colors relative ${
                    activeTab === "info"
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
                >
                  Personal Info
                  {activeTab === "info" && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                  )}
                </button>

                <Button
                  onClick={handleEdit}
                  className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              {/* STATS TAB */}
              {activeTab === "info" && (
                <div className="space-y-6">
                  {/* Skill Bars */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                      Skills
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          label: "Shooting",
                          value: calculatedStats.shooting,
                          color: "#7c3aed",
                        },
                        {
                          label: "Passing",
                          value: calculatedStats.passing,
                          color: "#7c3aed",
                        },
                        {
                          label: "Dribbling",
                          value: calculatedStats.dribbling,
                          color: "#10b981",
                        },
                        {
                          label: "Defense",
                          value: calculatedStats.defense,
                          color: "#f59e0b",
                        },
                        {
                          label: "Pace",
                          value: calculatedStats.pace,
                          color: "#3b82f6",
                        },
                      ].map((skill) => (
                        <div key={skill.label}>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {skill.label}
                            </span>
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">
                              {skill.value}%
                            </span>
                          </div>
                          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{
                                width: `${skill.value}%`,
                                backgroundColor: skill.color,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Overall Rating */}
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Overall Rating</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          {profile.rating.toFixed(1)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill={
                              i < Math.floor(profile.rating / 2)
                                ? "#f59e0b"
                                : "none"
                            }
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                          >
                            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* INFO TAB */}
              {activeTab === "info" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <User className="w-4 h-4" />
                        Full Name
                      </label>
                      <p className="text-gray-900 dark:text-white font-medium">
                        {profile.name}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {profile.email}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {profile.phone || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <Shirt className="w-4 h-4" />
                        Jersey Number
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {profile.jerseyNumber || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <Droplet className="w-4 h-4" />
                        Blood Group
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {profile.bloodGroup || "—"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <Shirt className="w-4 h-4" />
                        Jersey Size
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {profile.jerseySize || "—"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <MapPin className="w-4 h-4" />
                        Address
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {profile.address || "—"}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-sm text-gray-500 flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4" />
                        Member Since
                      </label>
                      <p className="text-gray-900 dark:text-white">
                        {joinDate}
                      </p>
                    </div>
                    {profile.bio && (
                      <div className="md:col-span-2">
                        <label className="text-sm text-gray-500 mb-1 block">
                          Bio
                        </label>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {profile.bio}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* EDIT PROFILE MODAL */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit Profile
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Profile Photo */}
            <div className="flex flex-col items-center gap-3 pb-4 border-b">
              <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center ring-4 ring-white shadow-lg">
                  {formData.imageUrl ? (
                    <img
                      src={formData.imageUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl font-bold text-gray-400">
                      {formData.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageUploading}
                  className="absolute bottom-0 right-0 p-1.5 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <Camera className="w-3 h-3" />
                </button>
                {formData.imageUrl && (
                  <button
                    onClick={() => setFormData({ ...formData, imageUrl: "" })}
                    className="absolute bottom-0 left-0 p-1.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file);
                    e.target.value = "";
                  }}
                />
              </div>
              <p className="text-xs text-gray-500">
                Click camera icon to change photo
              </p>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Full Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Phone Number
                </label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+880 1234 567890"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Blood Group
                </label>
                <Select
                  value={formData.bloodGroup || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      bloodGroup: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {bloodGroups.map((bg) => (
                      <SelectItem key={bg} value={bg}>
                        {bg}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Jersey Size
                </label>
                <Select
                  value={formData.jerseySize || "none"}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      jerseySize: value === "none" ? "" : value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select jersey size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {jerseySizes.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Jersey Number
                </label>
                <Input
                  value={formData.jerseyNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, jerseyNumber: e.target.value })
                  }
                  placeholder="e.g., 10"
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">
                  Team Category
                </label>
                <Select
                  value={formData.teamCategory}
                  onValueChange={(value: "JUNIOR" | "SENIOR" | "GUEST") =>
                    setFormData({ ...formData, teamCategory: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">
                  Address
                </label>
                <Textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Your address"
                  rows={2}
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-1 block">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              {/* Sports Preferences */}
              <div className="md:col-span-2">
                <label className="text-sm font-medium mb-3 block">
                  Sports Preferences
                </label>
                <div className="flex gap-6 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.playsFootball}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          playsFootball: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Play Football</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.playsCricket}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          playsCricket: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Play Cricket</span>
                  </label>
                </div>
              </div>

              {formData.playsFootball && (
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Football Position
                  </label>
                  <Select
                    value={formData.footballPosition || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        footballPosition: value === "none" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {footballPositions.map((pos) => (
                        <SelectItem key={pos} value={pos}>
                          {pos}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {formData.playsCricket && (
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Cricket Role
                  </label>
                  <Select
                    value={formData.cricketRole || "none"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        cricketRole: value === "none" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {cricketRoles.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={imageUploading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Save className="w-4 h-4 mr-2" />
              {imageUploading ? "Uploading..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
