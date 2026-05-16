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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Trophy,
  Calendar,
  MapPin,
  DollarSign,
  Users,
  Medal,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location?: string;
  entryFee: number;
  totalPrize: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TournamentPosition {
  id: string;
  tournamentId: string;
  position: number;
  teamName: string;
  prize: number;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function TournamentsPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [positions, setPositions] = useState<Record<string, TournamentPosition[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [positionsDialogOpen, setPositionsDialogOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    entryFee: 0,
    totalPrize: 0,
    description: "",
  });
  const [positionForm, setPositionForm] = useState({
    position: 1,
    teamName: "",
    prize: 0,
  });

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch tournaments with filters and pagination
  const fetchTournaments = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });
      
      if (debouncedSearch) params.append("search", debouncedSearch);
      if (statusFilter !== "all") params.append("status", statusFilter);

      const response = await fetch(`/api/admin/tournaments?${params}`);
      if (!response.ok) throw new Error("Failed to fetch tournaments");
      
      const data = await response.json();
      setTournaments(data.tournaments);
      setPagination(data.pagination);
      
      // Fetch positions for each tournament
      const positionsData: Record<string, TournamentPosition[]> = {};
      for (const tournament of data.tournaments) {
        const posResponse = await fetch(`/api/admin/tournaments/${tournament.id}/positions`);
        if (posResponse.ok) {
          positionsData[tournament.id] = await posResponse.json();
        }
      }
      setPositions(positionsData);
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to load tournaments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this tournament?")) return;

    try {
      const response = await fetch(`/api/admin/tournaments/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete tournament");
      
      toast({
        title: "Success",
        description: "Tournament deleted successfully",
      });
      
      fetchTournaments();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete tournament",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (tournament: Tournament) => {
    setEditingId(tournament.id);
    setFormData({
      name: tournament.name,
      startDate: tournament.startDate.split("T")[0],
      endDate: tournament.endDate.split("T")[0],
      location: tournament.location || "",
      entryFee: tournament.entryFee,
      totalPrize: tournament.totalPrize,
      description: tournament.description || "",
    });
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      toast({
        title: "Validation Error",
        description: "Tournament name, start date, and end date are required",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast({
        title: "Validation Error",
        description: "End date must be after start date",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingId
        ? `/api/admin/tournaments/${editingId}`
        : "/api/admin/tournaments";
      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save tournament");
      }

      toast({
        title: "Success",
        description: editingId
          ? "Tournament updated successfully"
          : "Tournament created successfully",
      });

      setDialogOpen(false);
      setEditingId(null);
      setFormData({
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        entryFee: 0,
        totalPrize: 0,
        description: "",
      });
      fetchTournaments();
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to save tournament",
        variant: "destructive",
      });
    }
  };

  const handleAddPosition = async () => {
    if (!selectedTournament) return;
    
    if (!positionForm.teamName) {
      toast({
        title: "Validation Error",
        description: "Team name is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`/api/admin/tournaments/${selectedTournament.id}/positions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(positionForm),
      });

      if (!response.ok) throw new Error("Failed to add position");

      toast({
        title: "Success",
        description: "Position added successfully",
      });

      setPositionForm({
        position: positions[selectedTournament.id]?.length + 1 || 1,
        teamName: "",
        prize: 0,
      });
      
      // Refresh positions
      const posResponse = await fetch(`/api/admin/tournaments/${selectedTournament.id}/positions`);
      if (posResponse.ok) {
        setPositions({
          ...positions,
          [selectedTournament.id]: await posResponse.json(),
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to add position",
        variant: "destructive",
      });
    }
  };

  const handleDeletePosition = async (positionId: string) => {
    if (!selectedTournament) return;
    
    if (!confirm("Are you sure you want to delete this position?")) return;

    try {
      const response = await fetch(`/api/admin/tournaments/${selectedTournament.id}/positions/${positionId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete position");

      toast({
        title: "Success",
        description: "Position deleted successfully",
      });

      // Refresh positions
      const posResponse = await fetch(`/api/admin/tournaments/${selectedTournament.id}/positions`);
      if (posResponse.ok) {
        setPositions({
          ...positions,
          [selectedTournament.id]: await posResponse.json(),
        });
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete position",
        variant: "destructive",
      });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  const handlePageChange = (newPage: number) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (now < start) return { label: "Upcoming", color: "bg-blue-100 text-blue-800" };
    if (now > end) return { label: "Completed", color: "bg-green-100 text-green-800" };
    return { label: "Ongoing", color: "bg-yellow-100 text-yellow-800" };
  };

  const getPositionMedal = (position: number) => {
    switch(position) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return `${position}th`;
    }
  };

  const totalPrizeMoney = tournaments.reduce((sum, t) => sum + t.totalPrize, 0);
  const totalEntryFees = tournaments.reduce((sum, t) => sum + t.entryFee, 0);
  const activeTournaments = tournaments.filter(t => getStatus(t.startDate, t.endDate).label === "Ongoing").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Tournament Management
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage tournaments, track results, and distribute prizes
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingId(null);
            setFormData({
              name: "",
              startDate: "",
              endDate: "",
              location: "",
              entryFee: 0,
              totalPrize: 0,
              description: "",
            });
            setDialogOpen(true);
          }}
          className="bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-linear-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">
                  Total Tournaments
                </p>
                <p className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
                  {pagination.total}
                </p>
              </div>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Total Prize Money
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  ৳{totalPrizeMoney.toLocaleString()}
                </p>
              </div>
              <Medal className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Active Tournaments
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {activeTournaments}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">
                  Total Registration Fee
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  ৳{totalEntryFees.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-purple-500" />
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
                placeholder="Search tournaments by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            {(searchTerm || statusFilter !== "all") && (
              <Button variant="outline" onClick={clearFilters} className="gap-2">
                <X className="w-4 h-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tournaments List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600"></div>
          </div>
        ) : tournaments.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No tournaments found</p>
              {(searchTerm || statusFilter !== "all") && (
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          tournaments.map((tournament) => {
            const status = getStatus(tournament.startDate, tournament.endDate);
            const tournamentPositions = positions[tournament.id] || [];
            
            return (
              <Card key={tournament.id}>
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                            <Trophy className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                              {tournament.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {tournament.location && (
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {tournament.location}
                                </span>
                              )}
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </div>

                      {/* Description */}
                      {tournament.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                          {tournament.description}
                        </p>
                      )}

                      {/* Financial Info */}
                      <div className="flex flex-wrap gap-4 text-sm mb-4">
                        <span className="text-gray-600 dark:text-gray-300">
                          Entry Fee: <span className="font-semibold">৳{tournament.entryFee.toLocaleString()}</span>
                        </span>
                        <span className="text-green-600 dark:text-green-400 font-semibold">
                          Prize Pool: ৳{tournament.totalPrize.toLocaleString()}
                        </span>
                      </div>

                      {/* Positions/Winners */}
                      {tournamentPositions.length > 0 && (
                        <div className="mt-3">
                          <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                            <Medal className="w-4 h-4" />
                            Winners
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {tournamentPositions.map((pos) => (
                              <Badge key={pos.id} variant="outline" className="text-sm">
                                {getPositionMedal(pos.position)}: {pos.teamName} (৳{pos.prize.toLocaleString()})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTournament(tournament);
                          setPositionsDialogOpen(true);
                        }}
                      >
                        <Medal className="w-4 h-4 mr-2" />
                        Positions
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tournament)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tournament.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}

        {/* Pagination */}
        {!loading && pagination.totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500">
              Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
              {Math.min(pagination.page * pagination.limit, pagination.total)}{" "}
              of {pagination.total} tournaments
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
      </div>

      {/* Create/Edit Tournament Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingId ? "Edit Tournament" : "Create New Tournament"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Tournament Name <span className="text-red-500">*</span>
              </label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Summer Cup 2024"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">
                  End Date <span className="text-red-500">*</span>
                </label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Tournament venue"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Entry Fee (BDT)</label>
                <Input
                  type="number"
                  value={formData.entryFee}
                  onChange={(e) => setFormData({ ...formData, entryFee: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Total Prize (BDT)</label>
                <Input
                  type="number"
                  value={formData.totalPrize}
                  onChange={(e) => setFormData({ ...formData, totalPrize: parseFloat(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Description</label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tournament description"
              />
            </div>
            <Button onClick={handleSave} className="w-full">
              {editingId ? "Update Tournament" : "Create Tournament"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Positions Management Dialog */}
      <Dialog open={positionsDialogOpen} onOpenChange={setPositionsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Manage Tournament Positions - {selectedTournament?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Add Position Form */}
            <div className="space-y-3">
              <h4 className="font-medium">Add Winner/Position</h4>
              <div className="grid grid-cols-3 gap-2">
                <Input
                  type="number"
                  placeholder="Position"
                  value={positionForm.position}
                  onChange={(e) => setPositionForm({ ...positionForm, position: parseInt(e.target.value) || 1 })}
                />
                <Input
                  placeholder="Team Name"
                  value={positionForm.teamName}
                  onChange={(e) => setPositionForm({ ...positionForm, teamName: e.target.value })}
                  className="col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Prize Amount"
                  value={positionForm.prize}
                  onChange={(e) => setPositionForm({ ...positionForm, prize: parseFloat(e.target.value) || 0 })}
                />
                <Button onClick={handleAddPosition} size="sm">
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>

            {/* Positions List */}
            {selectedTournament && positions[selectedTournament.id]?.length > 0 ? (
              <div className="space-y-2">
                <h4 className="font-medium">Current Positions</h4>
                <div className="space-y-2">
                  {positions[selectedTournament.id]
                    .sort((a, b) => a.position - b.position)
                    .map((pos) => (
                      <div
                        key={pos.id}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">{getPositionMedal(pos.position)}</span>
                          <span className="ml-2">{pos.teamName}</span>
                          <span className="ml-2 text-sm text-gray-500">
                            ৳{pos.prize.toLocaleString()}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeletePosition(pos.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-4">No positions added yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}