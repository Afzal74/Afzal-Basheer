"use client";

import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Music, Volume2 } from "lucide-react";
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";
import Link from "next/link";
import emailjs from "@emailjs/browser";
import { useAudio } from "./AudioProvider";
import { playSound, preloadSounds } from "./useSoundEffects";
import SoundLink from "./SoundLink";

// EmailJS configuration
const EMAILJS_SERVICE_ID = "service_ivn6f7t";
const EMAILJS_TEMPLATE_ID = "template_eqr46z2";
const EMAILJS_PUBLIC_KEY = "UQZ_lKGW2Ghjw5Gnc";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}

const Hero = () => {
  const containerRef = useRef(null);
  const terminalRef = useRef(null);
  const targetAreaRef = useRef(null);
  const nameRef = useRef(null);
  const descRef = useRef(null);
  const wantedRef = useRef(null);
  const roleTextRef = useRef(null);
  const navRef = useRef(null);
  const auraRef = useRef(null);
  const shakeTl = useRef(null);

  const { isPlaying, toggleAudio: globalToggleAudio } = useAudio();

  const [bounty, setBounty] = useState(0);
  const [isShattered, setIsShattered] = useState(false);
  const [isCaptured, setIsCaptured] = useState(false);
  const [imgUrl, setImgUrl] = useState(
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=600&auto=format&fit=crop"
  );
  const [neutralizedPosters, setNeutralizedPosters] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSending, setIsSending] = useState(false);
  const [mounted, setMounted] = useState(false);

  const roles = ["Web Developer", "Designer", "Vibe"];
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  const shards = [
    "polygon(0 0, 100% 0, 50% 50%, 0 50%)",
    "polygon(100% 0, 100% 100%, 50% 50%)",
    "polygon(100% 100%, 0 100%, 50% 50%)",
    "polygon(0 100%, 0 0, 50% 50%)",
  ];

  // Handle shake animation based on audio state
  useEffect(() => {
    if (isPlaying) {
      if (shakeTl.current) shakeTl.current.kill();
      shakeTl.current = gsap.to(".name-char", {
        x: "random(-3, 3)",
        y: "random(-3, 3)",
        rotation: "random(-2, 2)",
        duration: 0.08,
        repeat: -1,
        yoyo: true,
        ease: "none",
        stagger: { each: 0.02, from: "random" },
      });
    } else {
      if (shakeTl.current) {
        shakeTl.current.kill();
        gsap.to(".name-char", {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      }
    }
  }, [isPlaying]);

  const toggleAudio = () => {
    playSound("click", 0.4);
    globalToggleAudio();
  };

  const getRandomImage = useCallback(() => {
    const portraitIds = [
      "1507003211169-0a1dd7228f2d",
      "1500648767791-00dcc994a43e",
      "1472099645785-5658abf4ff4e",
      "1544005313-94ddf0286df2",
      "1552058544-bd2d08422151",
      "1599566150163-29194dcaad36",
    ];
    const randomId =
      portraitIds[Math.floor(Math.random() * portraitIds.length)];
    return `https://images.unsplash.com/photo-${randomId}?q=80&w=600&auto=format&fit=crop`;
  }, []);

  const SplitText = ({ text, className, charClassName }) => (
    <span className={className}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className={`${charClassName} inline-block whitespace-pre cursor-pointer transition-colors duration-200 active:scale-90`}
          onClick={(e) => {
            if (charClassName.includes("name-char") && char !== " ") {
              const el = e.target;
              if (el.style.color === "rgb(239, 68, 68)") {
                el.style.color = "";
              } else {
                el.style.color = "#ef4444";
              }
            }
          }}
        >
          {char}
        </span>
      ))}
    </span>
  );

  useEffect(() => {
    setMounted(true);
    preloadSounds();
  }, []);

  useLayoutEffect(() => {
    if (!mounted) return;

    // Check if animations already played this session
    const hasAnimated = sessionStorage.getItem("heroAnimated");

    if (hasAnimated) {
      // Skip animations, just show everything
      gsap.set(navRef.current, { opacity: 1, y: 0 });
      gsap.set(".nav-item", { opacity: 1, y: 0 });
      gsap.set("#line-1", { text: "> SYNCING_NEURAL_LINK..." });
      gsap.set("#line-2", { text: "> CALIBRATING_MOTION..." });
      gsap.set("#line-3", { text: "> TARGET_LOCKED: AFZAL" });
      gsap.set(".intro-char", { opacity: 1, y: 0 });
      gsap.set(".name-char", {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        y: 0,
      });
      gsap.set(".music-btn", { opacity: 1, scale: 1 });
      gsap.set(roleTextRef.current, { opacity: 1, x: 0 });
      gsap.set(".desc-line", { opacity: 1, x: 0 });
      gsap.set(".word", { opacity: 1, y: 0 });
      gsap.set(wantedRef.current, { opacity: 1, scale: 1 });
      gsap.set(".target-box", { opacity: 1, scale: 1 });
      gsap.set(".target-shard", { opacity: 1, scale: 1, rotation: 0 });

      // Start the role rotation
      const interval = setInterval(() => {
        gsap.to(roleTextRef.current, {
          y: -15,
          opacity: 0,
          duration: 0.4,
          onComplete: () => {
            setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
            gsap.fromTo(
              roleTextRef.current,
              { y: 15, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.4 }
            );
          },
        });
      }, 2500);

      // Aura breathing animation
      gsap.to(auraRef.current, {
        scale: 1.1,
        opacity: 0.35,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      return () => clearInterval(interval);
    }

    const ctx = gsap.context(() => {
      const mainTl = gsap.timeline({ defaults: { ease: "power4.out" } });

      mainTl.fromTo(
        navRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
      mainTl.fromTo(
        ".nav-item",
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.1 },
        "-=0.5"
      );

      // Terminal typing sound - plays once per line
      const playTypingSound = () => {
        playSound("click", 0.4);
      };

      mainTl
        .to("#line-1", {
          duration: 0.5,
          text: "> SYNCING_NEURAL_LINK...",
          delay: 0.1,
          onStart: playTypingSound,
        })
        .to("#line-2", {
          duration: 0.5,
          text: "> CALIBRATING_MOTION...",
          delay: 0.1,
          onStart: playTypingSound,
        })
        .to("#line-3", {
          duration: 0.6,
          text: "> TARGET_LOCKED: AFZAL",
          delay: 0.1,
          onStart: playTypingSound,
        });

      mainTl.fromTo(
        ".intro-char",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.03 },
        "+=0.2"
      );

      mainTl.fromTo(
        ".name-char",
        { opacity: 0, scale: 1.5, filter: "blur(10px)", y: 20 },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.8,
          stagger: 0.04,
        },
        "-=0.5"
      );

      // Animate music button after name
      mainTl.fromTo(
        ".music-btn",
        { opacity: 0, scale: 0.5 },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.7)" },
        "-=0.3"
      );

      mainTl.fromTo(
        roleTextRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 1 },
        "-=0.5"
      );

      // Animate description line (border) first, then words
      mainTl.fromTo(
        ".desc-line",
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5 },
        "-=0.5"
      );
      const descWords = descRef.current?.querySelectorAll(".word");
      if (descWords) {
        mainTl.fromTo(
          descWords,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 },
          "-=0.3"
        );
      }

      mainTl.fromTo(
        wantedRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 1 },
        "-=1.5"
      );
      mainTl.fromTo(
        ".target-box",
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8 },
        "-=0.8"
      );
      mainTl.fromTo(
        ".target-shard",
        { scale: 0, opacity: 0, rotation: 15 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1, stagger: 0.05 },
        "-=0.5"
      );

      gsap.to(auraRef.current, {
        scale: 1.1,
        opacity: 0.35,
        duration: 4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      mainTl.add(() => {
        const interval = setInterval(() => {
          gsap.to(roleTextRef.current, {
            y: -15,
            opacity: 0,
            duration: 0.4,
            onComplete: () => {
              setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
              gsap.fromTo(
                roleTextRef.current,
                { y: 15, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4 }
              );
            },
          });
        }, 2500);
        return () => clearInterval(interval);
      }, "-=0.2");

      // Mark animations as complete
      sessionStorage.setItem("heroAnimated", "true");
    }, containerRef);

    return () => ctx.revert();
  }, [mounted]);

  const handleNameEnter = () => {
    // Don't override shake if music is playing
    if (isPlaying) return;
    playSound("hover", 0.2);
    if (shakeTl.current) shakeTl.current.kill();
    shakeTl.current = gsap.to(".name-char", {
      x: "random(-2, 2)",
      y: "random(-2, 2)",
      rotation: "random(-1, 1)",
      duration: 0.05,
      repeat: -1,
      yoyo: true,
      ease: "none",
      stagger: { each: 0.02, from: "random" },
    });
  };

  const handleNameLeave = () => {
    // Don't stop shake if music is playing
    if (isPlaying) return;
    if (shakeTl.current) {
      shakeTl.current.kill();
      gsap.to(".name-char", {
        x: 0,
        y: 0,
        rotation: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  };

  const handleSlash = () => {
    if (isShattered || isCaptured) return;

    // Play gunshot and glass break sounds
    const gunshot = new Audio(
      "https://www.soundjay.com/mechanical/sounds/gun-gunshot-01.mp3"
    );
    const glassBreak = new Audio(
      "https://www.soundjay.com/misc/sounds/glass-break-1.mp3"
    );
    gunshot.volume = 0.3;
    glassBreak.volume = 0.4;
    gunshot.play().catch(() => {});
    setTimeout(() => glassBreak.play().catch(() => {}), 50);

    const currentPhoto = imgUrl;
    const getRandomSafeZone = () => {
      const zone = Math.random();
      if (zone > 0.6) {
        return { x: Math.random() * 20 + 75, y: Math.random() * 70 + 15 };
      } else if (zone > 0.3) {
        return { x: Math.random() * 90 + 5, y: Math.random() * 10 + 5 };
      } else {
        return { x: Math.random() * 90 + 5, y: Math.random() * 10 + 85 };
      }
    };

    const coords = getRandomSafeZone();
    const posterData = {
      id: Date.now(),
      url: currentPhoto,
      x: coords.x,
      y: coords.y,
      rotation: Math.random() * 40 - 20,
    };

    setNeutralizedPosters((prev) => [...prev, posterData]);

    const newBounty = bounty + 125000;
    setBounty(newBounty);

    if (newBounty >= 1000000) {
      setIsCaptured(true);

      // Play victory/congratulations sound
      const victorySound = new Audio(
        "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3"
      );
      victorySound.volume = 0.5;
      victorySound.play().catch(() => {});

      gsap.to(auraRef.current, {
        background:
          "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
        duration: 1.5,
      });

      gsap.to(".target-shard", {
        rotation: 360,
        scale: 0.5,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        onComplete: () => {
          gsap.fromTo(
            ".captured-ui",
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
          );
        },
      });
      return;
    }

    setIsShattered(true);
    const streak = document.createElement("div");
    streak.className =
      "absolute w-full h-[3px] bg-red-500 z-50 shadow-[0_0_20px_#ef4444]";
    streak.style.left = "0";
    streak.style.top = "50%";
    streak.style.transform = `rotate(${Math.random() * 360}deg) scaleX(0)`;
    targetAreaRef.current?.appendChild(streak);

    gsap.to(streak, {
      scaleX: 2.5,
      opacity: 0,
      duration: 0.15,
      onComplete: () => streak.remove(),
    });

    gsap.to(".target-shard", {
      x: (i) => (i === 0 ? -80 : i === 1 ? 80 : i === 2 ? 40 : -40),
      y: (i) => (i === 0 ? -80 : i === 1 ? -40 : i === 2 ? 80 : 40),
      rotation: (i) => (i % 2 === 0 ? 180 : -180),
      scale: 0.1,
      opacity: 0,
      duration: 0.5,
      onComplete: () => {
        setImgUrl(getRandomImage());
        setTimeout(() => {
          gsap.to(".target-shard", {
            x: 0,
            y: 0,
            rotation: 0,
            scale: 1,
            opacity: 1,
            duration: 0.8,
            ease: "elastic.out(1, 0.6)",
            onComplete: () => setIsShattered(false),
          });
        }, 500);
      },
    });
  };

  const [formStatus, setFormStatus] = useState({ type: "", message: "" });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setFormStatus({ type: "", message: "" });

    try {
      const result = await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name: formState.name,
          from_email: formState.email,
          message: formState.message,
        },
        EMAILJS_PUBLIC_KEY
      );

      if (result.status === 200) {
        playSound("success", 0.5);
        setFormStatus({
          type: "success",
          message: "Message transmitted successfully!",
        });
        setFormState({ name: "", email: "", message: "" });
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setFormStatus({
        type: "error",
        message: "Transmission failed. Try again.",
      });
    } finally {
      setIsSending(false);
    }
  };

  const pixelFont = { fontFamily: '"Press Start 2P", cursive' };
  const appleFont = {
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#050505] text-white flex flex-col items-center overflow-x-hidden cursor-crosshair selection:bg-red-500 relative"
    >
      {/* BACKGROUND NEUTRALIZED POSTERS */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {neutralizedPosters.map((poster) => (
          <div
            key={poster.id}
            className="absolute w-20 md:w-32 aspect-square border border-white/5 bg-zinc-900/50 overflow-hidden shadow-2xl opacity-20 animate-in fade-in zoom-in duration-700"
            style={{
              left: `${poster.x}%`,
              top: `${poster.y}%`,
              transform: `rotate(${poster.rotation}deg)`,
            }}
          >
            <img
              src={poster.url}
              alt="neutralized"
              className="w-full h-full object-cover grayscale opacity-30"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute w-full h-[2px] bg-red-600/40 rotate-45" />
              <div className="absolute w-full h-[2px] bg-red-600/40 -rotate-45" />
            </div>
            <div
              style={pixelFont}
              className="absolute bottom-1 left-1 text-[3px] md:text-[5px] text-red-500/60 bg-black/40 px-1 py-0.5 uppercase"
            >
              Neutralized
            </div>
          </div>
        ))}
      </div>

      <nav
        ref={navRef}
        className="w-full fixed top-0 left-0 z-[100] px-4 md:px-12 py-3 md:py-6 flex items-center justify-between backdrop-blur-sm bg-black/20 opacity-0"
      >
        <SoundLink
          href="/"
          style={pixelFont}
          className="text-[10px] md:text-xs tracking-tighter text-white"
        >
          AFZAL<span className="text-red-600">.SYS</span>
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
              className="nav-item text-[6px] md:text-[9px] uppercase tracking-widest text-zinc-500 hover:text-red-500 transition-colors duration-300 relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-red-600 transition-all duration-300 group-hover:w-full" />
            </SoundLink>
          ))}
        </div>
      </nav>

      <div className="flex-1 w-full flex items-start md:items-center pt-14 md:pt-20 lg:pt-0 z-10">
        <div className="container mx-auto px-4 md:px-12 lg:px-24 h-full flex items-center">
          <div className="flex flex-row items-stretch justify-between gap-4 md:gap-16 w-full">
            <div className="w-[65%] lg:w-3/5 flex flex-col z-10 text-left justify-center">
              <div
                ref={terminalRef}
                style={pixelFont}
                className="text-[5px] md:text-[9px] text-zinc-700 mb-2 md:mb-10 space-y-0.5 md:space-y-2 uppercase tracking-[0.1em] md:tracking-[0.2em]"
              >
                <div id="line-1" className="min-h-[1.5em]"></div>
                <div id="line-2" className="min-h-[1.5em]"></div>
                <div id="line-3" className="min-h-[1.5em] text-red-900"></div>
              </div>

              <div className="mb-1">
                <SplitText
                  text="I am a"
                  charClassName="intro-char"
                  className="text-[clamp(0.55rem,1.2vw,1.2rem)] font-light text-zinc-600 uppercase tracking-widest"
                />
              </div>

              <h1
                ref={nameRef}
                onMouseEnter={handleNameEnter}
                onMouseLeave={handleNameLeave}
                style={pixelFont}
                className="text-[clamp(0.75rem,4.5vw,4.5rem)] font-normal leading-[1.4] lg:leading-[1.1] tracking-[-0.04em] text-white mb-3 md:mb-6 select-none relative group"
              >
                <div className="flex items-center gap-3">
                  <SplitText
                    text="AFZAL"
                    charClassName="name-char"
                    className="inline-block"
                  />
                  <button
                    onClick={toggleAudio}
                    className="music-btn p-2 md:p-3 rounded-full bg-zinc-900/80 border border-zinc-800 hover:border-red-600 hover:bg-zinc-800 transition-all group/music active:scale-90 opacity-0"
                    title="Toggle Mission Audio"
                  >
                    {isPlaying ? (
                      <Volume2 className="w-3 h-3 md:w-5 md:h-5 text-red-600 animate-pulse" />
                    ) : (
                      <Music className="w-3 h-3 md:w-5 md:h-5 text-zinc-500 group-hover/music:text-red-500 transition-colors" />
                    )}
                  </button>
                </div>
                <SplitText
                  text="BASHEER"
                  charClassName="name-char"
                  className="block"
                />
              </h1>

              <div className="space-y-3 md:space-y-8">
                <div
                  style={appleFont}
                  className="text-[clamp(0.7rem,3vw,2.5rem)] font-bold tracking-tighter text-white h-[1.2em] flex items-center"
                >
                  <span
                    ref={roleTextRef}
                    className="text-red-600 inline-block min-w-[100px] lg:min-w-[280px] opacity-0"
                  >
                    {roles[currentRoleIndex]}
                  </span>
                </div>
                <p
                  ref={descRef}
                  style={appleFont}
                  className="desc-line text-zinc-500 text-[8px] md:text-lg lg:text-xl max-w-lg leading-snug md:leading-relaxed font-light border-l border-zinc-800 pl-2 md:pl-6 opacity-0"
                >
                  {"Creative engineer specializing in high-fidelity interaction and gaming-inspired motion systems. Bridging the gap between code and emotion."
                    .split(" ")
                    .map((word, i) => (
                      <span
                        key={i}
                        className="word inline-block mr-1 opacity-0"
                      >
                        {word}
                      </span>
                    ))}
                </p>
              </div>
            </div>

            <div className="w-[35%] lg:w-2/5 flex flex-col items-center justify-center relative">
              <div
                ref={auraRef}
                className="absolute w-[150%] h-[150%] -z-10 blur-[80px] pointer-events-none rounded-full will-change-transform"
                style={{
                  background:
                    "radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, rgba(0, 0, 0, 0) 70%)",
                }}
              />

              {!isCaptured ? (
                <>
                  <div
                    ref={wantedRef}
                    style={pixelFont}
                    className="opacity-0 w-full text-center mb-3 md:mb-8 space-y-1 md:space-y-4"
                  >
                    <div className="bg-red-600 text-black py-0.5 px-2 md:py-2 md:px-6 inline-block text-[7px] md:text-xl font-black italic tracking-tighter shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                      WANTED
                    </div>
                    <div
                      id="bounty-text"
                      className="text-[5px] md:text-[14px] text-white tracking-widest uppercase border-b border-white/10 pb-1"
                    >
                      ${bounty.toLocaleString()} / $1,000,000
                    </div>
                  </div>

                  <div
                    ref={targetAreaRef}
                    onClick={handleSlash}
                    className="target-box relative w-full max-w-[120px] md:max-w-[320px] aspect-square group active:scale-95 transition-transform mx-auto opacity-0"
                  >
                    <div className="relative w-full h-full border-[1px] border-white/5 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.9)] bg-black">
                      {shards.map((clip, i) => (
                        <div
                          key={i}
                          className="target-shard absolute inset-0 opacity-0 scale-0"
                          style={{
                            clipPath: clip,
                            zIndex: 10 - i,
                            filter: isShattered
                              ? "brightness(6) contrast(2)"
                              : "none",
                          }}
                        >
                          <img
                            src={imgUrl}
                            alt="Identity"
                            className="w-full h-full object-cover grayscale brightness-50 group-hover:brightness-110 group-hover:grayscale-0 transition-all duration-1000"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="w-full h-px bg-white/5 absolute rotate-45" />
                      <div className="w-full h-px bg-white/5 absolute -rotate-45" />
                      <div className="w-6 h-6 md:w-20 md:h-20 border border-red-600/30 rounded-full animate-pulse flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-red-600 rounded-full" />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full max-w-[120px] md:max-w-[320px] relative captured-ui min-h-[140px]">
                  <form
                    onSubmit={handleFormSubmit}
                    className="border border-green-600/30 bg-black flex flex-col p-3 md:p-6 space-y-2 md:space-y-4 relative"
                  >
                    <div
                      className="absolute inset-0 opacity-5 pointer-events-none"
                      style={{
                        backgroundImage:
                          "radial-gradient(#10b981 1px, transparent 1px)",
                        backgroundSize: "15px 15px",
                      }}
                    />

                    <div className="text-center relative z-10">
                      <div
                        style={pixelFont}
                        className="text-green-500 text-[5px] md:text-[8px] animate-pulse mb-1 tracking-tighter uppercase"
                      >
                        Congratulations! You got him.
                      </div>
                      <div
                        style={appleFont}
                        className="text-white text-[9px] md:text-lg font-bold"
                      >
                        Secure Transmission
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1.5 md:space-y-3 relative z-10">
                      <div className="space-y-1">
                        <label
                          style={pixelFont}
                          className="text-[4px] md:text-[6px] text-zinc-500 block uppercase"
                        >
                          Name
                        </label>
                        <input
                          type="text"
                          required
                          value={formState.name}
                          onChange={(e) =>
                            setFormState({ ...formState, name: e.target.value })
                          }
                          className="w-full bg-zinc-900/50 border border-zinc-800 px-2 py-1 md:py-2 text-[6px] md:text-[10px] focus:outline-none focus:border-green-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-1">
                        <label
                          style={pixelFont}
                          className="text-[4px] md:text-[6px] text-zinc-500 block uppercase"
                        >
                          Email_ID
                        </label>
                        <input
                          type="email"
                          required
                          value={formState.email}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              email: e.target.value,
                            })
                          }
                          className="w-full bg-zinc-900/50 border border-zinc-800 px-2 py-1 md:py-2 text-[6px] md:text-[10px] focus:outline-none focus:border-green-600 transition-colors"
                        />
                      </div>

                      <div className="space-y-1 flex flex-col">
                        <label
                          style={pixelFont}
                          className="text-[4px] md:text-[6px] text-zinc-500 block uppercase"
                        >
                          Message_Data
                        </label>
                        <textarea
                          required
                          value={formState.message}
                          onChange={(e) =>
                            setFormState({
                              ...formState,
                              message: e.target.value,
                            })
                          }
                          className="w-full min-h-[40px] md:min-h-[80px] bg-zinc-900/50 border border-zinc-800 px-2 py-1 text-[6px] md:text-[10px] focus:outline-none focus:border-green-600 transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSending}
                      style={pixelFont}
                      className={`relative z-10 w-full py-2 md:py-4 text-[6px] md:text-[9px] transition-all duration-300 uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.1)] ${
                        isSending
                          ? "bg-zinc-800 text-zinc-500"
                          : "bg-green-600 text-white hover:bg-white hover:text-black"
                      }`}
                    >
                      {isSending ? "Sending..." : "Transmit_Data"}
                    </button>

                    {/* Status message */}
                    {formStatus.message && (
                      <div
                        style={pixelFont}
                        className={`text-[5px] md:text-[7px] text-center uppercase tracking-tighter mt-2 ${
                          formStatus.type === "success"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {formStatus.message}
                      </div>
                    )}

                    <div
                      style={pixelFont}
                      className="text-[3px] md:text-[6px] text-zinc-700 text-center uppercase tracking-tighter mt-1"
                    >
                      Target_Direct: appuafzal777@gmail.com
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className="fixed bottom-2 left-2 lg:bottom-10 lg:left-10 opacity-10 pointer-events-none flex flex-col gap-1 z-0"
        style={pixelFont}
      >
        <div className="text-[4px] lg:text-[8px]">CORE_LOADED: TRUE</div>
        <div className="text-[4px] lg:text-[8px] text-red-900">
          STRIKE_ENABLED
        </div>
      </div>
    </div>
  );
};

export default Hero;
