// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

interface StatCounterProps {
  target: number;
  duration?: number;
}

interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  bgClass: string;
}

interface EventData {
  id: number;
  icon: string;
  type: string;
  name: string;
  date: string;
  category: string;
}

interface MatchData {
  id: number;
  homeTeam: string;
  homeSub: string;
  awayTeam: string;
  awaySub: string;
  score: string;
  date: string;
  result: "win" | "loss" | "draw" | "upcoming";
}

interface MemberData {
  id: number;
  jersey: number;
  initial: string;
  name: string;
  position: string;
  category: "junior" | "senior" | "guest";
}

// Counter Component
const StatCounter = ({ target, duration = 2000 }: StatCounterProps) => {
  const [count, setCount] = useState(0);
  const counterRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const increment = target / (duration / 30);
          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(start));
            }
          }, 30);
        }
      },
      { threshold: 0.5 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={counterRef}>{count}</span>;
};

// Static Data
const slides: SlideData[] = [
  {
    id: 0,
    title: "Friend For Future Club",
    subtitle: "Aulai Mohonpur · Unity · Spirit · Excellence",
    bgClass: "slide-1",
  },
  {
    id: 1,
    title: "Champions League Winners",
    subtitle: "2024 Season Champions",
    bgClass: "slide-2",
  },
  {
    id: 2,
    title: "Eid Reunion 2025",
    subtitle: "Celebrating Togetherness",
    bgClass: "slide-3",
  },
];

const events: EventData[] = [
  { id: 1, icon: "🌙", type: "Religious Event", name: "Iftar Mahfil", date: "Ramadan • Club Ground", category: "iftar" },
  { id: 2, icon: "🎉", type: "Social Event", name: "Eid Reunion", date: "Eid ul Fitr • All Members", category: "eid-reunion" },
  { id: 3, icon: "🏖️", type: "Annual Event", name: "Picnic 2025", date: "Winter • Outside Venue", category: "picnic" },
  { id: 4, icon: "🏆", type: "Sports Event", name: "Season Tournament", date: "Annual • Local Ground", category: "tournament" },
  { id: 5, icon: "🎂", type: "Anniversary", name: "Club Foundation Day", date: "Yearly • Special Celebration", category: "anniversary" },
  { id: 6, icon: "🤝", type: "Organizational", name: "Member Meeting", date: "Monthly • Club House", category: "meeting" },
];

const matches: MatchData[] = [
  { id: 1, homeTeam: "AMFFC", homeSub: "Aulai Mohonpur", awayTeam: "Star XI", awaySub: "Opponent", score: "3 – 1", date: "March 15, 2025", result: "win" },
  { id: 2, homeTeam: "AMFFC", homeSub: "Aulai Mohonpur", awayTeam: "Green FC", awaySub: "Opponent", score: "2 – 2", date: "February 2, 2025", result: "draw" },
  { id: 3, homeTeam: "AMFFC", homeSub: "Aulai Mohonpur", awayTeam: "Youth Boys", awaySub: "Opponent", score: "4 – 0", date: "January 18, 2025", result: "win" },
  { id: 4, homeTeam: "AMFFC", homeSub: "Aulai Mohonpur", awayTeam: "United XI", awaySub: "Opponent", score: "– vs –", date: "Upcoming • June 2025", result: "upcoming" },
  { id: 5, homeTeam: "AMFFC", homeSub: "Aulai Mohonpur", awayTeam: "Rangers FC", awaySub: "Opponent", score: "1 – 2", date: "December 5, 2024", result: "loss" },
];

const members: MemberData[] = [
  { id: 1, jersey: 10, initial: "রা", name: "Rahim Ali", position: "Midfielder", category: "senior" },
  { id: 2, jersey: 7, initial: "কা", name: "Kamal Hossain", position: "Forward", category: "senior" },
  { id: 3, jersey: 1, initial: "সা", name: "Sakib Mia", position: "Goalkeeper", category: "junior" },
  { id: 4, jersey: 5, initial: "রি", name: "Riaz Uddin", position: "Defender", category: "junior" },
  { id: 5, jersey: 11, initial: "তা", name: "Tanvir Ahmed", position: "Winger", category: "junior" },
  { id: 6, jersey: 4, initial: "জা", name: "Jamal Sheikh", position: "Defender", category: "guest" },
];

