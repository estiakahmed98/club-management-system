import type { Match, MatchResult } from "@/types/club";
import SectionHeader from "./SectionHeader";

const DEFAULT_MATCHES: Match[] = [
  {
    id: "1",
    name: "Friendly",
    opponent: "Star XI",
    matchDate: "2025-03-15",
    matchType: "friendly",
    result: "win",
    score: "3-1",
    location: "Local Stadium",
  },
  {
    id: "2",
    name: "League",
    opponent: "Green FC",
    matchDate: "2025-02-02",
    matchType: "league",
    result: "draw",
    score: "2-2",
  },
  {
    id: "3",
    name: "Friendly",
    opponent: "Youth Boys",
    matchDate: "2025-01-18",
    matchType: "friendly",
    result: "win",
    score: "4-0",
  },
  {
    id: "4",
    name: "Upcoming",
    opponent: "United XI",
    matchDate: "2025-06-10",
    matchType: "friendly",
    result: null,
  },
  {
    id: "5",
    name: "League",
    opponent: "Rangers FC",
    matchDate: "2024-12-05",
    matchType: "league",
    result: "loss",
    score: "1-2",
  },
];

const RESULT_CONFIG: Record<
  NonNullable<MatchResult> | "upcoming",
  { label: string; className: string }
> = {
  win: {
    label: "Win",
    className: "bg-green-900/40 text-green-400",
  },
  loss: {
    label: "Loss",
    className: "bg-red-900/40 text-red-400",
  },
  draw: {
    label: "Draw",
    className: "bg-[#c9a227]/20 text-[#f0c94a]",
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-blue-900/30 text-blue-300",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface MatchesProps {
  matches?: Match[];
}

export default function Matches({
  matches = DEFAULT_MATCHES,
}: MatchesProps) {
  return (
    <section id="matches" className="bg-[#0a2e1a] py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-5xl mx-auto">
        <SectionHeader tag="On the Field" title="Match Records" />

        <div className="divide-y divide-[#c9a227]/10">
          {matches.map((match) => {
            const resultKey: keyof typeof RESULT_CONFIG =
              match.result ?? "upcoming";

            const config = RESULT_CONFIG[resultKey];
            const isPast = match.result !== null;

            return (
              <div
                key={match.id}
                className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-6 px-4 transition-colors hover:bg-[#c9a227]/3"
              >
                {/* Home team */}
                <div className="flex flex-col gap-1">
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    AMFFC
                  </span>

                  <span className="text-[#a8b8a0] text-[10px] tracking-[2px] uppercase">
                    Aulai Mohonpur
                  </span>
                </div>

                {/* Center */}
                <div className="text-center min-w-[100px]">
                  <div
                    className="text-[#c9a227] leading-none"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "2.5rem",
                    }}
                  >
                    {isPast
                      ? match.score?.replace("-", " – ")
                      : "– vs –"}
                  </div>

                  <div className="text-[#a8b8a0] text-[11px] tracking-[1px] mt-1">
                    {formatDate(match.matchDate)}
                  </div>

                  <span
                    className={`inline-block text-[10px] font-bold tracking-[2px] uppercase px-3 py-1 mt-2 ${config.className}`}
                  >
                    {config.label}
                  </span>
                </div>

                {/* Away team */}
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="text-white"
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.5rem",
                    }}
                  >
                    {match.opponent}
                  </span>

                  <span className="text-[#a8b8a0] text-[10px] tracking-[2px] uppercase">
                    Opponent
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
