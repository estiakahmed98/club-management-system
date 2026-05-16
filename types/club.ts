export type TeamCategory = "JUNIOR" | "SENIOR" | "GUEST";
export type MatchResult = "win" | "loss" | "draw" | null;
export type ParticipantStatus = "pending" | "joined" | "attended" | "not-attended";

export interface HeroSlide {
  id: string;
  imageUrl: string;
  title?: string;
}

export interface MemberProfile {
  id: string;
  name: string;
  jerseyNumber?: string;
  teamCategory: TeamCategory;
  photoUrl?: string;
  bloodGroup?: string;
  phone?: string;
  email?: string;
}

export interface Match {
  id: string;
  name: string;
  opponent: string;
  matchDate: string;
  location?: string;
  matchType: string;
  result: MatchResult;
  score?: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  location?: string;
  type: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
  eventId?: string;
  matchId?: string;
  tournamentId?: string;
}

export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  location?: string;
  entryFee: number;
  totalPrize: number;
  description?: string;
}

export interface ClubStats {
  totalMembers: number;
  totalMatches: number;
  totalWins: number;
  totalEvents: number;
  totalTrophies: number;
}
