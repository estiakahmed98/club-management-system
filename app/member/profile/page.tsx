"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  Shirt,
  Calendar,
  Camera,
  Trash2,
  Save,
  X,
  Edit2,
  Award,
  Footprints,
} from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface MemberProfile {
  id: string;
  userId: string;
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
  teamCategory: string;
}

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
const jerseySizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
const footballPositions = ["Goalkeeper", "Defender", "Midfielder", "Forward", "Winger"];
const cricketRoles = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];
const teamCategories = [
  { value: "JUNIOR", label: "Junior", color: "bg-blue-100 text-blue-800" },
  { value: "SENIOR", label: "Senior", color: "bg-purple-100 text-purple-800" },
  { value: "GUEST", label: "Guest", color: "bg-gray-100 text-gray-800" },
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
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
    rating: "",
    teamCategory: "JUNIOR",
  });

  const fetchProfile = useCallback(async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/member/profile?userId=${encodeURIComponent(id)}`);
      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = await response.json();
      setProfile(data);
      setUserId(data.userId || id);
      setFormData({
        name: data.name || "",
        email: data.email || data.userEmail || "",
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
        rating: Number.isFinite(data.rating) ? String(data.rating) : "",
        teamCategory: data.teamCategory || "JUNIOR",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userStr =
      typeof window === "undefined" ? null : window.localStorage.getItem("user");

    if (!userStr) {
      setLoading(false);
      toast({
        title: "Not logged in",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
      router.push("/auth/login?next=/member/profile");
      return;
    }

    try {
      const parsed = JSON.parse(userStr) as { id?: string; role?: string };
      if (!parsed?.id) throw new Error("Missing user id");
      if (parsed.role && parsed.role !== "member") {
        router.push("/auth/login");
        return;
      }
      setUserId(parsed.id);
      void fetchProfile(parsed.id);
    } catch {
      setLoading(false);
      toast({
        title: "Session issue",
        description: "Please log in again.",
        variant: "destructive",
      });
      router.push("/auth/login?next=/member/profile");
    }
  }, [fetchProfile, router]);

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
        description: error instanceof Error ? error.message : "Failed to upload image",
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

      const rating =
        formData.rating === "" || formData.rating === null || formData.rating === undefined
          ? undefined
          : Number(formData.rating);

      if (rating !== undefined && !Number.isFinite(rating)) {
        toast({
          title: "Validation Error",
          description: "Rating must be a valid number",
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
          rating,
        }),
      });

      if (!response.ok) throw new Error("Failed to update profile");

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setEditing(false);
      if (userId) {
        await fetchProfile(userId);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const getTeamCategoryBadge = (category: string) => {
    const found = teamCategories.find(c => c.value === category);
    return found?.color || "bg-gray-100 text-gray-800";
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

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your personal information and preferences
          </p>
        </div>
        <Button
          onClick={() => {
            if (editing) {
              if (userId) void fetchProfile(userId);
            }
            setEditing(!editing);
          }}
          variant={editing ? "outline" : "default"}
          className={!editing ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" : ""}
        >
          {editing ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      {/* Profile Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Photo & Stats */}
        <div className="space-y-6">
          {/* Profile Photo Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-lg">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl font-bold text-gray-400">
                        {profile.name?.charAt(0)?.toUpperCase()}
                      </span>
                    )}
                  </div>
                  {editing && (
                    <>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={imageUploading}
                        className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        <Camera className="w-4 h-4" />
                      </button>
                      {formData.imageUrl && (
                        <button
                          onClick={() => setFormData({ ...formData, imageUrl: "" })}
                          className="absolute bottom-0 left-0 p-2 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
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
                    </>
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profile.name}
                </h3>
                <Badge className={`mt-2 ${getTeamCategoryBadge(profile.teamCategory)}`}>
                  {profile.teamCategory.charAt(0) + profile.teamCategory.slice(1).toLowerCase()}
                </Badge>
                {profile.rating > 0 && (
                  <div className="flex items-center gap-1 mt-3">
                    <Award className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Rating: {profile.rating.toFixed(1)} / 5.0
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sports Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Sports Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <Footprints className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium">Football</span>
                </div>
                <Badge variant={profile.playsFootball ? "default" : "secondary"}>
                  {profile.playsFootball ? "Active" : "Inactive"}
                </Badge>
              </div>
              {profile.playsFootball && profile.footballPosition && (
                <div className="ml-8 pl-4 border-l-2 border-blue-200">
                  <p className="text-xs text-gray-500">Position</p>
                  <p className="text-sm font-medium">{profile.footballPosition}</p>
                </div>
              )}
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-5 h-5 text-green-600">🏏</span>
                  <span className="text-sm font-medium">Cricket</span>
                </div>
                <Badge variant={profile.playsCricket ? "default" : "secondary"}>
                  {profile.playsCricket ? "Active" : "Inactive"}
                </Badge>
              </div>
              {profile.playsCricket && profile.cricketRole && (
                <div className="ml-8 pl-4 border-l-2 border-green-200">
                  <p className="text-xs text-gray-500">Role</p>
                  <p className="text-sm font-medium">{profile.cricketRole}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Main Info */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <User className="w-4 h-4" />
                      Full Name
                    </label>
                    {editing ? (
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        placeholder="Your full name"
                        className="w-full"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <Mail className="w-4 h-4" />
                      Email Address
                    </label>
                    <p className="text-gray-900 dark:text-white">{profile.email}</p>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </label>
                    {editing ? (
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        placeholder="+880 1234 567890"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.phone || "—"}</p>
                    )}
                  </div>

                  {/* Jersey Number */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <Shirt className="w-4 h-4" />
                      Jersey Number
                    </label>
                    {editing ? (
                      <Input
                        value={formData.jerseyNumber}
                        onChange={(e) =>
                          setFormData({ ...formData, jerseyNumber: e.target.value })
                        }
                        placeholder="e.g., 10"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.jerseyNumber || "—"}</p>
                    )}
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <Droplet className="w-4 h-4" />
                      Blood Group
                    </label>
                    {editing ? (
                      <Select
                        value={formData.bloodGroup || "none"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, bloodGroup: value === "none" ? "" : value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select blood group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {bloodGroups.map((bg) => (
                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.bloodGroup || "—"}</p>
                    )}
                  </div>

                  {/* Jersey Size */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <Shirt className="w-4 h-4" />
                      Jersey Size
                    </label>
                    {editing ? (
                      <Select
                        value={formData.jerseySize || "none"}
                        onValueChange={(value) =>
                          setFormData({ ...formData, jerseySize: value === "none" ? "" : value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select jersey size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          {jerseySizes.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.jerseySize || "—"}</p>
                    )}
                  </div>

                  {/* Team Category */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4" />
                      Team Category
                    </label>
                    {editing ? (
                      <Select
                        value={formData.teamCategory}
                        onValueChange={(value) =>
                          setFormData({ ...formData, teamCategory: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamCategories.map((category) => (
                            <SelectItem key={category.value} value={category.value}>
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.teamCategory || "â€”"}</p>
                    )}
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <Award className="w-4 h-4" />
                      Rating
                    </label>
                    {editing ? (
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) =>
                          setFormData({ ...formData, rating: e.target.value })
                        }
                        placeholder="0"
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">
                        {Number.isFinite(profile.rating) ? profile.rating.toFixed(1) : 0}
                      </p>
                    )}
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4" />
                      Address
                    </label>
                    {editing ? (
                      <Textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Your address"
                        rows={2}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.address || "—"}</p>
                    )}
                  </div>

                  {/* Bio */}
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                      Bio
                    </label>
                    {editing ? (
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData({ ...formData, bio: e.target.value })
                        }
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    ) : (
                      <p className="text-gray-900 dark:text-white">{profile.bio || "—"}</p>
                    )}
                  </div>

                  {/* Sports Preferences (Edit Mode) */}
                  {editing && (
                    <>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 block">
                          Sports Preferences
                        </label>
                        <div className="flex gap-6 mb-4">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={formData.playsFootball}
                              onChange={(e) =>
                                setFormData({ ...formData, playsFootball: e.target.checked })
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
                                setFormData({ ...formData, playsCricket: e.target.checked })
                              }
                              className="w-4 h-4 rounded"
                            />
                            <span className="text-sm">Play Cricket</span>
                          </label>
                        </div>
                      </div>

                      {formData.playsFootball && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Football Position
                          </label>
                          <Select
                            value={formData.footballPosition || "none"}
                            onValueChange={(value) =>
                              setFormData({ ...formData, footballPosition: value === "none" ? "" : value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select position" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {footballPositions.map((pos) => (
                                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      {formData.playsCricket && (
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Cricket Role
                          </label>
                          <Select
                            value={formData.cricketRole || "none"}
                            onValueChange={(value) =>
                              setFormData({ ...formData, cricketRole: value === "none" ? "" : value })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {cricketRoles.map((role) => (
                                <SelectItem key={role} value={role}>{role}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Join Date */}
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Member since {new Date(profile.joiningDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}</span>
                  </div>
                </div>

                {/* Save Button */}
                {editing && (
                  <Button
                    onClick={handleUpdate}
                    disabled={imageUploading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {imageUploading ? "Uploading image..." : "Save Changes"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
