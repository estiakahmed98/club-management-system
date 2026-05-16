interface SectionHeaderProps {
  tag: string;
  title: string;
}

export default function SectionHeader({ tag, title }: SectionHeaderProps) {
  const lines = title.split("\n");
  return (
    <div className="mb-10">
      <span className="block text-[#c9a227] text-[11px] font-bold tracking-[4px] uppercase mb-3">
        {tag}
      </span>
      <h2
        className="text-white leading-none"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 5vw, 4rem)" }}
      >
        {lines.map((line, i) => (
          <span key={i} className="block">
            {line}
          </span>
        ))}
      </h2>
      <div className="w-14 h-[3px] bg-[#c9a227] mt-4" />
    </div>
  );
}
