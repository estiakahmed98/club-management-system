"use client";

import { useEffect, useRef, useState } from "react";
import type { ClubStats } from "@/types/club";

interface StatItemProps {
  value: number;
  label: string;
  animate: boolean;
}

function StatItem({ value, label, animate }: StatItemProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!animate) return;
    let current = 0;
    const step = Math.ceil(value / 40);
    const timer = setInterval(() => {
      current = Math.min(current + step, value);
      setDisplay(current);
      if (current >= value) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [animate, value]);

  return (
    <div className="flex-1 max-w-[200px] text-center px-6 border-r border-[#c9a227]/20 last:border-r-0">
      <span
        className="block text-[#c9a227] leading-none mb-1"
        style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "3rem" }}
      >
        {animate ? display : value}
      </span>
      <span className="block text-[#a8b8a0] text-[10px] tracking-[3px] uppercase mt-1">
        {label}
      </span>
    </div>
  );
}

const DEFAULT_STATS: ClubStats = {
  totalMembers: 24,
  totalMatches: 18,
  totalWins: 11,
  totalEvents: 7,
  totalTrophies: 3,
};

interface StatsBarProps {
  stats?: ClubStats;
}

export default function StatsBar({ stats = DEFAULT_STATS }: StatsBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const items = [
    { value: stats.totalMembers, label: "Active Members" },
    { value: stats.totalMatches, label: "Matches Played" },
    { value: stats.totalWins, label: "Wins" },
    { value: stats.totalEvents, label: "Events Organized" },
    { value: stats.totalTrophies, label: "Trophies Won" },
  ];

  return (
    <div
      ref={ref}
      className="bg-[#134d2e] border-y border-[#c9a227]/20 py-6 px-10 flex justify-center flex-wrap gap-y-4"
    >
      {items.map((item) => (
        <StatItem key={item.label} {...item} animate={animated} />
      ))}
    </div>
  );
}