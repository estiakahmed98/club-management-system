"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  Plus,
  Edit2,
  Trash2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
  Mail,
  Phone,
  Droplet,
  Shirt,
  Calendar,
  Eye,
  EyeOff,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Member {
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
  joiningDate: string;
  teamCategory: string;
  playsFootball: boolean;
  footballPosition?: string;
  playsCricket: boolean;
  cricketRole?: string;
  rating: number;
  imageUrl?: string | null;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [bloodGroupFilter, setBloodGroupFilter] = useState<string>("all");
  const [jerseySizeFilter, setJerseySizeFilter] = useState<string>("all");
  const [teamCategoryFilter, setTeamCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [viewingMember, setViewingMember] = useState<Member | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    bloodGroup: "",
    jerseySize: "",
    jerseyNumber: "",
    address: "",
    bio: "",
    rating: "",
    teamCategory: "JUNIOR",
    imageUrl: "",
    playsFootball: true,
    footballPosition: "",
    playsCricket: false,
    cricketRole: "",
  });
  const [imageUploading, setImageUploading] = useState(false);

  // Blood groups and jersey sizes for filters
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const jerseySizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const teamCategories = ["JUNIOR", "SENIOR", "GUEST"];

  // Football positions and cricket roles
  const footballPositions = [
    "Goalkeeper",
    "Defender",
    "Midfielder",
    "Forward",
    "Winger",
  ];
  const cricketRoles = ["Batsman", "Bowler", "All-rounder", "Wicket-keeper"];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, page: 1 }));
  }, [bloodGroupFilter, jerseySizeFilter, teamCategoryFilter, debouncedSearch]);

  // Fetch members with filters and pagination
  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (bloodGroupFilter !== "all")
        params.append("bloodGroup", bloodGroupFilter);
      if (jerseySizeFilter !== "all")
        params.append("jerseySize", jerseySizeFilter);
      if (teamCategoryFilter !== "all")
        params.append("teamCategory", teamCategoryFilter);

      const response = await fetch(`/api/admin/members?${params}`);
      if (!response.ok) throw new Error("Failed to fetch members");

      const data = await response.json();
      setMembers(data.members);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching members:", error);
      toast({
        title: "Error",
        description: "Failed to load members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    bloodGroupFilter,
    jerseySizeFilter,
    teamCategoryFilter,
  ]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const response = await fetch(`/api/admin/members/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete member");

      toast({
        title: "Success",
        description: "Member deleted successfully",
      });
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
      toast({
        title: "Error",
        description: "Failed to delete member",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (member: Member) => {
    setEditingId(member.id);
    setShowPassword(false);
    setFormData({
      name: member.name,
      email: member.email,
      password: "",
      phone: member.phone || "",
      bloodGroup: member.bloodGroup || "",
      jerseySize: member.jerseySize || "",
      jerseyNumber: member.jerseyNumber || "",
      address: member.address || "",
      bio: member.bio || "",
      rating: Number.isFinite(member.rating) ? String(member.rating) : "",
      teamCategory: member.teamCategory,
      imageUrl: member.imageUrl || "",
      playsFootball: member.playsFootball ?? true,
      footballPosition: member.footballPosition || "",
      playsCricket: member.playsCricket ?? false,
      cricketRole: member.cricketRole || "",
    });
    setDialogOpen(true);
  };

  const handleView = (member: Member) => {
    setViewingMember(member);
    setViewDialogOpen(true);
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
        title: "Uploaded",
        description: "Member photo uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
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

  const handleSave = async () => {
    const needsPassword = !editingId;
    if (
      !formData.name ||
      !formData.email ||
      (needsPassword && !formData.password)
    ) {
      toast({
        title: "Validation Error",
        description: needsPassword
          ? "Name, email, and password are required"
          : "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/members/${editingId}`
        : "/api/admin/members";
      const method = editingId ? "PUT" : "POST";

      if (imageUploading) {
        toast({
          title: "Please wait",
          description: "Image upload is still in progress",
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
          title: "Validation Error",
          description: "Rating must be a valid number",
          variant: "destructive",
        });
        return;
      }

      const payload = {
        ...formData,
        rating,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save member");
      }

      toast({
        title: "Success",
        description: editingId
          ? "Member updated successfully"
          : "Member created successfully",
      });

      setDialogOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        bloodGroup: "",
        jerseySize: "",
        jerseyNumber: "",
        address: "",
        bio: "",
        rating: "",
        teamCategory: "JUNIOR",
        imageUrl: "",
        playsFootball: true,
        footballPosition: "",
        playsCricket: false,
        cricketRole: "",
      });
      fetchMembers();
    } catch (error) {
      console.error("Error saving member:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to save member",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setBloodGroupFilter("all");
    setJerseySizeFilter("all");
    setTeamCategoryFilter("all");
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getBloodGroupColor = (bloodGroup: string) => {
    const colors: Record<string, string> = {
      "A+": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "A-": "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
      "B+": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "B-": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      "AB+":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "AB-":
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "O+": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "O-": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return (
      colors[bloodGroup] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    );
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Member Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage all club members, their profiles, and jersey information
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setShowPassword(false);
            setFormData({
              name: "",
              email: "",
              password: "",
              phone: "",
              bloodGroup: "",
              jerseySize: "",
              jerseyNumber: "",
              address: "",
              bio: "",
              rating: "",
              teamCategory: "JUNIOR",
              imageUrl: "",
              playsFootball: true,
              footballPosition: "",
              playsCricket: false,
              cricketRole: "",
            });
            setDialogOpen(true);
          }}
          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Member
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Total Members
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {pagination.total}
                </p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Showing Now
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {members.length}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Blood Groups
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {
                    new Set(members.map((m) => m.bloodGroup).filter(Boolean))
                      .size
                  }
                </p>
              </div>
              <Droplet className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Jersey Sizes
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {
                    new Set(members.map((m) => m.jerseySize).filter(Boolean))
                      .size
                  }
                </p>
              </div>
              <Shirt className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={bloodGroupFilter}
              onValueChange={setBloodGroupFilter}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Blood Group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Blood Groups</SelectItem>
                {bloodGroups.map((bg) => (
                  <SelectItem key={bg} value={bg}>
                    {bg}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={jerseySizeFilter}
              onValueChange={setJerseySizeFilter}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Jersey Size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                {jerseySizes.map((size) => (
                  <SelectItem key={size} value={size}>
                    Size {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={teamCategoryFilter}
              onValueChange={setTeamCategoryFilter}
            >
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Team Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {teamCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0) + category.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchTerm ||
              bloodGroupFilter !== "all" ||
              jerseySizeFilter !== "all" ||
              teamCategoryFilter !== "all") && (
              <Button
                variant="outline"
                onClick={clearFilters}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Members Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Member List</span>
            <Badge variant="secondary">{pagination.total} Total Members</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : members.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No members found</p>
              {(searchTerm ||
                bloodGroupFilter !== "all" ||
                jerseySizeFilter !== "all" ||
                teamCategoryFilter !== "all") && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Blood Group
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Jersey Size
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Jersey No.
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Address
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Bio
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Football
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Cricket
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Team Category
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">
                        Joined
                      </th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {members.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                              {member.imageUrl ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={member.imageUrl}
                                  alt={member.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                                  {member.name?.charAt(0)?.toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div className="font-medium text-gray-900 dark:text-white">
                              {member.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              <Mail className="w-3 h-3 mr-1 shrink-0" />
                              <span className="truncate">{member.email}</span>
                            </div>
                            {member.phone && (
                              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                <Phone className="w-3 h-3 mr-1 shrink-0" />
                                <span>{member.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {member.bloodGroup ? (
                            <Badge
                              className={getBloodGroupColor(member.bloodGroup)}
                            >
                              {member.bloodGroup}
                            </Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {member.jerseySize ? (
                            <Badge variant="outline">{member.jerseySize}</Badge>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {member.jerseyNumber ? (
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {member.jerseyNumber}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {Number.isFinite(member.rating)
                              ? member.rating.toFixed(1)
                              : "0.0"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {member.address ? (
                            <span
                              className="text-sm text-gray-600 dark:text-gray-300 max-w-[220px] block truncate"
                              title={member.address}
                            >
                              {member.address}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {member.bio ? (
                            <span
                              className="text-sm text-gray-600 dark:text-gray-300 max-w-[240px] block truncate"
                              title={member.bio}
                            >
                              {member.bio}
                            </span>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {member.playsFootball ? (
                            <div className="space-y-1">
                              <Badge variant="secondary">Yes</Badge>
                              {member.footballPosition && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {member.footballPosition}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {member.playsCricket ? (
                            <div className="space-y-1">
                              <Badge variant="secondary">Yes</Badge>
                              {member.cricketRole && (
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                  {member.cricketRole}
                                </div>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline">No</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={getTeamCategoryColor(
                              member.teamCategory,
                            )}
                          >
                            {member.teamCategory.charAt(0) +
                              member.teamCategory.slice(1).toLowerCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar className="w-3 h-3 mr-1 shrink-0" />
                            {new Date(member.joiningDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleView(member)}
                              className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(member)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(member.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-500">
                    Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}{" "}
                    of {pagination.total} members
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          let pageNum;
                          if (pagination.totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (pagination.page <= 3) {
                            pageNum = i + 1;
                          } else if (
                            pagination.page >=
                            pagination.totalPages - 2
                          ) {
                            pageNum = pagination.totalPages - 4 + i;
                          } else {
                            pageNum = pagination.page - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={
                                pagination.page === pageNum
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              className="w-8 h-8"
                            >
                              {pageNum}
                            </Button>
                          );
                        },
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Member Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Member" : "Add New Member"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Full Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Enter member's full name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Email Address <span className="text-red-500">*</span>
              </label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="member@example.com"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                {editingId ? "Reset Password (optional)" : "Password"}{" "}
                {!editingId && <span className="text-red-500">*</span>}
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={
                    editingId
                      ? "Leave blank to keep current password"
                      : "Set a password"
                  }
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <label className="text-sm font-medium mb-1 block">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({ ...formData, rating: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Member Photo
              </label>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  {formData.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={formData.imageUrl}
                      alt="Member photo preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-gray-500 dark:text-gray-400">
                      —
                    </div>
                  )}
                </div>
                <div className="flex-1">
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
                  {formData.imageUrl && (
                    <button
                      type="button"
                      className="mt-2 text-xs text-red-600 hover:underline"
                      onClick={() => setFormData({ ...formData, imageUrl: "" })}
                      disabled={imageUploading}
                    >
                      Remove photo
                    </button>
                  )}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Jersey Number
                </label>
                <Input
                  value={formData.jerseyNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, jerseyNumber: e.target.value })
                  }
                  placeholder="e.g. 10"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Team Category
                </label>
                <Select
                  value={formData.teamCategory}
                  onValueChange={(value) =>
                    setFormData({ ...formData, teamCategory: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0) + category.slice(1).toLowerCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Address
                </label>
                <Textarea
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Enter address"
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Bio</label>
                <Textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Short bio"
                  rows={3}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Sports</label>
              <div className="flex gap-4">
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
                  <span className="text-sm">Football</span>
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
                  <span className="text-sm">Cricket</span>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      {footballPositions.map((position) => (
                        <SelectItem key={position} value={position}>
                          {position}
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
            <Button onClick={handleSave} className="w-full">
              {editingId ? "Update Member" : "Create Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Member Dialog */}
      <Dialog
        open={viewDialogOpen}
        onOpenChange={(open) => {
          setViewDialogOpen(open);
          if (!open) setViewingMember(null);
        }}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {viewingMember ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 shrink-0">
                  {viewingMember.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={viewingMember.imageUrl}
                      alt={viewingMember.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-500 dark:text-gray-400">
                      {viewingMember.name?.charAt(0)?.toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-900 dark:text-white">
                    {viewingMember.name}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {viewingMember.email}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Phone</div>
                  <div className="text-gray-900 dark:text-white">
                    {viewingMember.phone || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Team Category
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {viewingMember.teamCategory}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Blood Group
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {viewingMember.bloodGroup || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Joined</div>
                  <div className="text-gray-900 dark:text-white">
                    {new Date(viewingMember.joiningDate).toLocaleDateString()}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Jersey Size
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {viewingMember.jerseySize || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Jersey Number
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {viewingMember.jerseyNumber || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">Rating</div>
                  <div className="text-gray-900 dark:text-white">
                    {Number.isFinite(viewingMember.rating)
                      ? viewingMember.rating.toFixed(1)
                      : "0.0"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Football
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {viewingMember.playsFootball
                      ? viewingMember.footballPosition || "Yes"
                      : "No"}
                  </div>
                </div>
                <div>
                  <div className="text-gray-500 dark:text-gray-400">
                    Cricket
                  </div>
                  <div className="text-gray-900 dark:text-white">
                    {viewingMember.playsCricket
                      ? viewingMember.cricketRole || "Yes"
                      : "No"}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-gray-500 dark:text-gray-400">
                    Address
                  </div>
                  <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {viewingMember.address || "—"}
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <div className="text-gray-500 dark:text-gray-400">Bio</div>
                  <div className="text-gray-900 dark:text-white whitespace-pre-wrap">
                    {viewingMember.bio || "—"}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewDialogOpen(false);
                    setViewingMember(null);
                  }}
                >
                  Close
                </Button>
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    if (viewingMember) handleEdit(viewingMember);
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
