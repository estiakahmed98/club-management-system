// app/members/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import MemberCard from "@/components/MemberCard";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Phone, Mail, Droplet, Shirt, Calendar, Award } from "lucide-react";

interface Member {
  id: string;
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  bloodGroup?: string;
  jerseySize?: string;
  jerseyNumber?: string;
  address?: string;
  bio?: string;
  teamCategory?: string;
  joiningDate?: string;
  playsFootball?: boolean;
  footballPosition?: string | null;
  playsCricket?: boolean;
  cricketRole?: string | null;
  rating?: number;
  imageUrl?: string | null;
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch("/api/member", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error("Failed to load members");
        }

        const data = await res.json();
        setMembers(data.members || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const matchesSearch =
        member.name?.toLowerCase().includes(search.toLowerCase()) ||
        member.email?.toLowerCase().includes(search.toLowerCase()) ||
        member.footballPosition?.toLowerCase().includes(search.toLowerCase()) ||
        member.cricketRole?.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "ALL" ? true : member.teamCategory === category;

      return matchesSearch && matchesCategory;
    });
  }, [members, search, category]);

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#0a2e1a]">
      <Navbar />
      <main className="px-6 pb-20 pt-28 md:px-10">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[4px] text-[#c9a227]">
                Club Family
              </p>
              <h1
                className="mt-2 text-4xl font-black uppercase text-white md:text-6xl"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                }}
              >
                All Members
              </h1>
            </div>

            <div className="rounded-2xl border border-[#c9a227]/20 bg-[#134d2e] px-6 py-4">
              <p className="text-sm uppercase tracking-wider text-[#c9a227]">
                Total Members
              </p>
              <h2 className="text-4xl font-black text-white">
                {filteredMembers.length}
              </h2>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-10 flex flex-col gap-4 rounded-3xl border border-[#c9a227]/20 bg-[#134d2e] p-5 md:flex-row md:items-center">
            <input
              type="text"
              placeholder="Search by name, email, position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 flex-1 rounded-xl border border-[#c9a227]/20 bg-[#0a2e1a] px-4 text-white outline-none placeholder:text-[#a8b8a0] focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 rounded-xl border border-[#c9a227]/20 bg-[#0a2e1a] px-4 text-white outline-none focus:border-[#c9a227] focus:ring-1 focus:ring-[#c9a227]"
            >
              <option value="ALL">All Categories</option>
              <option value="SENIOR">Senior</option>
              <option value="JUNIOR">Junior</option>
              <option value="GUEST">Guest</option>
            </select>
          </div>

          {/* Members Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[#c9a227] border-t-transparent"></div>
                <p className="text-xl text-white">Loading members...</p>
              </div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-xl text-white/70">No members found.</p>
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("ALL");
                }}
                className="mt-4 text-[#c9a227] hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMembers.map((member) => (
                <div key={member.id} onClick={() => handleMemberClick(member)}>
                  <MemberCard member={member} />
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Member Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0 rounded-2xl bg-gradient-to-br from-[#0a2e1a] to-[#134d2e] border border-[#c9a227]/20">
          <DialogHeader className="sr-only">
            <DialogTitle>Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <>
              {/* Close Button */}
              <button
                onClick={() => setModalOpen(false)}
                className="absolute right-4 top-4 z-20 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Left Column - Image */}
                <div className="relative bg-gradient-to-b from-[#1a4a2a] to-[#0a2e1a] p-6 rounded-l-2xl">
                  <div className="absolute left-4 top-4 z-10 rounded-full bg-[#c9a227] px-3 py-1 text-sm font-bold text-[#0a2e1a]">
                    #{selectedMember.jerseyNumber || "N/A"}
                  </div>

                  <div className="flex h-[300px] md:h-[500px] items-center justify-center">
                    {selectedMember.imageUrl ? (
                      <img
                        src={selectedMember.imageUrl}
                        alt={selectedMember.name}
                        className="h-full w-full rounded-xl object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#0a2e1a]/50">
                        <span className="text-8xl font-black text-[#c9a227]/30">
                          {selectedMember.name?.charAt(0)?.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column - Details */}
                <div className="p-6 md:p-8">
                  <h2 className="text-3xl font-bold text-white md:text-4xl">
                    {selectedMember.name}
                  </h2>

                  <Badge className="mt-3 bg-[#c9a227] text-[#0a2e1a] hover:bg-[#c9a227]">
                    {selectedMember.teamCategory || "Member"}
                  </Badge>

                  {/* Rating */}
                  {selectedMember.rating && selectedMember.rating > 0 && (
                    <div className="mt-3 flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm text-white/70">
                        Rating: {selectedMember.rating.toFixed(1)} / 10.0
                      </span>
                    </div>
                  )}

                  {/* Info Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <InfoBox
                      icon={<Phone className="h-4 w-4" />}
                      label="Phone"
                      value={selectedMember.phone}
                    />
                    <InfoBox
                      icon={<Mail className="h-4 w-4" />}
                      label="Email"
                      value={selectedMember.email}
                    />
                    <InfoBox
                      icon={<Droplet className="h-4 w-4" />}
                      label="Blood Group"
                      value={selectedMember.bloodGroup}
                    />
                    <InfoBox
                      icon={<Shirt className="h-4 w-4" />}
                      label="Jersey Size"
                      value={selectedMember.jerseySize}
                    />
                    <InfoBox
                      icon={<Shirt className="h-4 w-4" />}
                      label="Jersey No"
                      value={selectedMember.jerseyNumber}
                    />
                    <InfoBox
                      icon={<Calendar className="h-4 w-4" />}
                      label="Joined"
                      value={formatDate(selectedMember.joiningDate)}
                    />
                  </div>

                  {/* Football & Cricket Positions */}
                  {(selectedMember.footballPosition || selectedMember.cricketRole) && (
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      {selectedMember.footballPosition && (
                        <div className="rounded-xl bg-blue-500/10 p-3 border border-blue-500/20">
                          <p className="text-xs text-blue-400">Football Position</p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {selectedMember.footballPosition}
                          </p>
                        </div>
                      )}
                      {selectedMember.cricketRole && (
                        <div className="rounded-xl bg-green-500/10 p-3 border border-green-500/20">
                          <p className="text-xs text-green-400">Cricket Role</p>
                          <p className="mt-1 text-sm font-semibold text-white">
                            {selectedMember.cricketRole}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Address */}
                  {selectedMember.address && (
                    <div className="mt-4 rounded-xl bg-white/5 p-4">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-[#c9a227]" />
                        <p className="text-xs text-white/50">Address</p>
                      </div>
                      <p className="mt-1 text-sm text-white leading-relaxed">
                        {selectedMember.address}
                      </p>
                    </div>
                  )}

                  {/* Bio */}
                  {selectedMember.bio && (
                    <div className="mt-4 rounded-xl bg-white/5 p-4">
                      <p className="text-xs text-white/50">Bio</p>
                      <p className="mt-1 text-sm text-white leading-relaxed">
                        {selectedMember.bio}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InfoBox({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-3 transition-all hover:bg-white/10">
      <div className="flex items-center gap-2">
        {icon}
        <p className="text-xs text-white/50">{label}</p>
      </div>
      <p className="mt-1 text-sm font-semibold text-white break-words">
        {value || "N/A"}
      </p>
    </div>
  );
}
