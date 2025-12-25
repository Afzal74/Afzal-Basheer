"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import LogoShowcase from "@/components/LogoShowcase";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { playSound } from "@/components/useSoundEffects";

const mobileProjects = [
  {
    id: "M-01",
    title: "Neural UI",
    tech: ["React", "Three.js"],
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
    desc: "High-performance biometric dashboard using WebGL.",
  },
  {
    id: "M-02",
    title: "Cyber-Deck",
    tech: ["Next.js", "Tailwind"],
    img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800",
    desc: "Decentralized trade platform with real-time data.",
  },
  {
    id: "M-03",
    title: "Shadow Link",
    tech: ["Python", "Docker"],
    img: "https://images.unsplash.com/photo-1510511459019-5dee997ddfdf?q=80&w=800",
    desc: "End-to-end encrypted relay for secure transmission.",
  },
];

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
  const [activeProject, setActiveProject] = useState(0);
  const [activeAchievement, setActiveAchievement] = useState(0);

  return (
    <main className="bg-[#050505] min-h-screen">
      <Hero />
      <LogoShowcase />

      {/* Projects section - only visible on mobile */}
      <div className="block md:hidden px-4 mt-4 pb-6 relative z-10">
        <div className="mb-4">
          <h2 style={appleFont} className="text-xl font-bold text-white">
            Projects
          </h2>
        </div>

        {/* Project Preview Image */}
        <div className="relative aspect-video mb-4 border border-white/10 overflow-hidden bg-zinc-900">
          <img
            src={mobileProjects[activeProject].img}
            alt={mobileProjects[activeProject].title}
            className="w-full h-full object-cover"
          />
          <div
            style={pixelFont}
            className="absolute top-2 right-2 text-[6px] bg-black/80 px-2 py-1 text-red-500"
          >
            {mobileProjects[activeProject].id}
          </div>
        </div>

        {/* Project Description */}
        <p style={appleFont} className="text-zinc-400 text-xs mb-4">
          {mobileProjects[activeProject].desc}
        </p>

        {/* Project List */}
        <div className="space-y-2">
          {mobileProjects.map((proj, i) => (
            <div
              key={proj.id}
              onClick={() => {
                playSound("select", 0.3);
                setActiveProject(i);
              }}
              className={`p-3 border-l-2 transition-all cursor-pointer ${
                activeProject === i
                  ? "border-red-600 bg-zinc-900/50"
                  : "border-zinc-800 bg-zinc-900/30"
              }`}
            >
              <div
                style={pixelFont}
                className={`text-[6px] mb-1 ${
                  activeProject === i ? "text-red-500" : "text-zinc-600"
                }`}
              >
                {proj.id}
              </div>
              <h3
                style={appleFont}
                className="text-sm font-bold text-white uppercase"
              >
                {proj.title}
              </h3>
              <div className="flex gap-1 mt-1">
                {proj.tech.map((t) => (
                  <span
                    key={t}
                    style={pixelFont}
                    className="text-[5px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <Link
          href="/projects"
          style={pixelFont}
          className="block text-center mt-4 text-[8px] text-zinc-500 hover:text-red-500 transition-colors"
        >
          VIEW_ALL_PROJECTS →
        </Link>
      </div>

      {/* Achievements section - only visible on mobile */}
      <div className="block md:hidden px-4 pt-6 pb-10 relative z-10 border-t border-zinc-900">
        <div className="mb-4 flex items-center gap-2">
          <Trophy size={16} className="text-red-500" />
          <h2 style={appleFont} className="text-xl font-bold text-white">
            Achievements
          </h2>
        </div>

        {/* Achievement Preview Image */}
        <div className="relative aspect-video mb-4 border border-white/10 overflow-hidden bg-zinc-900">
          <img
            src={mobileAchievements[activeAchievement].img}
            alt={mobileAchievements[activeAchievement].title}
            className="w-full h-full object-cover"
          />
          <div
            style={pixelFont}
            className="absolute top-2 left-2 text-[8px] bg-red-600 px-2 py-1 text-white"
          >
            {mobileAchievements[activeAchievement].stat}
          </div>
          <div
            style={pixelFont}
            className="absolute bottom-2 right-2 text-[6px] bg-black/80 px-2 py-1 text-zinc-400"
          >
            {mobileAchievements[activeAchievement].year}
          </div>
        </div>

        {/* Achievement List */}
        <div className="space-y-2">
          {mobileAchievements.map((ach, i) => (
            <div
              key={ach.id}
              onClick={() => {
                playSound("select", 0.3);
                setActiveAchievement(i);
              }}
              className={`p-3 border-l-2 transition-all cursor-pointer ${
                activeAchievement === i
                  ? "border-red-600 bg-zinc-900/50"
                  : "border-zinc-800 bg-zinc-900/30"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <div
                    style={pixelFont}
                    className={`text-[6px] mb-1 ${
                      activeAchievement === i ? "text-red-500" : "text-zinc-600"
                    }`}
                  >
                    {ach.id}
                  </div>
                  <h3
                    style={appleFont}
                    className="text-sm font-bold text-white uppercase"
                  >
                    {ach.title}
                  </h3>
                  <div className="flex gap-1 mt-1">
                    {ach.tags.map((t) => (
                      <span
                        key={t}
                        style={pixelFont}
                        className="text-[5px] bg-zinc-800 text-zinc-500 px-1.5 py-0.5"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
                <span style={pixelFont} className="text-[6px] text-zinc-600">
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
          className="block text-center mt-4 text-[8px] text-zinc-500 hover:text-red-500 transition-colors"
        >
          VIEW_ALL_ACHIEVEMENTS →
        </Link>
      </div>
    </main>
  );
}
