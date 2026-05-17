"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  Star,
  User,
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
      if (!fileUrl) throw new Error("Upload succeeded but no file URL returned");

      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
      toast({ title: "Uploaded", description: "Photo uploaded successfully" });
    } catch (error) {
      toast({
        title: "Upload Error",
        description: error instanceof Error ? error.message : "Failed to upload image",
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
      formData.rating === "" || formData.rating === null || formData.rating === undefined
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
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/auth-bg.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-linear-to-br from-black/70 via-black/55 to-black/70" />
      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-blue-500/25 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-purple-500/25 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-5 items-start">
          <div className="lg:col-span-2 space-y-5 text-white">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-sm">
              <Shield className="h-4 w-4" />
              Member onboarding
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Create your member account
            </h1>
            <p className="text-white/80 leading-relaxed">
              Fill in your profile details now so your dashboard is ready from day one.
              After signup, log in and you’ll be routed to your member dashboard.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <User className="h-4 w-4" />
                  Profile details
                </div>
                <div className="mt-2 text-xs text-white/60">
                  Contact, jersey, address, bio
                </div>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm text-white/80">
                  <Star className="h-4 w-4" />
                  Sports info
                </div>
                <div className="mt-2 text-xs text-white/60">
                  Football / cricket + rating
                </div>
              </div>
            </div>

            <div className="text-sm text-white/80">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-white underline underline-offset-4">
                Log in
              </Link>
            </div>
          </div>

          <Card className="lg:col-span-3 border-white/10 bg-white/90 dark:bg-gray-950/60 backdrop-blur supports-[backdrop-filter]:bg-white/70">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-2">
                <span>Member Signup</span>
                <Badge variant="secondary" className="gap-1">
                  <Calendar className="h-3.5 w-3.5" /> For members only
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Account
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" /> Full Name{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-500" /> Email{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
                        placeholder="member@example.com"
                        required
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" /> Password{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={(e) =>
                            setFormData((p) => ({ ...p, password: e.target.value }))
                          }
                          placeholder="Create a strong password"
                          required
                          className="pr-24"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                        >
                          {showPassword ? "Hide" : "Show"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Profile
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="+880 1XXX XXXXXX"
                      />
                    </div>
                    {/* <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Star className="h-4 w-4 text-gray-500" /> Rating
                      </label>
                      <Input
                        type="number"
                        step="0.1"
                        value={formData.rating}
                        onChange={(e) => setFormData((p) => ({ ...p, rating: e.target.value }))}
                        placeholder="0"
                      />
                    </div> */}

                    <div className="space-y-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Droplet className="h-4 w-4 text-gray-500" /> Blood Group
                      </label>
                      <Select
                        value={formData.bloodGroup || "none"}
                        onValueChange={(v) =>
                          setFormData((p) => ({ ...p, bloodGroup: v === "none" ? "" : v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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
                      <label className="text-sm font-medium flex items-center gap-2">
                        <Shirt className="h-4 w-4 text-gray-500" /> Jersey Size
                      </label>
                      <Select
                        value={formData.jerseySize || "none"}
                        onValueChange={(v) =>
                          setFormData((p) => ({ ...p, jerseySize: v === "none" ? "" : v }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
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

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Jersey Number</label>
                      <Input
                        value={formData.jerseyNumber}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, jerseyNumber: e.target.value }))
                        }
                        placeholder="e.g. 10"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Team Category</label>
                      <Select
                        value={formData.teamCategory}
                        onValueChange={(v) =>
                          setFormData((p) => ({ ...p, teamCategory: v as TeamCategory }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {teamCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" /> Address
                      </label>
                      <Textarea
                        value={formData.address}
                        onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))}
                        placeholder="Your current address"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Bio</label>
                      <Textarea
                        value={formData.bio}
                        onChange={(e) => setFormData((p) => ({ ...p, bio: e.target.value }))}
                        placeholder="A short bio (optional)"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium flex items-center gap-2">
                        <ImageIcon className="h-4 w-4 text-gray-500" /> Photo (optional)
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
                        />
                        <div className="text-xs text-gray-500 min-w-24 text-right">
                          {imageUploading ? "Uploading..." : formData.imageUrl ? "Uploaded" : "No photo"}
                        </div>
                      </div>
                      {formData.imageUrl ? (
                        <div className="flex items-center justify-between rounded-md border px-3 py-2 text-xs">
                          <span className="truncate">{formData.imageUrl}</span>
                          <button
                            type="button"
                            onClick={() => setFormData((p) => ({ ...p, imageUrl: "" }))}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    Sports
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/30">
                      <input
                        type="checkbox"
                        checked={formData.playsFootball}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, playsFootball: e.target.checked }))
                        }
                        className="mt-1 h-4 w-4 rounded"
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Plays Football</div>
                        <div className="text-xs text-muted-foreground">
                          Choose your preferred position.
                        </div>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 rounded-lg border p-4 cursor-pointer hover:bg-muted/30">
                      <input
                        type="checkbox"
                        checked={formData.playsCricket}
                        onChange={(e) =>
                          setFormData((p) => ({ ...p, playsCricket: e.target.checked }))
                        }
                        className="mt-1 h-4 w-4 rounded"
                      />
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Plays Cricket</div>
                        <div className="text-xs text-muted-foreground">
                          Choose your role in cricket.
                        </div>
                      </div>
                    </label>

                    {formData.playsFootball ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Football Position</label>
                        <Select
                          value={formData.footballPosition || "none"}
                          onValueChange={(v) =>
                            setFormData((p) => ({
                              ...p,
                              footballPosition: v === "none" ? "" : v,
                            }))
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
                    ) : null}

                    {formData.playsCricket ? (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cricket Role</label>
                        <Select
                          value={formData.cricketRole || "none"}
                          onValueChange={(v) =>
                            setFormData((p) => ({
                              ...p,
                              cricketRole: v === "none" ? "" : v,
                            }))
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
                    ) : null}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                  <div className="text-xs text-muted-foreground">
                    By signing up you’re creating a member account.
                  </div>
                  <Button type="submit" disabled={loading || imageUploading} className="sm:min-w-44">
                    {loading ? "Creating..." : "Create account"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

