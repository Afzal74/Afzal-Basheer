"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { Terminal, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import { playSound } from "./useSoundEffects";

const projects = [
  {
    id: "M-01",
    title: "Gamified Learning Platform",
    tech: ["React.js", "Node.js", "MongoDB", "Supabase", "Tailwind CSS"],
    desc: "A gamified web platform designed to improve learning outcomes in rural schools through engagement and accessibility. Features interactive quizzes, reward-based challenges, real-time progress tracking, and personalized learning paths for students.",
    img: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800",
    carouselImages: [
      "/gamified learning platform/Home.jpg",
      "/gamified learning platform/Live class.jpg",
      "/gamified learning platform/Realtime quiz.jpg",
      "/gamified learning platform/Student Pov.png",
    ],
    link: "https://ignite-vidya.vercel.app",
  },
  {
    id: "M-02",
    title: "QuizVerse",
    tech: ["Next.js", "Tailwind CSS", "Firebase", "Zustand", "TypeScript"],
    desc: "A trivia quiz app featuring multiple categories, multiplayer mode, and PWA support. Implemented multiplayer functionality, leaderboard system, and offline support for seamless user experience.",
    img: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?q=80&w=800",
    carouselImages: ["/quizverse/quizverse1.jpg", "/quizverse/quizverse2.jpg"],
    link: "https://trivia-quiz-sigma.vercel.app",
  },
  {
    id: "M-03",
    title: "VTU Vault",
    tech: ["Next.js", "TypeScript"],
    desc: "A comprehensive academic companion app for VTU students featuring study materials, CGPA calculator, project ideas, AI chat assistant, and smart search across all sections.",
    img: "https://images.unsplash.com/photo-1510511459019-5dee997ddfdf?q=80&w=800",
    carouselImages: ["/vtu vault/vtuvault1.jpg", "/vtu vault/vtuvault2.jpg"],
    link: "https://vtu-vault.vercel.app",
  },
];

const pixelFont = { fontFamily: '"Press Start 2P", cursive' };
const appleFont = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
};

