"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SectionHeader from "./SectionHeader";
import MemberCard from "../MemberCard";

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
  teamCategory?: string;
  joiningDate?: string;
  playsFootball?: boolean;
  footballPosition?: string | null;
  playsCricket?: boolean;
  cricketRole?: string | null;
  rating?: number;
  imageUrl?: string | null;
}

export default function Members() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMembers() {
      try {
        const res = await fetch("/api/member", {
          cache: "no-store",
        });

        const data = await res.json();
        setMembers(data.members || []);
      } catch (error) {
        console.error("Failed to load members", error);
      } finally {
        setLoading(false);
      }
    }

    loadMembers();
  }, []);

  const marqueeMembers = [...members, ...members];

  return (
    <section id="members" className="bg-[#0a2e1a] py-24 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-10">
          <SectionHeader tag="Our Family" title="Members" />

          <Link
            href="/landing/members"
            className="rounded-full bg-[#c9a227] px-6 py-3 text-sm font-black uppercase tracking-wider text-[#0a2e1a] hover:bg-white transition"
          >
            All Members
          </Link>
        </div>

        {loading ? (
          <p className="text-center text-white">Loading members...</p>
        ) : members.length === 0 ? (
          <p className="text-center text-white">No members found.</p>
        ) : (
          <div className="relative w-full overflow-hidden">
            <div className="flex w-max gap-8 animate-member-marquee">
              {marqueeMembers.map((member, index) => (
                <div
                  key={`${member.id}-${index}`}
                  className="shrink-0"
                >
                  <MemberCard member={member} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes member-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .animate-member-marquee {
          animation: member-marquee 35s linear infinite;
        }

        .animate-member-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
}