// app/page.tsx  (or app/(landing)/page.tsx)
// Fetches real data from your DB and passes to components.
// Replace the mock fetch functions with your actual Prisma calls.

import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import StatsBar from "@/components/landing/StatsBar";
import About from "@/components/landing/About";
import Events from "@/components/landing/Events";
import Matches from "@/components/landing/Matches";
import Gallery from "@/components/landing/Gallery";
import Members from "@/components/landing/Members";
import Footer from "@/components/landing/Footer";

import type { ClubStats, Event, GalleryItem, HeroSlide, Match, MemberProfile } from "@/types/club";

// ─── Data fetching (server-side) ────────────────────────────────────────────
// Replace these with real Prisma queries in your API routes / server actions

async function getHeroSlides(): Promise<HeroSlide[]> {
  // Example Prisma: return prisma.galleryItem.findMany({ where: { featured: true }, take: 5 })
  return [];
}

async function getStats(): Promise<ClubStats> {
  // Example Prisma:
  // const [members, matches, events] = await Promise.all([
  //   prisma.memberProfile.count(),
  //   prisma.match.count(),
  //   prisma.event.count(),
  // ])
  return {
    totalMembers: 24,
    totalMatches: 18,
    totalWins: 11,
    totalEvents: 7,
    totalTrophies: 3,
  };
}

async function getRecentEvents(): Promise<Event[]> {
  // Example Prisma:
  // return prisma.event.findMany({ orderBy: { eventDate: "desc" }, take: 6 })
  return [];
}

async function getRecentMatches(): Promise<Match[]> {
  // Example Prisma:
  // return prisma.match.findMany({ orderBy: { matchDate: "desc" }, take: 5 })
  return [];
}

async function getGalleryItems(): Promise<GalleryItem[]> {
  // Example Prisma:
  // return prisma.galleryItem.findMany({ orderBy: { createdAt: "desc" }, take: 5 })
  return [];
}

async function getMembers(): Promise<MemberProfile[]> {
  // Example Prisma:
  // return prisma.memberProfile.findMany({ orderBy: { joiningDate: "asc" } })
  return [];
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function LandingPage() {
  const [slides, stats, events, matches, galleryItems, members] =
    await Promise.all([
      getHeroSlides(),
      getStats(),
      getRecentEvents(),
      getRecentMatches(),
      getGalleryItems(),
      getMembers(),
    ]);

  return (
    <main className="bg-[#0a2e1a] min-h-screen">
      <Navbar />
      <Hero slides={slides} />
      <StatsBar stats={stats} />
      <About />
      <Events events={events} />
      <Matches matches={matches} />
      <Gallery items={galleryItems} />
      <Members members={members} />
      <Footer />
    </main>
  );
}
