import type { Event } from "@/types/club";
import SectionHeader from "./SectionHeader";

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
  { id: "1", name: "ইফতার মাহফিল", type: "religious", eventDate: new Date().toISOString(), location: "ক্লাব মাঠ", description: "রমজান মাস • ক্লাব মাঠ" },
  { id: "2", name: "ঈদ পুনর্মিলনী", type: "social", eventDate: new Date().toISOString(), location: "ক্লাব হাউস", description: "ঈদুল ফিতর • সদস্য সকল" },
  { id: "3", name: "পিকনিক ২০২৫", type: "picnic", eventDate: new Date().toISOString(), location: "বাইরে", description: "শীতকাল • বাইরে কোথাও" },
  { id: "4", name: "মৌসুমী টুর্নামেন্ট", type: "tournament", eventDate: new Date().toISOString(), location: "স্থানীয় মাঠ", description: "বার্ষিক • স্থানীয় মাঠ" },
  { id: "5", name: "ক্লাব প্রতিষ্ঠা দিবস", type: "anniversary", eventDate: new Date().toISOString(), description: "প্রতি বছর • বিশেষ উদযাপন" },
  { id: "6", name: "সদস্য সভা", type: "meeting", eventDate: new Date().toISOString(), location: "ক্লাব হাউস", description: "মাসিক • ক্লাব হাউস" },
];

const TYPE_LABELS: Record<string, string> = {
  religious: "ধর্মীয় ইভেন্ট",
  social: "সামাজিক ইভেন্ট",
  picnic: "বার্ষিক আয়োজন",
  tournament: "ক্রীড়া ইভেন্ট",
  anniversary: "বার্ষিকী",
  meeting: "সাংগঠনিক",
  other: "ইভেন্ট",
};

interface EventsProps {
  events?: Event[];
}

export default function Events({ events = DEFAULT_EVENTS }: EventsProps) {
  return (
    <section id="events" className="bg-[#134d2e] py-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <SectionHeader tag="আসন্ন ও সাম্প্রতিক" title="ইভেন্টসমূহ" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="relative bg-[#0a2e1a]/60 border border-[#c9a227]/15 p-7 overflow-hidden transition-all duration-300 group hover:border-[#c9a227]/40 hover:-translate-y-1 cursor-default"
            >
              {/* Left accent bar */}
              <div className="absolute top-0 left-0 w-1 h-0 bg-[#c9a227] transition-all duration-500 group-hover:h-full" />

              {/* Background icon */}
              <span className="absolute right-5 top-5 text-4xl opacity-[0.08] select-none">
                {EVENT_ICONS[event.type] ?? EVENT_ICONS.other}
              </span>

              <span className="block text-[#c9a227] text-[10px] font-bold tracking-[3px] uppercase mb-3">
                {TYPE_LABELS[event.type] ?? "ইভেন্ট"}
              </span>
              <div
                className="text-white leading-tight mb-2"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.8rem" }}
              >
                {event.name}
              </div>
              <div className="text-[#a8b8a0] text-[13px] tracking-wide">
                {event.description ?? event.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
