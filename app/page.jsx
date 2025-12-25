"use client";

import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import LogoShowcase from "@/components/LogoShowcase";
import HomeProjects from "@/components/HomeProjects";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { playSound } from "@/components/useSoundEffects";

const mobileAchievements = [
  {
    id: "ACH-01",
    title: "Hackathon Champion",
    year: "2024",
    tags: ["First Place"],
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
    stat: "1st Place",
  },
  {
    id: "ACH-02",
    title: "Open Source Impact",
    year: "2023",
    tags: ["GitHub"],
    img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800",
    stat: "500+ Stars",
  },
  {
    id: "ACH-03",
    title: "AWS Certified",
    year: "2023",
    tags: ["Cloud"],
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    stat: "Professional",
  },
];

const pixelFont = { fontFamily: '"Press Start 2P", cursive' };
const appleFont = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
};

export default function Home() {
  const [activeAchievement, setActiveAchievement] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Check if animations already played
    const animated = sessionStorage.getItem("heroAnimated");
    setHasAnimated(!!animated);
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen">
      <Hero />
      <LogoShowcase />
      <HomeProjects />

      {/* Achievements section - only visible on mobile */}
      <div className="block md:hidden px-4 pt-4 pb-6 relative z-10 border-t border-zinc-900" style={{opacity: hasAnimated ? 1 : 0, animation: hasAnimated ? 'none' : `fadeIn 1s ease-out 4s forwards`}}>
        <div className="mb-2 flex items-center gap-2">
          <Trophy size={14} className="text-red-500" />
          <h2 style={appleFont} className="text-lg font-bold text-white">
            Achievements
          </h2>
        </div>

        {/* Achievement Preview Image */}
        <div className="relative aspect-video mb-2 border border-white/10 overflow-hidden bg-zinc-900">
          <img
            src={mobileAchievements[activeAchievement].img}
            alt={mobileAchievements[activeAchievement].title}
            className="w-full h-full object-cover"
          />
          <div
            style={pixelFont}
            className="absolute top-1 left-1 text-[6px] bg-red-600 px-1.5 py-0.5 text-white"
          >
            {mobileAchievements[activeAchievement].stat}
          </div>
          <div
            style={pixelFont}
            className="absolute bottom-1 right-1 text-[5px] bg-black/80 px-1.5 py-0.5 text-zinc-400"
          >
            {mobileAchievements[activeAchievement].year}
          </div>
        </div>

        {/* Achievement List */}
        <div className="space-y-1">
          {mobileAchievements.map((ach, i) => (
            <div
              key={ach.id}
              onClick={() => {
                playSound("select", 0.3);
                setActiveAchievement(i);
              }}
              className={`p-2 border-l-2 transition-all cursor-pointer ${
                activeAchievement === i
                  ? "border-red-600 bg-zinc-900/50"
                  : "border-zinc-800 bg-zinc-900/30"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div
                    style={pixelFont}
                    className={`text-[5px] mb-0.5 ${
                      activeAchievement === i ? "text-red-500" : "text-zinc-600"
                    }`}
                  >
                    {ach.id}
                  </div>
                  <h3
                    style={appleFont}
                    className="text-xs font-bold text-white uppercase"
                  >
                    {ach.title}
                  </h3>
                  <div className="flex gap-0.5 mt-0.5">
                    {ach.tags.map((t) => (
                      <span
                        key={t}
                        style={pixelFont}
                        className="text-[4px] bg-zinc-800 text-zinc-500 px-1 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={pixelFont} className="text-[5px] text-zinc-600">
                  {ach.year}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <Link
          href="/achievements"
          style={pixelFont}
          className="block text-center mt-2 text-[7px] text-zinc-500 hover:text-red-500 transition-colors"
        >
          VIEW_ALL_ACHIEVEMENTS →
        </Link>
      </div>
    </main>
  );
}
