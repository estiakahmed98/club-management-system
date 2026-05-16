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
  Calendar,
  MapPin,
  Trophy,
  Users,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Match {
  id: string;
  name: string;
  opponent: string;
  matchDate: string;
  location?: string;
  matchType: string;
  result?: string;
  score?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const matchTypes = [
  { value: "friendly", label: "Friendly", color: "bg-green-100 text-green-800" },
  { value: "league", label: "League", color: "bg-blue-100 text-blue-800" },
  { value: "tournament", label: "Tournament", color: "bg-purple-100 text-purple-800" },
  { value: "cup", label: "Cup", color: "bg-yellow-100 text-yellow-800" },
  { value: "senior_junior", label: "Senior vs Junior", color: "bg-orange-100 text-orange-800" },
  { value: "other", label: "Other", color: "bg-gray-100 text-gray-800" },
];

const results = [
  { value: "win", label: "Win", color: "bg-green-100 text-green-800" },
  { value: "loss", label: "Loss", color: "bg-red-100 text-red-800" },
  { value: "draw", label: "Draw", color: "bg-yellow-100 text-yellow-800" },
];

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [matchTypeFilter, setMatchTypeFilter] = useState<string>("all");
  const [resultFilter, setResultFilter] = useState<string>("all");
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
    opponent: "",
    matchDate: "",
    location: "",
    matchType: "friendly",
    result: "",
    score: "",
  });

  // Auto-setup for internal Senior vs Junior match
  useEffect(() => {
    if (formData.matchType !== "senior_junior") return;

    setFormData((prev) => ({
      ...prev,
      name: prev.name || "Senior vs Junior",
      opponent: prev.opponent || "Junior Team",
    }));
  }, [formData.matchType]);

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
  }, [matchTypeFilter, resultFilter]);

  // Fetch matches with filters and pagination
  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (matchTypeFilter !== "all") params.append("matchType", matchTypeFilter);
      if (resultFilter !== "all") params.append("result", resultFilter);

      const response = await fetch(`/api/admin/matches?${params}`);
      if (!response.ok) throw new Error("Failed to fetch matches");
      
      const data = await response.json();
      setMatches(data.matches);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load matches",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, matchTypeFilter, resultFilter]);

  useEffect(() => {
    fetchMatches();
  }, [fetchMatches]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this match?")) return;

    try {
      const response = await fetch(`/api/admin/matches/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete match");
      
      toast({
        title: "Success",
        description: "Match deleted successfully",
      });
      
      fetchMatches();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete match",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (match: Match) => {
    setEditingId(match.id);
    setFormData({
      name: match.name,
      opponent: match.opponent,
      matchDate: match.matchDate.split("T")[0],
      location: match.location || "",
      matchType: match.matchType,
      result: match.result || "",
      score: match.score || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.opponent || !formData.matchDate) {
      toast({
        title: "Validation Error",
        description: "Match name, opponent, and date are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/matches/${editingId}`
        : "/api/admin/matches";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save match");
      }

      toast({
        title: "Success",
        description: editingId
          ? "Match updated successfully"
          : "Match created successfully",
      });

      setDialogOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        opponent: "",
        matchDate: "",
        location: "",
        matchType: "friendly",
        result: "",
        score: "",
      });
      fetchMatches();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save match",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setMatchTypeFilter("all");
    setResultFilter("all");
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const getMatchTypeColor = (type: string) => {
    const matchType = matchTypes.find(mt => mt.value === type);
    return matchType?.color || "bg-gray-100 text-gray-800";
  };

  const getMatchTypeLabel = (type: string) => {
    const matchType = matchTypes.find(mt => mt.value === type);
    return matchType?.label || type;
  };

  const getResultColor = (result?: string) => {
    if (!result) return "bg-gray-100 text-gray-800";
    const resultType = results.find(r => r.value === result);
    return resultType?.color || "bg-gray-100 text-gray-800";
  };

  const getResultLabel = (result?: string) => {
    if (!result) return "Not Played";
    const resultType = results.find(r => r.value === result);
    return resultType?.label || result;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getWinRate = () => {
    const playedMatches = matches.filter(m => m.result);
    const wins = matches.filter(m => m.result === "win").length;
    if (playedMatches.length === 0) return 0;
    return Math.round((wins / playedMatches.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Match Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Schedule, track, and manage all club matches
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              opponent: "",
              matchDate: "",
              location: "",
              matchType: "friendly",
              result: "",
              score: "",
            });
            setDialogOpen(true);
          }}
          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Schedule Match
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Total Matches
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {pagination.total}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Wins
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {matches.filter(m => m.result === "win").length}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">
                  Losses
                </p>
                <p className="text-2xl font-bold text-red-900 dark:text-red-100">
                  {matches.filter(m => m.result === "loss").length}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Draws
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {matches.filter(m => m.result === "draw").length}
                </p>
              </div>
              <Users className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Win Rate
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {getWinRate()}%
                </p>
              </div>
              <Trophy className="w-8 h-8 text-purple-500" />
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
                placeholder="Search matches by name or opponent..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={matchTypeFilter} onValueChange={setMatchTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Match Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {matchTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={resultFilter} onValueChange={setResultFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Result" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                {results.map((result) => (
                  <SelectItem key={result.value} value={result.value}>
                    {result.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {(searchTerm || matchTypeFilter !== "all" || resultFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Matches Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Matches List</span>
            <Badge variant="secondary">{pagination.total} Total Matches</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : matches.length === 0 ? (
            <div className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No matches found</p>
              {(searchTerm || matchTypeFilter !== "all" || resultFilter !== "all") && (
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
                      <th className="px-6 py-3 text-left text-sm font-semibold">Match</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Opponent</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Location</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold">Result</th>
                      <th className="px-6 py-3 text-center text-sm font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y dark:divide-gray-700">
                    {matches.map((match) => (
                      <tr
                        key={match.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 dark:text-white">
                            {match.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Users className="w-3 h-3 mr-1" />
                            {match.opponent}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(match.matchDate)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {match.location ? (
                            <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                              <MapPin className="w-3 h-3 mr-1" />
                              {match.location}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">—</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <Badge className={getMatchTypeColor(match.matchType)}>
                            {getMatchTypeLabel(match.matchType)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4">
                          {match.result ? (
                            <div>
                              <Badge className={getResultColor(match.result)}>
                                {getResultLabel(match.result)}
                              </Badge>
                              {match.score && (
                                <div className="text-xs text-gray-500 mt-1">
                                  Score: {match.score}
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">Not Played</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(match)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(match.id)}
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
                    {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
                    of {pagination.total} matches
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
                      {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                        let pageNum;
                        if (pagination.totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (pagination.page <= 3) {
                          pageNum = i + 1;
                        } else if (pagination.page >= pagination.totalPages - 2) {
                          pageNum = pagination.totalPages - 4 + i;
                        } else {
                          pageNum = pagination.page - 2 + i;
                        }
                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className="w-8 h-8"
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
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

      {/* Create/Edit Match Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Match" : "Schedule New Match"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Match Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Premier League Final"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Opponent Team <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.opponent}
                onChange={(e) => setFormData({ ...formData, opponent: e.target.value })}
                placeholder="Opponent team name"
                disabled={formData.matchType === "senior_junior"}
              />
              {formData.matchType === "senior_junior" && (
                <p className="text-xs text-gray-500 mt-1">
                  Senior–Junior match: opponent is set to Junior Team.
                </p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">
                Match Date <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                value={formData.matchDate}
                onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Stadium/Venue name"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Match Type</label>
              <Select
                value={formData.matchType}
                onValueChange={(value) => setFormData({ ...formData, matchType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select match type" />
                </SelectTrigger>
                <SelectContent>
                  {matchTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Result</label>
              <Select
                value={formData.result || "none"}
                onValueChange={(value) => setFormData({ ...formData, result: value === "none" ? "" : value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Not Played</SelectItem>
                  {results.map((result) => (
                    <SelectItem key={result.value} value={result.value}>
                      {result.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Score</label>
              <Input
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: e.target.value })}
                placeholder={formData.matchType === "senior_junior" ? "e.g., Senior-Junior (3-2)" : "e.g., 3-2"}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.matchType === "senior_junior"
                  ? "Format: Senior Score - Junior Score"
                  : "Format: Home Score - Away Score"}
              </p>
            </div>
            <Button onClick={handleSave} className="w-full">
              {editingId ? "Update Match" : "Schedule Match"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
