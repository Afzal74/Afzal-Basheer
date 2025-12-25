"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Hero from "@/components/Hero";
import LogoShowcase from "@/components/LogoShowcase";
import HomeProjects from "@/components/HomeProjects";
import { Trophy } from "lucide-react";
import { playSound } from "@/components/useSoundEffects";

const mobileAchievements = [
  {
    id: "ACH-01",
    title: "CodeCircuit Hackathon Finalist",
    year: "2024",
    tags: ["Top 50", "Outlier.ai"],
    desc: "Selected in the top 50 out of 5,000+ participants at CodeCircuit Hackathon. Developed a Trivia Quiz Web App with interactive features and real-time scoring. Awarded a paid freelance opportunity at Outlier.ai, $50 Jam credits, and 3 months of Vimcal premium subscription.",
    img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800",
    carouselImages: [
      '/Achievements/codecircuit/CodeCircuit.jpg',
    ],
    stat: "Top 50/5K+",
  },
  {
    id: "ACH-02",
    title: "AI Meme Generator Competition Winner",
    year: "2024",
    tags: ["1st Place", "Epitome 2K24"],
    desc: "Secured 1st place in AI Meme Generator competition at Epitome-2k24, hosted by AIMIT, St. Aloysius University, Mangaluru. Demonstrated creativity and innovation with an AI-powered meme generator.",
    img: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800",
    carouselImages: [
      '/Achievements/Ai meme generator/Ai meme generator.jpg',
      '/Achievements/Ai meme generator/ai meme generator2.jpg',
    ],
    stat: "1st Place",
  },
  {
    id: "ACH-03",
    title: "Web Development Workshop Mentor",
    year: "2025",
    tags: ["Mentor", "HTML & CSS"],
    desc: "Conducted a full-day HTML & CSS workshop for junior developers on March 22, 2025. Received excellent feedback and strong engagement from participants, helping the next generation of developers.",
    img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800",
    carouselImages: [
      '/Achievements/web development workshop/The workshop.jpg',
      '/Achievements/web development workshop/workshop 2.jpg',
    ],
    stat: "Full Day",
  },
];

const pixelFont = { fontFamily: '"Press Start 2P", cursive' };
const appleFont = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
};

export default function Home() {
  const [activeAchievement, setActiveAchievement] = useState(0);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [imageClicked, setImageClicked] = useState(false);
  const [mounted, setMounted] = useState(false);
  const achievementsRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animate achievements section on mobile
  useEffect(() => {
    if (!mounted) return;

    const hasAnimated = sessionStorage.getItem("heroAnimated");
    
    if (hasAnimated) {
      // Already animated, show immediately
      if (achievementsRef.current) {
        achievementsRef.current.style.opacity = '1';
      }
      return;
    }

    const timer = setTimeout(() => {
      if (achievementsRef.current) {
        gsap.fromTo(
          achievementsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
        );
      }
    }, 3500);

    const fallbackTimer = setTimeout(() => {
      if (achievementsRef.current) {
        achievementsRef.current.style.opacity = '1';
        achievementsRef.current.style.transform = 'translateY(0)';
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      clearTimeout(fallbackTimer);
    };
  }, [mounted]);

  // Carousel effect for achievements with carousel images
  useEffect(() => {
    const currentAchievement = mobileAchievements[activeAchievement];
    if (!currentAchievement.carouselImages) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) => (prev + 1) % currentAchievement.carouselImages.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [activeAchievement]);

  // Reset grayscale on scroll
  useEffect(() => {
    const handleScroll = () => {
      setImageClicked(false);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Red border animation
  useEffect(() => {
    gsap.to('.home-achievement-border-top', {
      left: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none',
    })
    gsap.to('.home-achievement-border-right', {
      top: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none',
      delay: 0.75,
    })
    gsap.to('.home-achievement-border-bottom', {
      right: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none',
      delay: 1.5,
    })
    gsap.to('.home-achievement-border-left', {
      bottom: '100%',
      duration: 3,
      repeat: -1,
      ease: 'none',
      delay: 2.25,
    })
  }, []);

  return (
    <main className="bg-[#050505] min-h-screen">
      <Hero />
      <LogoShowcase />
      <HomeProjects />

      {/* Achievements section - only visible on mobile */}
      <div 
        ref={achievementsRef}
        className="block md:hidden px-4 pt-4 pb-6 relative z-10 border-t border-zinc-900" 
        style={{ opacity: 0 }}
      >
        <div className="mb-2 flex items-center gap-2">
          <Trophy size={14} className="text-red-500" />
          <h2 style={appleFont} className="text-lg font-bold text-white">
            Achievements
          </h2>
        </div>

        {/* Achievement Preview Image */}
        <div 
          className="relative aspect-video mb-2 border border-white/10 overflow-hidden bg-zinc-900 group cursor-pointer"
          onClick={() => setImageClicked(!imageClicked)}
        >
          {/* Red moving border */}
          <div className="absolute inset-0 pointer-events-none z-20">
            <div className="home-achievement-border-top absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <div className="home-achievement-border-right absolute top-[-100%] right-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <div className="home-achievement-border-bottom absolute bottom-0 right-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <div className="home-achievement-border-left absolute bottom-[-100%] left-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          </div>
          <img
            src={mobileAchievements[activeAchievement].carouselImages ? mobileAchievements[activeAchievement].carouselImages[carouselIndex] : mobileAchievements[activeAchievement].img}
            alt={mobileAchievements[activeAchievement].title}
            className={`w-full h-full object-cover transition-all duration-1000 ${
              imageClicked ? 'grayscale-0 brightness-100' : 'grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100'
            }`}
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
                setImageClicked(false);
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

        {/* Achievement Description */}
        <div className="mt-3 p-2 bg-zinc-900/30 border border-zinc-800">
          <p style={appleFont} className="text-zinc-400 text-xs leading-relaxed">
            {mobileAchievements[activeAchievement].desc}
          </p>
        </div>
      </div>
    </main>
  );
}
