"use client";

import { useEffect, useState } from "react";
import MemberCard from "../MemberCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Phone,
  Droplet,
  Shirt,
  Mail,
  Calendar,
  Footprints,
  Trophy,
  User,
  Tag,
} from "lucide-react";

interface Member {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  bloodGroup?: string;
  jerseySize?: string;
  jerseyNumber?: string;
  teamCategory?: string;
  footballPosition?: string | null;
  cricketRole?: string | null;
  imageUrl?: string | null;
  address?: string;
  bio?: string;
  joiningDate?: string;
  rating?: number;
}

export default function MemberMarquee() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await fetch("/api/member");
        const data = await res.json();
        if (data.success) {
          setMembers(data.members);
        }
      } catch (error) {
        console.error("Error fetching members for marquee:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  const handleMemberClick = (member: Member) => {
    setSelectedMember(member);
    setModalOpen(true);
  };

  const getTeamCategoryColor = (category?: string) => {
    const colors: Record<string, string> = {
      JUNIOR:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
      SENIOR:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
      GUEST: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    };
    return colors[category || "GUEST"] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-[360px] items-center justify-center bg-[#0a2e1a]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#c9a227] border-t-transparent"></div>
      </div>
    );
  }

  if (members.length === 0) return null;

  return (
    <>
      <div className="w-full bg-[#0a2e1a] py-12 overflow-hidden relative">
        {/* Background Gradient Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-20 bg-linear-to-r from-[#0a2e1a] to-transparent z-20 pointer-events-none"></div>
        <div className="absolute right-0 top-0 bottom-0 w-20 bg-linear-to-l from-[#0a2e1a] to-transparent z-20 pointer-events-none"></div>

        {/* Marquee Track */}
        <div className="flex w-full overflow-x-hidden">
          <div className="flex gap-6 animate-marquee whitespace-nowrap hover:paused">
            {/* First Loop */}
            {members.map((member) => (
              <div
                key={`first-${member.id}`}
                className="inline-block whitespace-normal cursor-pointer transition-transform hover:scale-105 duration-300"
                onClick={() => handleMemberClick(member)}
              >
                <MemberCard member={member} />
              </div>
            ))}

            {/* Second Loop for Seamless Infinite Effect */}
            {members.map((member) => (
              <div
                key={`second-${member.id}`}
                className="inline-block whitespace-normal cursor-pointer transition-transform hover:scale-105 duration-300"
                onClick={() => handleMemberClick(member)}
              >
                <MemberCard member={member} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Member Details Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="w-[94vw] max-w-4xl max-h-[90dvh] overflow-y-auto border-0 bg-[#111633] p-0 text-white rounded-2xl sm:rounded-3xl">
          {selectedMember && (
            <div className="grid grid-cols-1 md:grid-cols-[45%_55%]">
              {/* Image */}
              <div className="relative bg-linear-to-b from-[#1b2250] to-[#0b1028] p-4 md:p-6">
                <div className="absolute left-4 top-4 z-10 rounded-full bg-white/10 px-3 py-1 text-sm font-bold">
                  #{selectedMember.jerseyNumber || "N/A"}
                </div>

                <div className="mx-auto flex h-[260px] max-w-[320px] items-end justify-center md:h-[520px]">
                  <img
                    src={selectedMember.imageUrl || "/assets/memberimage.png"}
                    alt={selectedMember.name}
                    className="h-full w-full rounded-xl object-cover md:object-contain"
                  />
                </div>
              </div>

              {/* Details */}
              <div className="p-5 md:p-8">
                <DialogHeader>
                  <DialogTitle className="text-3xl font-bold leading-tight">
                    {selectedMember.name}
                  </DialogTitle>
                </DialogHeader>

                <Badge className="mt-3 bg-[#c9a227] text-[#0a2e1a] hover:bg-[#c9a227]">
                  {selectedMember.teamCategory || "Member"}
                </Badge>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <InfoBox label="Phone" value={selectedMember.phone} />
                  <InfoBox label="Email" value={selectedMember.email} />
                  <InfoBox
                    label="Blood Group"
                    value={selectedMember.bloodGroup}
                  />
                  <InfoBox
                    label="Jersey Size"
                    value={selectedMember.jerseySize}
                  />
                  <InfoBox
                    label="Football"
                    value={selectedMember.footballPosition}
                  />
                  <InfoBox label="Cricket" value={selectedMember.cricketRole} />
                  <InfoBox
                    label="Joined"
                    value={formatDate(selectedMember.joiningDate)}
                  />
                  <InfoBox
                    label="Jersey No"
                    value={selectedMember.jerseyNumber}
                  />
                </div>

                {selectedMember.address && (
                  <InfoWide label="Address" value={selectedMember.address} />
                )}

                {selectedMember.bio && (
                  <InfoWide label="Bio" value={selectedMember.bio} />
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  return (
    <div className="min-w-0 rounded-2xl bg-white/10 p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-1 wrap-break-word text-sm font-bold leading-snug">
        {value || "N/A"}
      </p>
    </div>
  );
}

function InfoWide({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="mt-3 rounded-2xl bg-white/10 p-4">
      <p className="text-xs text-white/50">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-relaxed">
        {value || "N/A"}
      </p>
    </div>
  );
}
