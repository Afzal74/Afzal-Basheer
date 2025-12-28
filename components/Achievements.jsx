"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Trophy, ArrowRight, Medal, Award, ArrowLeft } from "lucide-react";
import { playSound, preloadSounds } from "./useSoundEffects";
import SoundLink from "./SoundLink";

const achievements = [
  {
    id: "ACH-01",
    title: "CodeCircuit Hackathon Finalist",
    year: "2024",
    tags: ["Top 50", "Outlier.ai"],
    desc: (
      <>
        Selected in the <span className="text-white font-medium">top 50</span> out of <span className="text-white font-medium">5,000+ participants</span> at CodeCircuit Hackathon. Developed a <span className="text-white font-medium">Trivia Quiz Web App</span> with interactive features and real-time scoring. Awarded a <span className="text-white font-medium">paid freelance opportunity</span> at Outlier.ai.
      </>
    ),
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
    carouselImages: ["/Achievements/codecircuit/CodeCircuit.jpg"],
    stat: "Top 50/5K+",
  },
  {
    id: "ACH-02",
    title: "AI Meme Generator Competition Winner",
    year: "2024",
    tags: ["1st Place", "Epitome 2K24"],
    desc: (
      <>
        Secured <span className="text-white font-medium">1st place</span> in AI Meme Generator competition at Epitome-2k24, hosted by AIMIT, St. Aloysius University. Demonstrated <span className="text-white font-medium">creativity and innovation</span> with an <span className="text-white font-medium">AI-powered meme generator</span>.
      </>
    ),
    img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800",
    carouselImages: [
      "/Achievements/Ai meme generator/Ai meme generator.jpg",
      "/Achievements/Ai meme generator/ai meme generator2.jpg",
    ],
    stat: "1st Place",
  },
  {
    id: "ACH-03",
    title: "Web Development Workshop Mentor",
    year: "2025",
    tags: ["Mentor", "HTML & CSS"],
    desc: (
      <>
        Conducted a <span className="text-white font-medium">full-day HTML & CSS workshop</span> for junior developers. Received <span className="text-white font-medium">excellent feedback</span> and <span className="text-white font-medium">strong engagement</span> from participants, helping the next generation of developers.
      </>
    ),
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    carouselImages: [
      "/Achievements/web development workshop/The workshop.jpg",
      "/Achievements/web development workshop/workshop 2.jpg",
    ],
    stat: "Full Day",
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [imageClicked, setImageClicked] = useState(false);

  useEffect(() => {
    setMounted(true);
    preloadSounds();
  }, []);

  // Carousel effect for achievements with carousel images
  useEffect(() => {
    const currentAchievement = achievements[activeIndex];
    if (!currentAchievement.carouselImages) return;

    // Reset carousel index when achievement changes
    setCarouselIndex(0);

    const interval = setInterval(() => {
      setCarouselIndex(
        (prev) => (prev + 1) % currentAchievement.carouselImages.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [activeIndex]);

  // Reset grayscale on scroll
  useEffect(() => {
    const handleScroll = () => {
      setImageClicked(false);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;

    const hasAnimated = sessionStorage.getItem("achievementsAnimated");

    if (hasAnimated) {
      gsap.set(navRef.current, { opacity: 1, y: 0 });
      gsap.set(".achievements-header", { opacity: 1, y: 0 });
      gsap.set(".achievement-card", { opacity: 1, x: 0 });
      gsap.set(".achievement-preview", { opacity: 1, scale: 1 });
      // Still run border animations
      gsap.to(".achievement-border-top", {
        left: "100%",
        duration: 3,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".achievement-border-right", {
        top: "100%",
        duration: 3,
        repeat: -1,
        ease: "none",
        delay: 0.75,
      });
      gsap.to(".achievement-border-bottom", {
        right: "100%",
        duration: 3,
        repeat: -1,
        ease: "none",
        delay: 1.5,
      });
      gsap.to(".achievement-border-left", {
        bottom: "100%",
        duration: 3,
        repeat: -1,
        ease: "none",
        delay: 2.25,
      });
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

    // Red border animation - outside context
    gsap.to(".achievement-border-top", {
      left: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".achievement-border-right", {
      top: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 0.75,
    });
    gsap.to(".achievement-border-bottom", {
      right: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 1.5,
    });
    gsap.to(".achievement-border-left", {
      bottom: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 2.25,
    });

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
        <div className="flex items-center gap-3 md:gap-8">
          {[
            { name: "Home", href: "/", hidden: true },
            { name: "Projects", href: "/projects" },
            { name: "Achievements", href: "/achievements" },
            { name: "Rate Me", href: "/ratings" },
          ].map((item) => (
            <SoundLink
              key={item.name}
              href={item.href}
              style={pixelFont}
              className={`nav-item text-[6px] md:text-[9px] uppercase tracking-widest transition-colors duration-300 relative group ${
                item.name === "Achievements"
                  ? "text-red-500"
                  : "text-zinc-500 hover:text-red-500"
              } ${item.hidden ? "hidden" : ""}`}
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

      <section className="min-h-screen pt-16 md:pt-32 pb-10 md:pb-20">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          {/* Header */}
          <div className="achievements-header mb-6 md:mb-16">
            <div
              style={pixelFont}
              className="text-zinc-600 text-[8px] md:text-[10px] tracking-widest mb-2 md:mb-4 uppercase flex items-center gap-2"
            >
              <Trophy size={12} className="md:w-[14px] md:h-[14px]" />{" "}
              Trophy_Cabinet / {achievements.length} Unlocked
            </div>
            <h2
              style={appleFont}
              className="text-2xl md:text-5xl font-bold text-white"
            >
              Achievements
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row-reverse gap-6 md:gap-12 items-start">
            {/* Achievement List - Right side on desktop, top on mobile */}
            <div className="w-full lg:w-1/2 space-y-1 md:space-y-3 order-2 lg:order-none">
              {achievements.map((ach, i) => (
                <div
                  key={ach.id}
                  onClick={() => {
                    playSound("select", 0.3);
                    setActiveIndex(i);
                    setCarouselIndex(0);
                    setImageClicked(false);
                  }}
                  onMouseEnter={() => {
                    if (mounted && activeIndex !== i) {
                      playSound("select", 0.3);
                      setActiveIndex(i);
                      setCarouselIndex(0);
                    }
                  }}
                  className={`achievement-card p-2 md:p-5 border-r-4 transition-all duration-300 cursor-pointer ${
                    activeIndex === i
                      ? "bg-zinc-900/40 border-red-600"
                      : "bg-transparent border-zinc-900 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <ArrowRight
                      size={12}
                      className={`text-white transition-all duration-500 hidden md:block ${
                        activeIndex === i
                          ? "translate-x-0 opacity-100"
                          : "translate-x-4 opacity-0"
                      }`}
                    />
                    <div className="space-y-0.5 md:space-y-2 text-right flex-1 ml-2 md:ml-4">
                      <div className="flex items-center justify-end gap-2 md:gap-3">
                        <span
                          style={pixelFont}
                          className={`text-[5px] md:text-[8px] ${
                            activeIndex === i ? "text-red-500" : "text-zinc-600"
                          }`}
                        >
                          {ach.id}
                        </span>
                        <span
                          style={pixelFont}
                          className="text-[5px] md:text-[8px] text-zinc-700"
                        >
                          {ach.year}
                        </span>
                      </div>
                      <h3
                        style={appleFont}
                        className="text-xs md:text-2xl font-black tracking-tighter uppercase text-white"
                      >
                        {ach.title}
                      </h3>
                      <div className="flex gap-1 md:gap-2 flex-wrap justify-end">
                        {ach.tags.map((tag) => (
                          <span
                            key={tag}
                            style={pixelFont}
                            className="text-[4px] md:text-[6px] bg-zinc-800 text-zinc-400 px-1 md:px-2 py-0.5 md:py-1"
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

            {/* Achievement Preview - Left side on desktop, bottom on mobile */}
            <div className="w-full lg:w-1/2 achievement-preview lg:sticky lg:top-32 space-y-2 md:space-y-8 order-1 lg:order-none">
              <div
                className="relative aspect-video border border-white/5 overflow-hidden shadow-2xl bg-zinc-900 group cursor-pointer"
                onClick={() => setImageClicked(!imageClicked)}
              >
                {/* Red moving border */}
                <div className="absolute inset-0 pointer-events-none z-20">
                  <div className="achievement-border-top absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                  <div className="achievement-border-right absolute top-[-100%] right-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                  <div className="achievement-border-bottom absolute bottom-0 right-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                  <div className="achievement-border-left absolute bottom-[-100%] left-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                </div>
                <img
                  src={
                    achievements[activeIndex].carouselImages
                      ? achievements[activeIndex].carouselImages[carouselIndex]
                      : achievements[activeIndex].img
                  }
                  alt={achievements[activeIndex].title}
                  className={`w-full h-full object-cover transition-all duration-1000 ${
                    imageClicked
                      ? "grayscale-0 brightness-100"
                      : "grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100"
                  }`}
                />
                {/* Stat badge */}
                <div className="absolute top-2 md:top-4 left-2 md:left-4 flex items-center gap-1 md:gap-2">
                  <div className="bg-red-600 p-1 md:p-2">
                    <Award
                      size={12}
                      className="md:w-[16px] md:h-[16px] text-white"
                    />
                  </div>
                  <div
                    style={pixelFont}
                    className="text-[8px] md:text-[10px] bg-black/80 px-2 md:px-3 py-1 md:py-2 border border-red-900/30 text-white"
                  >
                    {achievements[activeIndex].stat}
                  </div>
                </div>
                {/* Year */}
                <div
                  className="absolute bottom-2 md:bottom-4 right-2 md:right-4 text-[6px] md:text-[8px] bg-black/80 p-1 md:p-2 border border-zinc-800 text-zinc-400"
                  style={pixelFont}
                >
                  YEAR: {achievements[activeIndex].year}
                </div>
              </div>

              <div className="space-y-2 md:space-y-6">
                <div
                  style={pixelFont}
                  className="text-[8px] md:text-[10px] text-red-600 flex items-center gap-2"
                >
                  <Medal size={12} className="md:w-[14px] md:h-[14px]" />{" "}
                  ACHIEVEMENT_UNLOCKED
                </div>
                <p
                  style={appleFont}
                  className="text-zinc-400 text-xs md:text-lg font-light leading-relaxed"
                >
                  {achievements[activeIndex].desc}
                </p>

                {/* Progress bar decoration */}
                <div className="space-y-1 md:space-y-2">
                  <div
                    className="flex justify-between text-[6px] md:text-[8px]"
                    style={pixelFont}
                  >
                    <span className="text-zinc-600">COMPLETION</span>
                    <span className="text-red-500">100%</span>
                  </div>
                  <div className="h-0.5 md:h-1 bg-zinc-800 rounded-full overflow-hidden">
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
