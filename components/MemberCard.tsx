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

export default function MemberCard({
  member,
  onClick,
}: {
  member: Member;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full sm:w-[260px] md:w-[280px] lg:w-[300px] overflow-hidden rounded-2xl border border-[#c9a227]/20 bg-[#134d2e] text-left text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-[#c9a227] hover:shadow-2xl"
    >
      {/* Image Section */}
      <div className="relative flex h-[240px] sm:h-[260px] md:h-[280px] items-center justify-center overflow-hidden bg-gradient-to-b from-[#4d6b4f] to-[#90a77d]">
        {member.imageUrl ? (
          <img
            src={member.imageUrl}
            alt={member.name}
            className="h-full w-full object-cover object-center transition duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0a2e1a] to-[#134d2e]">
            <span className="text-6xl font-black text-[#c9a227]/30">
              {member.name?.charAt(0)?.toUpperCase() || "?"}
            </span>
          </div>
        )}

        {/* Jersey Number */}
        {member.jerseyNumber && (
          <div className="absolute right-3 top-3 rounded-full bg-[#c9a227] px-3 py-1 text-xs font-black text-[#0a2e1a] shadow-md">
            #{member.jerseyNumber}
          </div>
        )}

        {/* Team Category */}
        <div className="absolute left-3 top-3 rounded-full bg-[#0a2e1a]/80 px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-[#f0c94a] backdrop-blur-sm">
          {member.teamCategory || "Member"}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Name */}
        <h3 className="text-center truncate text-lg sm:text-xl font-black uppercase tracking-wide text-white">
          {member.name}
        </h3>

        {/* Email - Hide on very small screens */}
        <p className="mt-1 hidden sm:block truncate text-center text-xs text-[#b9c9b0]">
          {member.email || "No email"}
        </p>

        {/* Phone - Show on mobile */}
        {member.phone && (
          <p className="mt-1 block sm:hidden truncate text-center text-xs text-[#b9c9b0]">
            {member.phone}
          </p>
        )}

        {/* Info Grid - Responsive columns */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Info label="Blood" value={member.bloodGroup || "-"} />
          <Info label="Jersey" value={member.jerseySize || "-"} />
          <Info
            label="Football"
            value={member.footballPosition?.substring(0, 8) || "-"}
            fullLabel={member.footballPosition}
          />
          <Info
            label="Cricket"
            value={member.cricketRole?.substring(0, 8) || "-"}
            fullLabel={member.cricketRole}
          />
        </div>

        {/* View Details Button */}
        <div className="mt-4 text-center">
          <span className="inline-block text-[10px] font-medium uppercase tracking-wider text-[#c9a227] opacity-70 transition-opacity group-hover:opacity-100">
            Tap to view details →
          </span>
        </div>
      </div>
    </button>
  );
}

function Info({
  label,
  value,
  fullLabel,
}: {
  label: string;
  value: string;
  fullLabel?: string | null;
}) {
  const displayValue = value === "-" ? "-" : value;
  const title = fullLabel && fullLabel !== "-" ? fullLabel : undefined;

  return (
    <div className="rounded-xl bg-[#0a2e1a]/80 p-2 shadow-inner transition-all duration-200 hover:bg-[#0a2e1a]">
      <p className="text-[9px] uppercase tracking-[1px] text-[#c9a227] text-center">
        {label}
      </p>
      <p 
        className="mt-1 truncate text-center text-sm font-bold text-white"
        title={title}
      >
        {displayValue}
      </p>
    </div>
  );
}