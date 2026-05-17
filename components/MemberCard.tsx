// components/MemberCard.tsx

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
}

export default function MemberCard({ member }: { member: Member }) {
  return (
    <div className="w-[230px] overflow-hidden rounded-2xl border border-[#c9a227]/20 bg-[#134d2e] text-white shadow-lg transition hover:-translate-y-1 hover:border-[#c9a227]">
      <div className="relative h-[210px] bg-[#0a2e1a]">
        <img
          src={member.imageUrl || "/default-player.png"}
          alt={member.name}
          className="h-full w-full object-cover object-top"
        />

        <div className="absolute right-3 top-3 rounded-full bg-[#c9a227] px-3 py-1 text-xs font-black text-[#0a2e1a]">
          #{member.jerseyNumber || "00"}
        </div>

        <div className="absolute left-3 top-3 rounded-full bg-[#0a2e1a]/80 px-3 py-1 text-[10px] font-bold uppercase text-[#f0c94a]">
          {member.teamCategory || "Member"}
        </div>
      </div>

      <div className="p-4 text-center">
        <h3 className="truncate text-lg font-black uppercase">
          {member.name}
        </h3>

        <p className="mt-1 truncate text-xs text-[#a8b8a0]">
          {member.email || "No email"}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <Info label="Blood" value={member.bloodGroup || "-"} />
          <Info label="Size" value={member.jerseySize || "-"} />
          <Info
            label="Football"
            value={member.footballPosition || "-"}
          />
          <Info
            label="Cricket"
            value={member.cricketRole || "-"}
          />
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-[#0a2e1a] p-2">
      <p className="text-[9px] uppercase tracking-wider text-[#c9a227]">
        {label}
      </p>
      <p className="truncate font-bold text-white">{value}</p>
    </div>
  );
}