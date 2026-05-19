import type { Event } from "@/types/club";
import SectionHeader from "./SectionHeader";
import Image from "next/image";

const EVENT_IMAGES: Record<string, string> = {
  religious: "/assets/religious.png",
  social: "/assets/social.png",
  picnic: "/assets/picnic.png",
  sports: "/assets/sports.png",
  anniversary: "/assets/anniversary.png",
  meeting: "/assets/meeting.png",
  tournament: "/assets/tournament.png",
  other: "/assets/event.png",
};

const EVENT_ICONS: Record<string, string> = {
  religious: "🌙",
  social: "🎉",
  picnic: "🏖️",
  sports: "🏆",
  anniversary: "🎂",
  meeting: "🤝",
  tournament: "🏆",
  other: "📅",
};

const DEFAULT_EVENTS: Event[] = [
  {
    id: "1",
    name: "Iftar Gathering",
    type: "religious",
    eventDate: new Date().toISOString(),
    location: "Club Ground",
    description: "Ramadan Month • Club Ground",
  },
  {
    id: "2",
    name: "Eid Reunion",
    type: "social",
    eventDate: new Date().toISOString(),
    location: "Club House",
    description: "Eid-ul-Fitr • All Members",
  },
  {
    id: "3",
    name: "Picnic 2025",
    type: "picnic",
    eventDate: new Date().toISOString(),
    location: "Outside",
    description: "Winter Season • Somewhere Outside",
  },
  {
    id: "4",
    name: "Seasonal Tournament",
    type: "tournament",
    eventDate: new Date().toISOString(),
    location: "Local Ground",
    description: "Annual • Local Ground",
  },
  {
    id: "5",
    name: "Club Foundation Day",
    type: "anniversary",
    eventDate: new Date().toISOString(),
    description: "Every Year • Special Celebration",
  },
  {
    id: "6",
    name: "Member Meeting",
    type: "meeting",
    eventDate: new Date().toISOString(),
    location: "Club House",
    description: "Monthly • Club House",
  },
];

const TYPE_LABELS: Record<string, string> = {
  religious: "Religious Event",
  social: "Social Event",
  picnic: "Annual Gathering",
  tournament: "Sports Event",
  anniversary: "Anniversary",
  meeting: "Organizational",
  other: "Event",
};

interface EventsProps {
  events?: Event[];
}

export default function Events({ events = DEFAULT_EVENTS }: EventsProps) {
  return (
    <section id="events" className="bg-[#134d2e] py-16 md:py-20 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader tag="Upcoming & Recent" title="Events" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="relative bg-[#0a2e1a]/60 border border-[#c9a227]/15 overflow-hidden transition-all duration-300 group hover:border-[#c9a227]/40 hover:-translate-y-1 cursor-default"
            >
              {/* Background Image */}
              <div className="absolute inset-0 opacity-10 z-0">
                <Image
                  src={EVENT_IMAGES[event.type] || EVENT_IMAGES.other}
                  alt={event.type}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Left accent bar */}
              <div className="absolute top-0 left-0 w-1 h-0 bg-[#c9a227] transition-all duration-500 group-hover:h-full z-10" />

              {/* Content */}
              <div className="relative z-10 p-7">
                <span className="block text-[#c9a227] text-[10px] font-bold tracking-[3px] uppercase mb-3">
                  {TYPE_LABELS[event.type] ?? "Event"}
                </span>
                <div
                  className="text-white leading-tight mb-2"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.8rem",
                  }}
                >
                  {event.name}
                </div>
                <div className="text-[#a8b8a0] text-[13px] tracking-wide">
                  {event.description ?? event.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
