// app/members/page.tsx

"use client";

import { useEffect, useMemo, useState } from "react";
import MemberCard from "@/components/MemberCard";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

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
        member.name
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        member.email
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        member.footballPosition
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        member.cricketRole
          ?.toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "ALL"
          ? true
          : member.teamCategory === category;

      return matchesSearch && matchesCategory;
    });
  }, [members, search, category]);

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
            {/* Search */}
            <input
              type="text"
              placeholder="Search member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 flex-1 rounded-xl border border-[#c9a227]/20 bg-[#0a2e1a] px-4 text-white outline-none placeholder:text-[#a8b8a0] focus:border-[#c9a227]"
            />

            {/* Filter */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-12 rounded-xl border border-[#c9a227]/20 bg-[#0a2e1a] px-4 text-white outline-none focus:border-[#c9a227]"
            >
              <option value="ALL">All Category</option>
              <option value="SENIOR">Senior</option>
              <option value="JUNIOR">Junior</option>
              <option value="GUEST">Guest</option>
            </select>
          </div>

          {/* Loading */}
          {loading ? (
            <div className="py-20 text-center text-xl text-white">
              Loading members...
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="py-20 text-center text-xl text-white">
              No members found.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {filteredMembers.map((member) => (
                <MemberCard key={member.id} member={member} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
