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
import { prisma } from "@/lib/db";

// ─── Data fetching (server-side) ────────────────────────────────────────────
// Replace these with real Prisma queries in your API routes / server actions

async function getHeroSlides(): Promise<HeroSlide[]> {
  return [
    { id: "1", imageUrl: "/assets/image.jpeg", title: "মাঠের লড়াই" },
    { id: "2", imageUrl: "/assets/image1.jpeg", title: "একতার শক্তি" },
    { id: "3", imageUrl: "/assets/image3.jpeg", title: "ভবিষ্যতের স্বপ্ন" },
  ];
}

async function getStats(): Promise<ClubStats> {
  const [totalMembers, totalMatches, totalEvents, totalWins] =
    await Promise.all([
      prisma.memberProfile.count(),
      prisma.match.count(),
      prisma.event.count(),
      prisma.match.count({ where: { result: "win" } }),
    ]);

  return {
    totalMembers,
    totalMatches,
    totalWins,
    totalEvents,
    totalTrophies: 0,
  };
}

async function getRecentEvents(): Promise<Event[]> {
  const events = await prisma.event.findMany({
    orderBy: { eventDate: "desc" },
    take: 6,
  });
  return events as unknown as Event[];
}

async function getRecentMatches(): Promise<Match[]> {
  const matches = await prisma.match.findMany({
    orderBy: { matchDate: "desc" },
    take: 5,
  });
  return matches as unknown as Match[];
}

async function getGalleryItems(): Promise<GalleryItem[]> {
  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
    take: 12,
  });
  return items as unknown as GalleryItem[];

  /* return [
    { id: "1", title: "ম্যাচের মুহূর্ত", imageUrl: "/assets/image.jpeg", description: "ক্রীড়া • ২০২৫" },
    { id: "2", title: "ইফতার পার্টি ২০২৫", imageUrl: "/assets/image1.jpeg", description: "ইভেন্ট • রমজান" },
    { id: "3", title: "চ্যাম্পিয়নস কাপ", imageUrl: "/assets/image3.jpeg", description: "টুর্নামেন্ট • ২০২৪" },
    { id: "4", title: "ঈদ সেলিব্রেশন", imageUrl: "/assets/image4.jpeg", description: "ইভেন্ট • ২০২৪" },
    { id: "5", title: "পিকনিক ২০২৪", imageUrl: "/assets/image5.jpeg", description: "আনন্দ • প্রকৃতি" },
    { id: "6", title: "ট্রেনিং সেশন", imageUrl: "/assets/image6.jpeg", description: "প্রস্তুতি • ২০২৫" },
  ]; */
}

async function getMembers(): Promise<MemberProfile[]> {
  const members = await prisma.memberProfile.findMany({
    orderBy: { joiningDate: "asc" },
    take: 12,
  });
  return members as unknown as MemberProfile[];
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
