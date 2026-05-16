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
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Member {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bloodGroup?: string;
  jerseySize?: string;
  joiningDate: string;
  teamCategory: string;
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
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bloodGroup: "",
    jerseySize: "",
    teamCategory: "JUNIOR",
  });

  // Blood groups and jersey sizes for filters
  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
  const jerseySizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
  const teamCategories = ["JUNIOR", "SENIOR", "GUEST"];

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
      if (bloodGroupFilter !== "all") params.append("bloodGroup", bloodGroupFilter);
      if (jerseySizeFilter !== "all") params.append("jerseySize", jerseySizeFilter);
      if (teamCategoryFilter !== "all") params.append("teamCategory", teamCategoryFilter);

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
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone || "",
      bloodGroup: member.bloodGroup || "",
      jerseySize: member.jerseySize || "",
      teamCategory: member.teamCategory,
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.email) {
      toast({
        title: "Validation Error",
        description: "Name and email are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/members/${editingId}`
        : "/api/admin/members";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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
        phone: "",
        bloodGroup: "",
        jerseySize: "",
        teamCategory: "JUNIOR",
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
      "AB+": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "AB-": "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      "O+": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
      "O-": "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    };
    return colors[bloodGroup] || "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
  };

  const getTeamCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      JUNIOR: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      SENIOR: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
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
            setFormData({
              name: "",
              email: "",
              phone: "",
              bloodGroup: "",
              jerseySize: "",
              teamCategory: "JUNIOR",
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
                        Jersey
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
                          <div className="font-medium text-gray-900 dark:text-white">
                            {member.name}
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
                          <Badge className={getTeamCategoryColor(member.teamCategory)}>
                            {member.teamCategory.charAt(0) + member.teamCategory.slice(1).toLowerCase()}
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
        <DialogContent className="sm:max-w-md">
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
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Blood Group
                </label>
                <Select
                  value={formData.bloodGroup || "none"}
                  onValueChange={(value) =>
                    setFormData({ ...formData, bloodGroup: value === "none" ? "" : value })
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
                    setFormData({ ...formData, jerseySize: value === "none" ? "" : value })
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
            <Button onClick={handleSave} className="w-full">
              {editingId ? "Update Member" : "Create Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}