const HomeProjects = () => {
  const imageContainerRef = useRef(null);
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [imageClicked, setImageClicked] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const currentProject = projects[activeIndex];
    if (!currentProject.carouselImages) return;

    // Reset carousel index when project changes
    setCarouselIndex(0);

    const interval = setInterval(() => {
      setCarouselIndex(
        (prev) => (prev + 1) % currentProject.carouselImages.length
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

    // Check if animations already played this session
    const hasAnimated = sessionStorage.getItem("heroAnimated");

    if (hasAnimated) {
      // Skip animation, just show it
      gsap.set(containerRef.current, { opacity: 1, y: 0 });
      // Still run border animations
      gsap.to(".project-border-top", {
        left: "100%",
        duration: 3,
        repeat: -1,
        ease: "none",
      });
      gsap.to(".project-border-right", {
        top: "100%",
        duration: 3,
        repeat: -1,
        ease: "none",
        delay: 0.75,
      });
      gsap.to(".project-border-bottom", {
        right: "100%",
        duration: 3,
        repeat: -1,
        ease: "none",
        delay: 1.5,
      });
      gsap.to(".project-border-left", {
        bottom: "100%",
        duration: 3,
        repeat: -1,
        ease: "none",
        delay: 2.25,
      });
      return;
    }

    // Delay to sync with Hero animation sequence
    const timer = setTimeout(() => {
      gsap.fromTo(
        containerRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }, 4000); // Appears after hero animations complete

    // Red border animation
    gsap.to(".project-border-top", {
      left: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".project-border-right", {
      top: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 0.75,
    });
    gsap.to(".project-border-bottom", {
      right: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 1.5,
    });
    gsap.to(".project-border-left", {
      bottom: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 2.25,
    });

    return () => clearTimeout(timer);
  }, [mounted]);

  return (
    <section
      className="block md:hidden py-6 relative z-10 opacity-0"
      ref={containerRef}
    >
      <div className="px-4 md:px-12 lg:px-24">
        <div className="mb-4 md:mb-16">
          <div
            style={pixelFont}
            className="text-zinc-600 text-[7px] md:text-[10px] tracking-widest mb-2 md:mb-4 uppercase flex items-center gap-2"
          >
            <Terminal size={10} className="md:w-[14px] md:h-[14px]" />{" "}
            Mission_Archive / {projects.length} Files
          </div>
          <h2
            style={appleFont}
            className="text-xl md:text-4xl lg:text-5xl font-bold text-white"
          >
            Projects
          </h2>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-12 items-start">
          {/* Project List */}
          <div className="w-full lg:w-1/2 space-y-1 md:space-y-4">
            {projects.map((proj, i) => (
              <div
                key={proj.id}
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
                className={`project-card p-2 md:p-6 border-l-4 transition-all duration-300 cursor-pointer ${
                  activeIndex === i
                    ? "bg-zinc-900/40 border-red-600"
                    : "bg-transparent border-zinc-900 hover:border-zinc-700"
                }`}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-0.5 md:space-y-2">
                    <div
                      style={pixelFont}
                      className={`text-[5px] md:text-[8px] ${
                        activeIndex === i ? "text-red-500" : "text-zinc-600"
                      }`}
                    >
                      {proj.id}
                    </div>
                    <h3
                      style={appleFont}
                      className="text-xs md:text-2xl font-black tracking-tighter uppercase text-white"
                    >
                      {proj.title}
                    </h3>
                    <div className="flex gap-0.5 md:gap-2 flex-wrap">
                      {proj.tech.map((t) => (
                        <span
                          key={t}
                          style={pixelFont}
                          className="text-[4px] md:text-[6px] bg-zinc-800 text-zinc-400 px-1 md:px-2 py-0.5 md:py-1"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  <ArrowRight
                    size={16}
                    className={`text-white transition-all duration-500 hidden md:block ${
                      activeIndex === i
                        ? "translate-x-0 opacity-100"
                        : "-translate-x-4 opacity-0"
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Project Preview */}
          <div className="w-full lg:w-1/2 space-y-2 md:space-y-8">
            <div
              ref={imageContainerRef}
              className="relative aspect-video border border-white/5 shadow-2xl bg-zinc-900 group overflow-hidden cursor-pointer"
              onClick={() => setImageClicked(!imageClicked)}
            >
              {/* Red moving border */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="project-border-top absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <div className="project-border-right absolute top-[-100%] right-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <div className="project-border-bottom absolute bottom-0 right-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
                <div className="project-border-left absolute bottom-[-100%] left-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              </div>

              <img
                src={
                  projects[activeIndex].carouselImages
                    ? projects[activeIndex].carouselImages[carouselIndex]
                    : projects[activeIndex].img
                }
                alt={projects[activeIndex].title}
                className={`w-full h-full object-cover transition-all duration-1000 ${
                  imageClicked
                    ? "grayscale-0 brightness-100"
                    : "grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100"
                }`}
              />
              <div
                className="absolute top-2 md:top-4 right-2 md:right-4 text-[6px] md:text-[8px] bg-black/80 p-1 md:p-2 border border-red-900/30 text-red-600"
                style={pixelFont}
              >
                STATUS: SECURE
              </div>
            </div>

            <div className="space-y-2 md:space-y-6">
              <div
                style={pixelFont}
                className="text-[8px] md:text-[10px] text-red-600 flex items-center gap-2"
              >
                <ShieldCheck size={12} className="md:w-[14px] md:h-[14px]" />{" "}
                MISSION_BRIEF
              </div>
              <p
                style={appleFont}
                className="text-zinc-400 text-xs md:text-lg font-light leading-relaxed"
              >
                {projects[activeIndex].desc}
              </p>
              <div className="flex gap-4">
                <a
                  href={projects[activeIndex].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={pixelFont}
                  className="flex items-center gap-2 md:gap-3 bg-white text-black px-3 md:px-6 py-2 md:py-4 text-[8px] md:text-[10px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                >
                  ACCESS_LINK{" "}
                  <ExternalLink size={12} className="md:w-[14px] md:h-[14px]" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeProjects;