const galleryItems = [
  { id: 1, title: "Tournament Highlights", tag: "Sports • 2025", icon: "⚽", type: "feature" },
  { id: 2, title: "Iftar Party 2025", tag: "Event • Ramadan", icon: "🌙", type: "large" },
  { id: 3, title: "Champions Cup", tag: "Tournament • 2024", icon: "🏆", type: "small" },
  { id: 4, title: "Eid Celebration", tag: "Event • 2024", icon: "🎉", type: "small" },
  { id: 5, title: "Picnic 2024", tag: "Fun • Nature", icon: "🏖️", type: "small" },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const getResultClass = (result: string) => {
    switch (result) {
      case "win": return "win";
      case "loss": return "loss";
      case "draw": return "draw";
      default: return "upcoming";
    }
  };

  const getResultText = (result: string) => {
    switch (result) {
      case "win": return "Win";
      case "loss": return "Loss";
      case "draw": return "Draw";
      default: return "Upcoming";
    }
  };

  const getMemberBadgeClass = (category: string) => {
    if (category === "senior") return "member-badge senior";
    if (category === "guest") return "member-badge guest";
    return "member-badge";
  };

  const getMemberBadgeText = (category: string) => {
    if (category === "senior") return "Senior";
    if (category === "guest") return "Guest";
    return "Junior";
  };

  return (
    <div className="home-page">
      <style jsx>{`
        .home-page {
          --green-dark: #0a2e1a;
          --green-mid: #134d2e;
          --green-accent: #1e7a47;
          --gold: #c9a227;
          --gold-light: #f0c94a;
          --cream: #f5f0e8;
          --white: #ffffff;
          --text-muted: #a8b8a0;
        }
      `}</style>

      {/* Navigation */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <Link href="/" className="nav-logo">
          <div className="logo-badge">AMFF</div>
          <div className="logo-text">
            <span className="top">Friend For Future</span>
            <span className="bot">Aulai Mohonpur</span>
          </div>
        </Link>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#matches">Matches</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#members">Members</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-slides">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`slide ${slide.bgClass} ${currentSlide === index ? "active" : ""}`}
            >
              <div className="slide-overlay-art">
                <svg width="100%" height="100%" viewBox="0 0 1400 800" preserveAspectRatio="xMidYMid slice">
                  <circle cx="700" cy="400" r="350" fill="none" stroke="rgba(201,162,39,0.06)" strokeWidth="2"/>
                  <circle cx="700" cy="400" r="250" fill="none" stroke="rgba(201,162,39,0.08)" strokeWidth="1.5"/>
                  <line x1="350" y1="400" x2="1050" y2="400" stroke="rgba(201,162,39,0.07)" strokeWidth="1.5"/>
                  <circle cx="700" cy="400" r="60" fill="none" stroke="rgba(201,162,39,0.12)" strokeWidth="1.5"/>
                  <rect x="400" y="100" width="600" height="600" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1"/>
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="hero-content">
          <span className="hero-tag">Founded with passion • Aulai Mohonpur</span>
          <h1 className="hero-title">
            Friend<br />For <span className="gold">Future</span><br />Club
          </h1>
          <p className="hero-subtitle">Aulai Mohonpur · Unity · Spirit · Excellence</p>
          <a href="#about" className="hero-cta">Learn About Us →</a>
        </div>

        <div className="slide-dots">
          {slides.map((_, index) => (
            <div
              key={index}
              className={`dot ${currentSlide === index ? "active" : ""}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-num"><StatCounter target={24} /></span>
          <span className="stat-label">Active Members</span>
        </div>
        <div className="stat-item">
          <span className="stat-num"><StatCounter target={18} /></span>
          <span className="stat-label">Matches Played</span>
        </div>
        <div className="stat-item">
          <span className="stat-num"><StatCounter target={11} /></span>
          <span className="stat-label">Wins</span>
        </div>
        <div className="stat-item">
          <span className="stat-num"><StatCounter target={7} /></span>
          <span className="stat-label">Events Organized</span>
        </div>
        <div className="stat-item">
          <span className="stat-num"><StatCounter target={3} /></span>
          <span className="stat-label">Trophies Won</span>
        </div>
      </div>

      {/* About Section */}
      <section className="about" id="about">
        <div className="about-inner">
          <div className="about-text reveal">
            <div className="section-header">
              <span className="section-tag">Our Story</span>
              <h2 className="section-title">Unity, Spirit<br />& Future</h2>
              <div className="section-line"></div>
            </div>
            <p>Aulai Mohonpur Friend For Future Club — a name of dreams. This club is not just a place to play football; it's a unique platform for our friendship, unity, and building the future.</p>
            <p>We believe that the character built on the field applies to every aspect of life. Our junior, senior, and guest members together form one family.</p>
            <p>From Iftar parties to Eid reunions, from field battles to tournament stages — we are always together.</p>
          </div>
          <div className="about-visual reveal">
            <div className="shield">
              <svg viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg">
                <path d="M140 10 L260 55 L260 160 Q260 250 140 310 Q20 250 20 160 L20 55 Z" fill="#0d3d22" stroke="#c9a227" strokeWidth="2.5"/>
                <path d="M140 30 L245 68 L245 160 Q245 238 140 292 Q35 238 35 160 L35 68 Z" fill="none" stroke="rgba(201,162,39,0.3)" strokeWidth="1"/>
                <line x1="35" y1="160" x2="245" y2="160" stroke="rgba(201,162,39,0.4)" strokeWidth="1.5"/>
                <line x1="140" y1="68" x2="140" y2="160" stroke="rgba(201,162,39,0.4)" strokeWidth="1.5"/>
                <circle cx="88" cy="114" r="28" fill="none" stroke="rgba(201,162,39,0.5)" strokeWidth="1.5"/>
                <polygon points="88,86 97,100 113,100 101,110 105,126 88,117 71,126 75,110 63,100 79,100" fill="none" stroke="rgba(201,162,39,0.7)" strokeWidth="1.2"/>
                <text x="192" y="124" textAnchor="middle" fontFamily="Bebas Neue,sans-serif" fontSize="44" fill="rgba(201,162,39,0.6)">★</text>
                <text x="140" y="205" textAnchor="middle" fontFamily="Bebas Neue,sans-serif" fontSize="20" fill="#c9a227" letterSpacing="3">AMFFC</text>
                <text x="140" y="225" textAnchor="middle" fontFamily="Bebas Neue,sans-serif" fontSize="11" fill="rgba(201,162,39,0.6)" letterSpacing="2">AULAI MOHONPUR</text>
                <text x="140" y="245" textAnchor="middle" fontFamily="Bebas Neue,sans-serif" fontSize="9" fill="rgba(201,162,39,0.5)" letterSpacing="2">FRIEND FOR FUTURE</text>
                <circle cx="140" cy="10" r="5" fill="#c9a227"/>
                <circle cx="20" cy="55" r="4" fill="rgba(201,162,39,0.5)"/>
                <circle cx="260" cy="55" r="4" fill="rgba(201,162,39,0.5)"/>
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="events" id="events">
        <div className="events-inner">
          <div className="section-header reveal">
            <span className="section-tag">Upcoming & Recent</span>
            <h2 className="section-title">Events</h2>
            <div className="section-line"></div>
          </div>
          <div className="events-grid">
            {events.map((event) => (
              <div key={event.id} className="event-card reveal">
                <span className="event-icon">{event.icon}</span>
                <span className="event-type">{event.type}</span>
                <div className="event-name">{event.name}</div>
                <div className="event-meta">{event.date}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Matches Section */}
      <section className="matches" id="matches">
        <div className="matches-inner">
          <div className="section-header reveal">
            <span className="section-tag">Field Battles</span>
            <h2 className="section-title">Match Records</h2>
            <div className="section-line"></div>
          </div>
          <div className="reveal">
            {matches.map((match) => (
              <div key={match.id} className="match-item">
                <div className="team home">
                  <span className="team-name">{match.homeTeam}</span>
                  <span className="team-sub">{match.homeSub}</span>
                </div>
                <div className="match-center">
                  <div className="match-score">{match.score}</div>
                  <div className="match-date">{match.date}</div>
                  <span className={`match-result ${getResultClass(match.result)}`}>
                    {getResultText(match.result)}
                  </span>
                </div>
                <div className="team away">
                  <span className="team-name">{match.awayTeam}</span>
                  <span className="team-sub">{match.awaySub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="gallery" id="gallery">
        <div className="gallery-inner">
          <div className="section-header reveal">
            <span className="section-tag">Memory Collection</span>
            <h2 className="section-title">Photo Gallery</h2>
            <div className="section-line"></div>
          </div>
          <div className="gallery-grid reveal">
            <div className="gallery-item featured">
              <div className="g-placeholder g-ph-1">
                <div className="gallery-icon">⚽</div>
                <div className="gallery-label">Match Moments</div>
              </div>
              <div className="gallery-overlay">
                <div className="gallery-overlay-title">Tournament Highlights</div>
                <div className="gallery-overlay-tag">Sports • 2025</div>
              </div>
            </div>
            {galleryItems.slice(1).map((item) => (
              <div key={item.id} className="gallery-item">
                <div className={`g-placeholder g-ph-${item.id + 1}`}>
                  <div className="gallery-icon">{item.icon}</div>
                  <div className="gallery-label">{item.title}</div>
                </div>
                <div className="gallery-overlay">
                  <div className="gallery-overlay-title">{item.title}</div>
                  <div className="gallery-overlay-tag">{item.tag}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="gallery-note">
            Admin can upload images and update gallery from the panel
          </p>
        </div>
      </section>

      {/* Members Section */}
      <section className="members" id="members">
        <div className="members-inner">
          <div className="section-header reveal">
            <span className="section-tag">Our Family</span>
            <h2 className="section-title">Members</h2>
            <div className="section-line"></div>
          </div>
          <div className="members-grid reveal">
            {members.map((member) => (
              <div key={member.id} className="member-card">
                <div className="member-jersey">{member.jersey}</div>
                <div className="member-avatar">{member.initial}</div>
                <div className="member-name">{member.name}</div>
                <div className="member-pos">{member.position}</div>
                <span className={getMemberBadgeClass(member.category)}>
                  {getMemberBadgeText(member.category)}
                </span>
              </div>
            ))}
          </div>
          <p className="members-note">
            These are default data — Admin can update with actual member information
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="footer-logo">Aulai Mohonpur FFF Club</div>
        <div className="footer-sub">Unity · Spirit · Future</div>
        <ul className="footer-links">
          <li><a href="#about">About</a></li>
          <li><a href="#events">Events</a></li>
          <li><a href="#matches">Matches</a></li>
          <li><a href="#gallery">Gallery</a></li>
          <li><a href="#members">Members</a></li>
        </ul>
        <div className="footer-copy">© 2025 Aulai Mohonpur Friend For Future Club • All rights reserved</div>
      </footer>

      <style jsx>{`
        /* Navigation */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem 2.5rem;
          background: linear-gradient(to bottom, rgba(10,46,26,0.97) 0%, rgba(10,46,26,0) 100%);
          transition: background 0.3s, backdrop-filter 0.3s;
        }
        .nav.scrolled {
          background: rgba(10,46,26,0.97);
          backdrop-filter: blur(12px);
          box-shadow: 0 2px 20px rgba(0,0,0,0.4);
        }
        .nav-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
        }
        .logo-badge {
          width: 48px;
          height: 48px;
          background: var(--gold, #c9a227);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 18px;
          color: var(--green-dark, #0a2e1a);
          letter-spacing: 1px;
          box-shadow: 0 0 0 3px var(--green-dark, #0a2e1a), 0 0 0 5px var(--gold, #c9a227);
        }
        .logo-text .top {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 20px;
          color: var(--gold, #c9a227);
          letter-spacing: 2px;
          display: block;
        }
        .logo-text .bot {
          font-size: 11px;
          color: var(--text-muted, #a8b8a0);
          letter-spacing: 3px;
          text-transform: uppercase;
          display: block;
        }
        .nav-links {
          display: flex;
          gap: 2rem;
          list-style: none;
        }
        .nav-links a {
          text-decoration: none;
          color: var(--cream, #f5f0e8);
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          font-weight: 600;
          position: relative;
          padding-bottom: 4px;
          transition: color 0.2s;
        }
        .nav-links a::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--gold, #c9a227);
          transform: scaleX(0);
          transition: transform 0.2s;
        }
        .nav-links a:hover { color: var(--gold, #c9a227); }
        .nav-links a:hover::after { transform: scaleX(1); }

        /* Hero */
        .hero {
          position: relative;
          height: 100vh;
          min-height: 620px;
          overflow: hidden;
          display: flex;
          align-items: flex-end;
        }
        .hero-slides {
          position: absolute;
          inset: 0;
        }
        .slide {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .slide.active { opacity: 1; }
        .slide::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, rgba(10,46,26,0.3) 0%, rgba(10,46,26,0.1) 40%, rgba(10,46,26,0.85) 100%);
        }
        .slide-1 { background: linear-gradient(135deg, #0a3520 0%, #1e7a47 50%, #0a2e1a 100%); }
        .slide-2 { background: linear-gradient(135deg, #2d1a0a 0%, #8b5a1a 50%, #1a0d05 100%); }
        .slide-3 { background: linear-gradient(135deg, #0a1a2e 0%, #1a4a7a 50%, #050f1a 100%); }
        .slide-overlay-art {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 0;
        }
        .hero-content {
          position: relative;
          z-index: 2;
          padding: 0 3rem 5rem;
          width: 100%;
          max-width: 900px;
        }
        .hero-tag {
          display: inline-block;
          background: var(--gold, #c9a227);
          color: var(--green-dark, #0a2e1a);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 3px;
          text-transform: uppercase;
          padding: 5px 14px;
          margin-bottom: 1.2rem;
        }
        .hero-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3.5rem, 8vw, 7rem);
          line-height: 0.9;
          color: var(--white, #ffffff);
          text-shadow: 0 4px 30px rgba(0,0,0,0.5);
          margin-bottom: 0.5rem;
        }
        .hero-title .gold { color: var(--gold, #c9a227); }
        .hero-subtitle {
          font-size: 1rem;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--text-muted, #a8b8a0);
          margin-bottom: 2rem;
        }
        .hero-cta {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: var(--gold, #c9a227);
          color: var(--green-dark, #0a2e1a);
          padding: 14px 32px;
          font-weight: 700;
          font-size: 14px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          transition: all 0.2s;
          clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        }
        .hero-cta:hover { background: var(--gold-light, #f0c94a); transform: translateY(-2px); }
        .slide-dots {
          position: absolute;
          bottom: 2rem;
          right: 3rem;
          z-index: 10;
          display: flex;
          gap: 8px;
        }
        .dot {
          width: 28px;
          height: 3px;
          background: rgba(255,255,255,0.3);
          cursor: pointer;
          transition: background 0.3s, width 0.3s;
        }
        .dot.active { background: var(--gold, #c9a227); width: 48px; }

        /* Stats Bar */
        .stats-bar {
          background: var(--green-mid, #134d2e);
          border-top: 1px solid rgba(201,162,39,0.2);
          border-bottom: 1px solid rgba(201,162,39,0.2);
          padding: 1.5rem 2.5rem;
          display: flex;
          justify-content: center;
          gap: 0;
          flex-wrap: wrap;
        }
        .stat-item {
          flex: 1;
          max-width: 200px;
          text-align: center;
          padding: 0 2rem;
          border-right: 1px solid rgba(201,162,39,0.2);
        }
        .stat-item:last-child { border-right: none; }
        .stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 3rem;
          color: var(--gold, #c9a227);
          line-height: 1;
          display: block;
        }
        .stat-label {
          font-size: 11px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--text-muted, #a8b8a0);
          margin-top: 4px;
          display: block;
        }

        /* Sections */
        section { padding: 6rem 2.5rem; }
        .section-header { margin-bottom: 3.5rem; }
        .section-tag {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--gold, #c9a227);
          font-weight: 700;
          display: block;
          margin-bottom: 0.75rem;
        }
        .section-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(2.5rem, 5vw, 4rem);
          line-height: 1;
          color: var(--white, #ffffff);
        }
        .section-line {
          width: 60px;
          height: 3px;
          background: var(--gold, #c9a227);
          margin-top: 1rem;
        }

        /* About */
        .about { background: var(--green-dark, #0a2e1a); }
        .about-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5rem;
          align-items: center;
        }
        .about-text p {
          font-family: 'Tiro Bangla', serif;
          font-size: 1.05rem;
          line-height: 1.9;
          color: var(--text-muted, #a8b8a0);
          margin-bottom: 1.2rem;
        }
        .shield { width: 280px; height: 320px; margin: 0 auto; }

        /* Events */
        .events { background: var(--green-mid, #134d2e); }
        .events-inner { max-width: 1200px; margin: 0 auto; }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }
        .event-card {
          background: rgba(10,46,26,0.6);
          border: 1px solid rgba(201,162,39,0.15);
          padding: 1.75rem;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, transform 0.3s;
        }
        .event-card:hover { border-color: rgba(201,162,39,0.4); transform: translateY(-4px); }
        .event-icon {
          position: absolute;
          right: 1.5rem;
          top: 1.5rem;
          font-size: 2rem;
          opacity: 0.08;
        }
        .event-type {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: var(--gold, #c9a227);
          font-weight: 700;
          margin-bottom: 0.75rem;
          display: block;
        }
        .event-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.8rem;
          color: var(--white, #ffffff);
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .event-meta {
          font-size: 13px;
          color: var(--text-muted, #a8b8a0);
          letter-spacing: 1px;
        }

        /* Matches */
        .matches { background: var(--green-dark, #0a2e1a); }
        .matches-inner { max-width: 1200px; margin: 0 auto; }
        .match-item {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(201,162,39,0.1);
          transition: background 0.2s;
        }
        .match-item:hover { background: rgba(201,162,39,0.04); }
        .team { display: flex; flex-direction: column; }
        .team.home { align-items: flex-start; }
        .team.away { align-items: flex-end; }
        .team-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: var(--white, #ffffff);
        }
        .team-sub {
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--text-muted, #a8b8a0);
          text-transform: uppercase;
        }
        .match-center { text-align: center; }
        .match-score {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          color: var(--gold, #c9a227);
          line-height: 1;
        }
        .match-date {
          font-size: 11px;
          color: var(--text-muted, #a8b8a0);
          letter-spacing: 2px;
          margin-top: 4px;
        }
        .match-result {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 2px;
          padding: 3px 10px;
          margin-top: 6px;
          text-transform: uppercase;
        }
        .win { background: rgba(30,122,71,0.3); color: #4ddb8a; }
        .loss { background: rgba(200,50,50,0.3); color: #ff7777; }
        .draw { background: rgba(201,162,39,0.2); color: var(--gold-light, #f0c94a); }
        .upcoming { background: rgba(100,100,200,0.2); color: #aaccff; }

        /* Gallery */
        .gallery { background: var(--green-mid, #134d2e); }
        .gallery-inner { max-width: 1200px; margin: 0 auto; }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(2, 220px);
          gap: 0.75rem;
        }
        .gallery-item {
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        .gallery-item.featured {
          grid-column: span 2;
          grid-row: span 2;
        }
        .g-placeholder {
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.2rem;
          letter-spacing: 2px;
          color: rgba(255,255,255,0.3);
          transition: transform 0.5s ease;
        }
        .g-ph-1 { background: linear-gradient(135deg, #0d3d22 0%, #196b3a 100%); }
        .g-ph-2 { background: linear-gradient(135deg, #1a4a10 0%, #2d7a1a 100%); }
        .g-ph-3 { background: linear-gradient(135deg, #3d2a0d 0%, #7a5a1a 100%); }
        .g-ph-4 { background: linear-gradient(135deg, #0d2a3d 0%, #1a4a6b 100%); }
        .g-ph-5 { background: linear-gradient(135deg, #2d0d3d 0%, #5a1a7a 100%); }
        .gallery-icon { font-size: 2rem; margin-bottom: 0.5rem; }
        .gallery-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem;
          color: rgba(201,162,39,0.7);
          letter-spacing: 2px;
        }
        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: rgba(10,46,26,0.8);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .gallery-item:hover .gallery-overlay { opacity: 1; }
        .gallery-item:hover .g-placeholder { transform: scale(1.08); }
        .gallery-overlay-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          color: var(--white, #ffffff);
          text-align: center;
          padding: 0 1rem;
        }
        .gallery-overlay-tag {
          font-size: 10px;
          letter-spacing: 3px;
          color: var(--gold, #c9a227);
          text-transform: uppercase;
          margin-top: 6px;
        }
        .gallery-note {
          text-align: center;
          margin-top: 2rem;
          font-size: 13px;
          color: var(--text-muted, #a8b8a0);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Members */
        .members { background: var(--green-dark, #0a2e1a); }
        .members-inner { max-width: 1200px; margin: 0 auto; }
        .members-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 1.5rem;
        }
        .member-card {
          background: var(--green-mid, #134d2e);
          border: 1px solid rgba(201,162,39,0.12);
          padding: 1.5rem 1rem;
          text-align: center;
          transition: border-color 0.3s, transform 0.3s;
          position: relative;
          overflow: hidden;
        }
        .member-card:hover { border-color: var(--gold, #c9a227); transform: translateY(-4px); }
        .member-avatar {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          background: var(--green-accent, #1e7a47);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          color: var(--gold, #c9a227);
          border: 2px solid rgba(201,162,39,0.3);
        }
        .member-jersey {
          position: absolute;
          top: 0.75rem;
          right: 0.75rem;
          background: var(--gold, #c9a227);
          color: var(--green-dark, #0a2e1a);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1rem;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .member-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.2rem;
          color: var(--white, #ffffff);
          margin-bottom: 4px;
        }
        .member-pos {
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--text-muted, #a8b8a0);
          text-transform: uppercase;
        }
        .member-badge {
          display: inline-block;
          margin-top: 8px;
          font-size: 9px;
          letter-spacing: 2px;
          padding: 3px 10px;
          text-transform: uppercase;
          background: rgba(30,122,71,0.3);
          color: #4ddb8a;
        }
        .member-badge.senior { background: rgba(201,162,39,0.2); color: var(--gold-light, #f0c94a); }
        .member-badge.guest { background: rgba(100,100,200,0.2); color: #aaccff; }
        .members-note {
          text-align: center;
          margin-top: 2rem;
          color: var(--text-muted, #a8b8a0);
          font-size: 13px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Footer */
        footer {
          background: rgba(0,0,0,0.5);
          border-top: 1px solid rgba(201,162,39,0.15);
          padding: 3rem 2.5rem;
          text-align: center;
        }
        .footer-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          color: var(--gold, #c9a227);
          letter-spacing: 4px;
          margin-bottom: 0.5rem;
        }
        .footer-sub {
          font-size: 11px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: var(--text-muted, #a8b8a0);
          margin-bottom: 2rem;
        }
        .footer-links {
          display: flex;
          justify-content: center;
          gap: 2rem;
          list-style: none;
          margin-bottom: 2rem;
        }
        .footer-links a {
          font-size: 12px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--text-muted, #a8b8a0);
          text-decoration: none;
          transition: color 0.2s;
        }
        .footer-links a:hover { color: var(--gold, #c9a227); }
        .footer-copy {
          font-size: 12px;
          color: rgba(168,184,160,0.5);
        }

        /* Scroll Reveal */
        .reveal {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .nav { padding: 1rem 1.5rem; }
          .nav-links { display: none; }
          section { padding: 4rem 1.5rem; }
          .about-inner { grid-template-columns: 1fr; gap: 2rem; }
          .shield { width: 200px; height: 230px; }
          .stat-item { border-right: none; border-bottom: 1px solid rgba(201,162,39,0.2); padding-bottom: 1rem; }
          .gallery-grid { grid-template-columns: 1fr 1fr; grid-template-rows: auto; }
          .gallery-item.featured { grid-column: span 2; height: 240px; }
          .match-item { grid-template-columns: 1fr auto 1fr; gap: 0.5rem; padding: 1rem; }
          .hero-content { padding: 0 1.5rem 4rem; }
          .hero-title { font-size: 3rem; }
        }
      `}</style>
    </div>
  );
}