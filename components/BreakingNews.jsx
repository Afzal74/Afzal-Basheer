"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { Trophy, Zap } from "lucide-react";
import Link from "next/link";
import { playSound } from "./useSoundEffects";

const newsItems = [
  {
    id: "ACH-01",
    title: "Hackathon Champion",
    stat: "1st Place",
    year: "2024",
  },
  {
    id: "ACH-02",
    title: "Open Source Impact",
    stat: "500+ Stars",
    year: "2023",
  },
  { id: "ACH-03", title: "AWS Certified", stat: "Professional", year: "2023" },
  { id: "ACH-04", title: "Tech Speaker", stat: "2K+ Reached", year: "2024" },
  { id: "ACH-05", title: "Product Launch", stat: "10K Users", year: "2024" },
];

const pixelFont = { fontFamily: '"Press Start 2P", cursive' };
const appleFont = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
};

const BreakingNews = () => {
  const tickerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ticker = tickerRef.current;
    if (!ticker) return;

    // Clone items for seamless loop
    const items = ticker.innerHTML;
    ticker.innerHTML = items + items;

    const totalWidth = ticker.scrollWidth / 2;

    gsap.to(ticker, {
      x: -totalWidth,
      duration: 25,
      ease: "none",
      repeat: -1,
    });

    // Fade in animation
    gsap.fromTo(
      containerRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
    );
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative z-10 py-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-y border-red-900/20"
    >
      {/* Breaking News Label */}
      <div className="absolute left-0 top-0 bottom-0 z-20 flex items-center bg-red-600 px-4 md:px-6">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-white animate-pulse" />
          <span
            style={pixelFont}
            className="text-[8px] md:text-[10px] text-white font-bold tracking-wider"
          >
            BREAKING
          </span>
        </div>
      </div>

      {/* Ticker Container */}
      <div className="overflow-hidden ml-24 md:ml-32">
        <div
          ref={tickerRef}
          className="flex items-center gap-8 whitespace-nowrap"
        >
          {newsItems.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href="/achievements"
              onClick={() => playSound("select", 0.3)}
              className="flex items-center gap-4 group cursor-pointer"
            >
              <Trophy size={14} className="text-red-500 flex-shrink-0" />
              <span
                style={appleFont}
                className="text-white font-semibold group-hover:text-red-400 transition-colors"
              >
                {item.title}
              </span>
              <span
                style={pixelFont}
                className="text-[8px] bg-red-600/20 text-red-400 px-2 py-1 border border-red-900/30"
              >
                {item.stat}
              </span>
              <span style={pixelFont} className="text-[8px] text-zinc-600">
                {item.year}
              </span>
              <span className="text-zinc-700 mx-4">•</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Gradient overlays for smooth edges */}
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-950 to-transparent z-10 pointer-events-none" />
    </div>
  );
};

export default BreakingNews;
