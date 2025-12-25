"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Trophy, ArrowRight, Medal, Award, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { playSound, preloadSounds } from "./useSoundEffects";
import SoundLink from "./SoundLink";

const achievements = [
  {
    id: "ACH-01",
    title: "Hackathon Champion",
    year: "2024",
    tags: ["First Place", "Team Lead"],
    desc: "Led a team of 4 developers to victory at TechFest 2024. Built an AI-powered accessibility tool in 48 hours that impressed judges with its innovation and execution.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
    stat: "1st Place",
  },
  {
    id: "ACH-02",
    title: "Open Source Impact",
    year: "2023",
    tags: ["GitHub", "Community"],
    desc: "Created a React component library that gained massive traction in the developer community. Featured in JavaScript Weekly and adopted by startups worldwide.",
    img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800",
    stat: "500+ Stars",
  },
  {
    id: "ACH-03",
    title: "AWS Certified",
    year: "2023",
    tags: ["Cloud", "Architecture"],
    desc: "Earned the AWS Solutions Architect Professional certification, demonstrating expertise in designing distributed systems and cloud infrastructure.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    stat: "Professional",
  },
  {
    id: "ACH-04",
    title: "Tech Speaker",
    year: "2024",
    tags: ["Conference", "Mentor"],
    desc: "Delivered talks at 3 major tech conferences on web performance and modern React patterns. Reached over 2000 developers through workshops and sessions.",
    img: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=800",
    stat: "2K+ Reached",
  },
  {
    id: "ACH-05",
    title: "Product Launch",
    year: "2024",
    tags: ["Startup", "SaaS"],
    desc: "Successfully launched a developer productivity tool that acquired 10,000 users in the first month. Featured on Product Hunt with 500+ upvotes.",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800",
    stat: "10K Users",
  },
];

const pixelFont = { fontFamily: '"Press Start 2P", cursive' };
const appleFont = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
};

