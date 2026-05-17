// app/page.tsx

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import About from "@/components/landing/About";
import Matches from "@/components/landing/Matches";
import Events from "@/components/landing/Events";
import Gallery from "@/components/landing/Gallery";
import Footer from "@/components/landing/Footer";

import type {
  ClubStats,
  HeroSlide,
  Match,
  Event,
} from "@/types/club";

import { prisma } from "@/lib/db";
import MemberMarquee from "@/components/landing/MemberMarquee";

// ─────────────────────────────────────────────────────────────
// HERO
// ─────────────────────────────────────────────────────────────

async function getHeroSlides(): Promise<HeroSlide[]> {
  return [
    {
      id: "1",
      imageUrl: "/assets/image.jpeg",
      title: "মাঠের লড়াই",
    },
    {
      id: "2",
      imageUrl: "/assets/image1.jpeg",
      title: "একতার শক্তি",
    },
    {
      id: "3",
      imageUrl: "/assets/image3.jpeg",
      title: "ভবিষ্যতের স্বপ্ন",
    },
  ];
}

// ─────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────

async function getStats(): Promise<ClubStats> {
  const [
    totalMembers,
    totalMatches,
    totalEvents,
    totalWins,
  ] = await Promise.all([
    prisma.memberProfile.count(),
    prisma.match.count(),
    prisma.event.count(),
    prisma.match.count({
      where: {
        result: "win",
      },
    }),
  ]);

  return {
    totalMembers,
    totalMatches,
    totalWins,
    totalEvents,
    totalTrophies: 0,
  };
}

// ─────────────────────────────────────────────────────────────
// MEMBERS
// ─────────────────────────────────────────────────────────────

async function getLastMatches(): Promise<Match[]> {
  const matches = await prisma.match.findMany({
    orderBy: { matchDate: "desc" },
    take: 5,
  });

  return matches as unknown as Match[];
}

async function getLastEvents(): Promise<Event[]> {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: "desc" },
    take: 5,
  });

  return events as unknown as Event[];
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const [slides, stats, matches, events] =
    await Promise.all([
      getHeroSlides(),
      getStats(),
      getLastMatches(),
      getLastEvents(),
    ]);

  return (
    <main className="min-h-screen bg-[#0a2e1a] overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Home */}
      <section id="home">
        <Hero slides={slides} />
      </section>

      {/* Stats */}
      <StatsBar stats={stats} />

      {/* About */}
      <section id="about">
        <About />
      </section>

      {/* Member Marquee */}
      <MemberMarquee />

      {/* Matches */}
      <section id="matches">
        <Matches matches={matches} />
      </section>

      {/* Events */}
      <section id="events">
        <Events events={events} />
      </section>

      {/* Gallery */}
      <section id="gallery">
        <Gallery />
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
