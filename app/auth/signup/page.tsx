"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import {
  Calendar,
  Droplet,
  Image as ImageIcon,
  Mail,
  MapPin,
  Shirt,
  Shield,
  User,
  Eye,
  EyeOff,
  Footprints,
  Trophy,
} from "lucide-react";

type TeamCategory = "JUNIOR" | "SENIOR" | "GUEST";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const bloodGroups = useMemo(
    () => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    [],
  );
  const jerseySizes = useMemo(() => ["S", "M", "L", "XL", "XXL", "XXXL"], []);
  const teamCategories = useMemo<TeamCategory[]>(
    () => ["JUNIOR", "SENIOR", "GUEST"],
    [],
  );
  const footballPositions = useMemo(
    () => ["Goalkeeper", "Defender", "Midfielder", "Forward", "Winger"],
    [],
  );
  const cricketRoles = useMemo(
    () => ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"],
    [],
  );

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
    jerseySize: "",
    jerseyNumber: "",
    rating: "",
    teamCategory: "JUNIOR" as TeamCategory,
    address: "",
    bio: "",
    imageUrl: "",
    playsFootball: true,
    footballPosition: "",
    playsCricket: false,
    cricketRole: "",
  });

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
      if (!fileUrl)
        throw new Error("Upload succeeded but no file URL returned");

      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
      toast({ title: "Uploaded", description: "Photo uploaded successfully" });
    } catch (error) {
      toast({
        title: "Upload Error",
        description:
          error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setImageUploading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.password) {
      toast({
        title: "Missing info",
        description: "Name, email and password are required.",
        variant: "destructive",
      });
      return;
    }

    const rating =
      formData.rating === "" ||
      formData.rating === null ||
      formData.rating === undefined
        ? undefined
        : Number(formData.rating);
    if (rating !== undefined && !Number.isFinite(rating)) {
      toast({
        title: "Invalid rating",
        description: "Rating must be a valid number.",
        variant: "destructive",
      });
      return;
    }

    if (imageUploading) {
      toast({
        title: "Please wait",
        description: "Photo upload is still in progress.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        rating,
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data?.error || "Signup failed");
      }

      router.push(
        "/auth/login?message=" +
          encodeURIComponent("Signup successful. Please log in to continue.") +
          "&next=" +
          encodeURIComponent("/member/dashboard"),
      );
    } catch (error) {
      toast({
        title: "Signup failed",
        description:
          error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/auth-bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-[#0a2e1a]/90 via-[#0a2e1a]/80 to-[#0a2e1a]/90" />
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-[#c9a227]/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-[#c9a227]/15 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-5 items-start">
          {/* Left Side Info */}
          <div className="lg:col-span-2 space-y-5 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#c9a227]/30 bg-[#c9a227]/10 backdrop-blur-sm px-3 py-1 text-sm">
              <Shield className="h-4 w-4 text-[#c9a227]" />
              <span className="text-white/90">Member onboarding</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Create your <span className="text-[#c9a227]">member</span> account
            </h1>
            <p className="text-white/70 leading-relaxed">
              Fill in your profile details now so your dashboard is ready from
              day one. After signup, log in and you'll be routed to your member
              dashboard.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-[#0a2e1a]/60 backdrop-blur-md border border-[#c9a227]/20">
              <div className="text-center sm:text-left">
                <p className="text-sm text-white/80 font-medium">
                  Already have an account?{" "}
                  <Link
                    href="/auth/login"
                    className="text-[#c9a227] font-bold hover:text-[#f0c94a] transition-all duration-200 underline-offset-4 hover:underline inline-flex items-center gap-1"
                  >
                    Log in
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </p>
              </div>

              <div>
                <Link href="/">
                  <button className="group relative inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#c9a227] text-[#0a2e1a] text-sm font-semibold shadow-lg shadow-[#c9a227]/20 hover:shadow-xl hover:shadow-[#c9a227]/30 hover:scale-105 transition-all duration-300 overflow-hidden">
                    <div className="absolute inset-0 bg-[#f0c94a] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <svg
                      className="w-4 h-4 relative z-10"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12h18M12 3l9 9-9 9"
                      />
                    </svg>
                    <span className="relative z-10">Go to Landing Page</span>
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Signup Form Card */}
          <Card className="lg:col-span-3 border border-[#c9a227]/20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm shadow-xl rounded-2xl overflow-hidden">
            <CardContent className="pt-6">
              <form onSubmit={handleSignup} className="space-y-6">
                {/* Account Section */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-[#0a2e1a] dark:text-white border-l-3 border-[#c9a227] pl-3">
                    Account Information
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User className="h-4 w-4 text-[#c9a227]" /> Full Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, name: e.target.value }))
                        }
                        placeholder="Enter your name"
                        className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227] focus:ring-[#c9a227]/20"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail className="h-4 w-4 text-[#c9a227]" /> Email{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, email: e.target.value }))
                        }
                        placeholder="member@example.com"
                        className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227] focus:ring-[#c9a227]/20"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Shield className="h-4 w-4 text-[#c9a227]" /> Password{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              password: e.target.value,
                            }))
                          }
                          placeholder="Create a strong password"
                          className="pr-24 border-gray-300 dark:border-gray-600 focus:border-[#c9a227] focus:ring-[#c9a227]/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Profile Section */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-[#0a2e1a] dark:text-white border-l-3 border-[#c9a227] pl-3">
                    Profile Details
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Phone
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, phone: e.target.value }))
                        }
                        placeholder="+880 1XXX XXXXXX"
                        className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227] focus:ring-[#c9a227]/20"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Droplet className="h-4 w-4 text-[#c9a227]" /> Blood
                          Group
                        </label>
                        <Select
                          value={formData.bloodGroup || "none"}
                          onValueChange={(v) =>
                            setFormData((p) => ({
                              ...p,
                              bloodGroup: v === "none" ? "" : v,
                            }))
                          }
                        >
                          <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227]">
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

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Shirt className="h-4 w-4 text-[#c9a227]" /> Jersey
                          Size
                        </label>
                        <Select
                          value={formData.jerseySize || "none"}
                          onValueChange={(v) =>
                            setFormData((p) => ({
                              ...p,
                              jerseySize: v === "none" ? "" : v,
                            }))
                          }
                        >
                          <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227]">
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
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Jersey Number
                        </label>
                        <Input
                          value={formData.jerseyNumber}
                          onChange={(e) =>
                            setFormData((p) => ({
                              ...p,
                              jerseyNumber: e.target.value,
                            }))
                          }
                          placeholder="e.g. 10"
                          className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227] focus:ring-[#c9a227]/20"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Team Category
                        </label>
                        <Select
                          value={formData.teamCategory}
                          onValueChange={(v) =>
                            setFormData((p) => ({
                              ...p,
                              teamCategory: v as TeamCategory,
                            }))
                          }
                        >
                          <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227]">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category.charAt(0) +
                                  category.slice(1).toLowerCase()}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#c9a227]" /> Address
                      </label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            address: e.target.value,
                          }))
                        }
                        placeholder="Your current address"
                        rows={2}
                        className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227] focus:ring-[#c9a227]/20 resize-none"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Bio
                      </label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, bio: e.target.value }))
                        }
                        placeholder="A short bio (optional)"
                        rows={2}
                        className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227] focus:ring-[#c9a227]/20 resize-none"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-[#c9a227]" /> Profile
                        Photo
                      </label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="file"
                          accept="image/*"
                          disabled={imageUploading}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            void handleImageUpload(file);
                            e.currentTarget.value = "";
                          }}
                          className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227] file:bg-[#c9a227] file:text-[#0a2e1a] file:border-0 file:rounded-lg file:font-semibold"
                        />
                      </div>
                      {formData.imageUrl && (
                        <div className="flex items-center justify-between rounded-md border border-[#c9a227]/30 bg-[#c9a227]/5 px-3 py-2 text-xs">
                          <span className="truncate text-gray-600 dark:text-gray-400">
                            Photo uploaded ✓
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              setFormData((p) => ({ ...p, imageUrl: "" }))
                            }
                            className="text-red-600 hover:underline text-xs"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sports Section */}
                <div className="space-y-3">
                  <div className="text-sm font-semibold text-[#0a2e1a] dark:text-white border-l-3 border-[#c9a227] pl-3">
                    Sports Interests
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-start gap-3 rounded-lg border border-gray-300 dark:border-gray-600 p-4 cursor-pointer hover:bg-[#c9a227]/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.playsFootball}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            playsFootball: e.target.checked,
                          }))
                        }
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]/20"
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Footprints className="h-4 w-4 text-[#c9a227]" />{" "}
                          Plays Football
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Choose your preferred position.
                        </div>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 rounded-lg border border-gray-300 dark:border-gray-600 p-4 cursor-pointer hover:bg-[#c9a227]/5 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.playsCricket}
                        onChange={(e) =>
                          setFormData((p) => ({
                            ...p,
                            playsCricket: e.target.checked,
                          }))
                        }
                        className="mt-1 h-4 w-4 rounded border-gray-300 text-[#c9a227] focus:ring-[#c9a227]/20"
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                          <Trophy className="h-4 w-4 text-[#c9a227]" /> Plays
                          Cricket
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          Choose your role in cricket.
                        </div>
                      </div>
                    </label>

                    <div className="grid grid-cols-2 gap-4 ">
                      {formData.playsFootball && (
                        <div className="space-y-2 md:col-span-2 animate-fadeIn">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Football Position
                          </label>
                          <Select
                            value={formData.footballPosition || "none"}
                            onValueChange={(v) =>
                              setFormData((p) => ({
                                ...p,
                                footballPosition: v === "none" ? "" : v,
                              }))
                            }
                          >
                            <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227]">
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
                        <div className="space-y-2 md:col-span-2 animate-fadeIn">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Cricket Role
                          </label>
                          <Select
                            value={formData.cricketRole || "none"}
                            onValueChange={(v) =>
                              setFormData((p) => ({
                                ...p,
                                cricketRole: v === "none" ? "" : v,
                              }))
                            }
                          >
                            <SelectTrigger className="border-gray-300 dark:border-gray-600 focus:border-[#c9a227]">
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
                </div>

                {/* Submit Button */}
                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between pt-2">
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    By signing up you're creating a member account.
                  </div>
                  <Button
                    type="submit"
                    disabled={loading || imageUploading}
                    className="sm:min-w-44 bg-[#c9a227] hover:bg-[#f0c94a] text-[#0a2e1a] font-bold shadow-lg shadow-[#c9a227]/20 hover:shadow-xl transition-all duration-300"
                  >
                    {loading ? "Creating..." : "Create Account"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </main>
  );
}