const Achievements = () => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    preloadSounds();
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;

    const hasAnimated = sessionStorage.getItem("achievementsAnimated");

    if (hasAnimated) {
      gsap.set(navRef.current, { opacity: 1, y: 0 });
      gsap.set(".achievements-header", { opacity: 1, y: 0 });
      gsap.set(".achievement-card", { opacity: 1, x: 0 });
      gsap.set(".achievement-preview", { opacity: 1, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );
      tl.fromTo(
        ".achievements-header",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      );
      tl.fromTo(
        ".achievement-card",
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.6, stagger: 0.12 },
        "-=0.4"
      );
      tl.fromTo(
        ".achievement-preview",
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 1 },
        "-=0.8"
      );

      sessionStorage.setItem("achievementsAnimated", "true");
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  return (
    <div ref={containerRef} className="bg-[#050505] min-h-screen text-white">
      {/* Navigation */}
      <nav
        ref={navRef}
        className="w-full fixed top-0 left-0 z-[100] px-4 md:px-12 py-6 flex items-center justify-between backdrop-blur-sm bg-black/20 opacity-0"
      >
        <SoundLink
          href="/"
          style={pixelFont}
          className="text-[10px] md:text-xs tracking-tighter text-white flex items-center gap-2 hover:text-red-500 transition-colors"
        >
          <ArrowLeft size={14} /> AFZAL
          <span className="text-red-600">.SYS</span>
        </SoundLink>
        <div className="flex items-center gap-4 md:gap-8">
          {[
            { name: "Home", href: "/" },
            { name: "Projects", href: "/projects" },
            { name: "Achievements", href: "/achievements" },
          ].map((item) => (
            <SoundLink
              key={item.name}
              href={item.href}
              style={pixelFont}
              className={`nav-item text-[6px] md:text-[9px] uppercase tracking-widest transition-colors duration-300 relative group ${
                item.name === "Achievements"
                  ? "text-red-500"
                  : "text-zinc-500 hover:text-red-500"
              }`}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-red-600 transition-all duration-300 ${
                  item.name === "Achievements"
                    ? "w-full"
                    : "w-0 group-hover:w-full"
                }`}
              />
            </SoundLink>
          ))}
        </div>
      </nav>

      <section className="min-h-screen pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          {/* Header */}
          <div className="achievements-header mb-16">
            <div
              style={pixelFont}
              className="text-zinc-600 text-[10px] tracking-widest mb-4 uppercase flex items-center gap-2"
            >
              <Trophy size={14} /> Trophy_Cabinet / {achievements.length}{" "}
              Unlocked
            </div>
            <h2
              style={appleFont}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              Achievements
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-12 items-start">
            {/* Achievement List - Right side */}
            <div className="w-full lg:w-1/2 space-y-3">
              {achievements.map((ach, i) => (
                <div
                  key={ach.id}
                  onMouseEnter={() => { playSound('select', 0.3); setActiveIndex(i); }}
                  className={`achievement-card p-5 border-r-4 transition-all duration-300 cursor-pointer ${
                    activeIndex === i
                      ? "bg-zinc-900/40 border-red-600"
                      : "bg-transparent border-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <ArrowRight
                      className={`text-white transition-all duration-500 ${
                        activeIndex === i
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                    />
                    <div className="space-y-2 text-right flex-1 ml-4">
                      <div className="flex items-center justify-end gap-3">
                        <span
                          style={pixelFont}
                          className={`text-[8px] ${
                            activeIndex === i ? "text-red-500" : "text-zinc-600"
                          }`}
                        >
                          {ach.id}
                        </span>
                        <span
                          style={pixelFont}
                          className="text-[8px] text-zinc-700"
                        >
                          {ach.year}
                        </span>
                      </div>
                      <h3
                        style={appleFont}
                        className="text-xl md:text-2xl font-black tracking-tighter uppercase text-white"
                      >
                        {ach.title}
                      </h3>
                      <div className="flex gap-2 flex-wrap justify-end">
                        {ach.tags.map((tag) => (
                          <span
                            key={tag}
                            style={pixelFont}
                            className="text-[6px] bg-zinc-800 text-zinc-400 px-2 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Achievement Preview - Left side */}
            <div className="w-full lg:w-1/2 achievement-preview lg:sticky lg:top-32 space-y-8">
              <div className="relative aspect-video border border-white/5 overflow-hidden shadow-2xl bg-zinc-900 group">
                <img
                  src={achievements[activeIndex].img}
                  alt={achievements[activeIndex].title}
                  className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                />
                {/* Stat badge */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="bg-red-600 p-2">
                    <Award size={16} className="text-white" />
                  </div>
                  <div
                    style={pixelFont}
                    className="text-[10px] bg-black/80 px-3 py-2 border border-red-900/30 text-white"
                  >
                    {achievements[activeIndex].stat}
                  </div>
                </div>
                {/* Year */}
                <div
                  className="absolute bottom-4 right-4 text-[8px] bg-black/80 p-2 border border-zinc-800 text-zinc-400"
                  style={pixelFont}
                >
                  YEAR: {achievements[activeIndex].year}
                </div>
              </div>

              <div className="space-y-6">
                <div
                  style={pixelFont}
                  className="text-[10px] text-red-600 flex items-center gap-2"
                >
                  <Medal size={14} /> ACHIEVEMENT_UNLOCKED
                </div>
                <p
                  style={appleFont}
                  className="text-zinc-400 text-lg font-light leading-relaxed"
                >
                  {achievements[activeIndex].desc}
                </p>

                {/* Progress bar decoration */}
                <div className="space-y-2">
                  <div
                    className="flex justify-between text-[8px]"
                    style={pixelFont}
                  >
                    <span className="text-zinc-600">COMPLETION</span>
                    <span className="text-red-500">100%</span>
                  </div>
                  <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-600 to-red-400 w-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Achievements;
