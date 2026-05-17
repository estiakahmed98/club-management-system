"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, RefreshCw, Search, ArrowLeft, Bug, Zap, Coffee } from "lucide-react";

export default function NotFound() {
  const [rotation, setRotation] = useState(0);
  const [bounce, setBounce] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    // Continuous rotation for the soccer ball
    const interval = setInterval(() => {
      setRotation((prev) => (prev + 5) % 360);
    }, 50);

    // Bounce effect every 2 seconds
    const bounceInterval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }, 2000);

    // Random glitch effect
    const glitchInterval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(bounceInterval);
      clearInterval(glitchInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2e1a] via-[#134d2e] to-[#0a2e1a] overflow-hidden relative flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating shapes */}
        <div className="absolute top-20 left-10 animate-float-slow">
          <div className="w-16 h-16 bg-[#c9a227]/10 rounded-full blur-xl" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float-delayed">
          <div className="w-24 h-24 bg-[#c9a227]/10 rounded-full blur-xl" />
        </div>
        <div className="absolute top-1/2 left-1/4 animate-float-fast">
          <div className="w-12 h-12 bg-[#c9a227]/5 rounded-full blur-lg" />
        </div>
        
        {/* Animated lines */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent animate-slide-right" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#c9a227]/30 to-transparent animate-slide-left" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        {/* Crazy 404 Number with Effects */}
        <div className="relative mb-8">
          {/* Glitch effect overlay */}
          {glitch && (
            <div className="absolute inset-0 animate-glitch pointer-events-none">
              <div className="text-[150px] md:text-[250px] font-black text-red-500/50 absolute top-0 left-0 translate-x-2">
                404
              </div>
              <div className="text-[150px] md:text-[250px] font-black text-blue-500/50 absolute top-0 left-0 -translate-x-2">
                404
              </div>
            </div>
          )}
          
          {/* Main 404 text */}
          <h1 className={`text-[120px] md:text-[220px] font-black text-white leading-none tracking-tighter relative ${bounce ? 'animate-bounce' : ''}`}
              style={{ fontFamily: "'Bebas Neue', sans-serif", textShadow: "10px 10px 0 rgba(201,162,39,0.3)" }}>
            4
            <span className="inline-block relative" style={{ transform: `rotate(${rotation}deg)`, display: 'inline-block' }}>
              <span className="text-[#c9a227]">0</span>
              <div className="absolute inset-0 animate-ping-slow opacity-30">
                <span className="text-[#c9a227]">0</span>
              </div>
            </span>
            4
          </h1>
          
          {/* Decorative elements around 404 */}
          <div className="absolute -top-10 -left-10 animate-spin-slow">
            <Zap className="w-8 h-8 text-[#c9a227]/50" />
          </div>
          <div className="absolute -bottom-10 -right-10 animate-spin-slow-reverse">
            <Bug className="w-8 h-8 text-[#c9a227]/50" />
          </div>
        </div>

        {/* Error Message */}
        <div className="space-y-4 mb-12">
          <div className="inline-block px-4 py-2 bg-[#c9a227]/10 border border-[#c9a227]/30 rounded-full backdrop-blur-sm">
            <p className="text-[#c9a227] text-xs md:text-sm font-semibold tracking-wider uppercase">
              ⚡ Page Not Found • Error 404 ⚡
            </p>
          </div>
          
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            Oops! You've Kicked the Ball
            <span className="block text-[#c9a227]">Out of the Stadium!</span>
          </h2>
          
          <p className="text-[#a8b8a0] text-base md:text-lg max-w-lg mx-auto">
            Looks like this page took a red card and got sent off. 
            Let's get you back to the main pitch before the referee notices!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/">
            <button className="group relative inline-flex items-center gap-2 px-8 py-3 bg-[#c9a227] text-[#0a2e1a] font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#c9a227]/30">
              <div className="absolute inset-0 bg-gradient-to-r from-[#f0c94a] to-[#c9a227] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <Home className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Back to Home</span>
            </button>
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white/10 backdrop-blur-sm border border-[#c9a227]/30 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/20"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span>Try Again</span>
          </button>
          
          <Link href="/search">
            <button className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white/5 backdrop-blur-sm border border-white/20 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:bg-white/10">
              <Search className="w-5 h-5" />
              <span>Search</span>
            </button>
          </Link>
        </div>

        {/* Funny Suggestions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#c9a227]/30 transition-all group cursor-pointer">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">⚽</div>
            <p className="text-xs text-[#a8b8a0]">Check our latest matches</p>
          </div>
          <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#c9a227]/30 transition-all group cursor-pointer">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏆</div>
            <p className="text-xs text-[#a8b8a0]">View tournament winners</p>
          </div>
          <div className="p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-[#c9a227]/30 transition-all group cursor-pointer">
            <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📸</div>
            <p className="text-xs text-[#a8b8a0]">Explore our gallery</p>
          </div>
        </div>

        {/* Easter Egg */}
        <div className="mt-12 text-center">
          <button
            onClick={() => {
              const audio = new Audio("https://www.soundjay.com/misc/sounds/football-kick-01.mp3");
              audio.volume = 0.3;
              audio.play().catch(() => {});
              alert("🥅 GOAL! You found the secret! But still no page here... 🎉");
            }}
            className="text-[#a8b8a0]/40 text-xs hover:text-[#c9a227] transition-colors flex items-center gap-1 justify-center"
          >
            <Coffee className="w-3 h-3" />
            <span>Psst... Click here for a surprise!</span>
          </button>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) translateX(0px); }
          25% { transform: translateY(-15px) translateX(10px); }
          75% { transform: translateY(15px) translateX(-10px); }
        }
        @keyframes slide-right {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slide-left {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes ping-slow {
          0% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.2); opacity: 0; }
          100% { transform: scale(1); opacity: 0.3; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-slow 8s ease-in-out infinite 1s;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-slide-right {
          animation: slide-right 8s linear infinite;
        }
        .animate-slide-left {
          animation: slide-left 8s linear infinite;
        }
        .animate-glitch {
          animation: glitch 0.2s ease-in-out infinite;
        }
        .animate-ping-slow {
          animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 10s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 12s linear infinite;
        }
      `}</style>
    </div>
  );
}