import Image from "next/image";
import type { MemberProfile, TeamCategory } from "@/types/club";
import SectionHeader from "./SectionHeader";

const DEFAULT_MEMBERS: MemberProfile[] = [
  { id: "1", name: "রাহিম আলী", jerseyNumber: "10", teamCategory: "SENIOR" },
  { id: "2", name: "কামাল হোসেন", jerseyNumber: "7", teamCategory: "SENIOR" },
  { id: "3", name: "সাকিব মিয়া", jerseyNumber: "1", teamCategory: "JUNIOR" },
  { id: "4", name: "রিয়াজ উদ্দিন", jerseyNumber: "5", teamCategory: "JUNIOR" },
  { id: "5", name: "তানভীর আহমেদ", jerseyNumber: "11", teamCategory: "JUNIOR" },
  { id: "6", name: "জামাল শেখ", jerseyNumber: "4", teamCategory: "GUEST" },
];

const CATEGORY_CONFIG: Record<TeamCategory, { label: string; className: string }> = {
  SENIOR: { label: "সিনিয়র", className: "bg-[#c9a227]/20 text-[#f0c94a]" },
  JUNIOR: { label: "জুনিয়র", className: "bg-green-900/40 text-green-400" },
  GUEST: { label: "গেস্ট", className: "bg-blue-900/30 text-blue-300" },
};

function getInitials(name: string) {
  return name.charAt(0);
}

interface MembersProps {
  members?: MemberProfile[];
}

export default function Members({ members = DEFAULT_MEMBERS }: MembersProps) {
  return (
    <section id="members" className="bg-[#0a2e1a] py-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader tag="আমাদের পরিবার" title="সদস্যগণ" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {members.map((member) => {
            const cat = CATEGORY_CONFIG[member.teamCategory];
            return (
              <div
                key={member.id}
                className="relative bg-[#134d2e] border border-[#c9a227]/12 p-5 text-center transition-all duration-300 group hover:border-[#c9a227] hover:-translate-y-1 overflow-hidden"
              >
                {/* Jersey number badge */}
                {member.jerseyNumber && (
                  <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[#c9a227] text-[#0a2e1a] text-xs font-black flex items-center justify-center">
                    {member.jerseyNumber}
                  </div>
                )}

                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-[#1e7a47] flex items-center justify-center mx-auto mb-3 border-2 border-[#c9a227]/30 overflow-hidden">
                  {member.photoUrl ? (
                    <Image
                      src={member.photoUrl}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span
                      className="text-[#c9a227]"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.5rem" }}
                    >
                      {getInitials(member.name)}
                    </span>
                  )}
                </div>

                <div
                  className="text-white leading-tight mb-1"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
                >
                  {member.name}
                </div>

                <span
                  className={`inline-block text-[9px] font-bold tracking-[2px] uppercase px-3 py-1 mt-1 ${cat.className}`}
                >
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>

        <p className="text-center mt-8 text-[#a8b8a0] text-xs tracking-[2px] uppercase">
          এগুলো ডিফল্ট ডেটা — Admin থেকে আসল সদস্য তথ্য দিয়ে পরিবর্তন করুন
        </p>
      </div>
    </section>
  );
}
