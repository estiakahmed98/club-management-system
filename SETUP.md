# AMFFC Landing Page — Setup Guide

## 1. Install Fonts (app/layout.tsx)

```tsx
import { Bebas_Neue, Barlow_Condensed, Tiro_Bangla } from "next/font/google";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["400", "600", "700"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

const tiroBangla = Tiro_Bangla({
  weight: ["400"],
  subsets: ["bengali"],
  variable: "--font-tiro",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn">
      <body className={`${bebasNeue.variable} ${barlowCondensed.variable} ${tiroBangla.variable}`}>
        {children}
      </body>
    </html>
  );
}
```

## 2. tailwind.config.ts

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        bebas: ["var(--font-bebas)", "sans-serif"],
        barlow: ["var(--font-barlow)", "sans-serif"],
        tiro: ["var(--font-tiro)", "serif"],
      },
      colors: {
        club: {
          dark: "#0a2e1a",
          mid: "#134d2e",
          accent: "#1e7a47",
          gold: "#c9a227",
          "gold-light": "#f0c94a",
          cream: "#f5f0e8",
          muted: "#a8b8a0",
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

## 3. File Structure

```
app/
  page.tsx                    ← Main landing page (server component)
  layout.tsx                  ← Add fonts here

components/
  landing/
    Navbar.tsx                ← Fixed nav with scroll effect + mobile menu
    Hero.tsx                  ← Auto-sliding hero (3.5s), accepts imageUrls from DB
    StatsBar.tsx              ← Animated counters
    SectionHeader.tsx         ← Reusable tag + title + gold line
    About.tsx                 ← Club story + SVG shield
    Events.tsx                ← Event cards grid
    Matches.tsx               ← Match results with win/loss/draw badges
    Gallery.tsx               ← Mosaic photo grid with hover overlay
    Members.tsx               ← Member cards with jersey number + category badge
    Footer.tsx                ← Links + copyright

types/
  club.ts                     ← All TypeScript types matching your Prisma schema
```

## 4. How to connect real DB data

In `page.tsx`, replace the empty `return []` in each fetch function with your Prisma calls:

```ts
// Events
return prisma.event.findMany({
  orderBy: { eventDate: "desc" },
  take: 6,
});

// Matches  
return prisma.match.findMany({
  orderBy: { matchDate: "desc" },
  take: 5,
});

// Gallery
return prisma.galleryItem.findMany({
  orderBy: { createdAt: "desc" },
  take: 5,
});

// Members
return prisma.memberProfile.findMany({
  orderBy: { joiningDate: "asc" },
});
```

Each component has defaults built in — if DB returns empty array, it shows placeholder data automatically.
