"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gsap } from "gsap";
import { playSound } from "./useSoundEffects";
import { useAudio } from "./AudioProvider";

const GeminiChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const terminalRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const { isPlaying, toggleAudio } = useAudio();

  const monoFont = {
    fontFamily: '"SF Mono", "Fira Code", "Monaco", monospace',
  };

  const commands = {
    "/help": "Available commands:",
    "/projects": "PROJECTS",
    "/achievements": "ACHIEVEMENTS",
    "/rateme": "RATEME",
    "/contact": "Email: appuafzal777@gmail.com | GitHub: Afzal74",
    "/skills": "React, Next.js, Tailwind, AI/ML, GSAP, TypeScript",
    "/about": "Afzal - Web Dev & AI Engineer building cool stuff!",
    "/clear": "CLEAR",
    "/music": "MUSIC",
    "/play": "PLAY",
    "/pause": "PAUSE",
    "/experience": "EXPERIENCE",
    "/flappy": "FLAPPY",
  };

  const projectsList = [
    {
      name: "Gamified Learning Platform",
      desc: "Interactive learning for rural schools",
    },
    { name: "QuizVerse", desc: "Trivia quiz app with multiplayer" },
    { name: "VTU Vault", desc: "Academic companion for VTU students" },
  ];

  const achievementsList = [
    { name: "Hackathon Winner", desc: "Won multiple coding competitions" },
    { name: "Open Source", desc: "Active contributor to OSS projects" },
  ];

  const experienceList = [
    { company: "Anvelos Softwares", role: "Web Developer Intern", period: "2024" },
  ];

  const helpCommands = [
    { cmd: "/projects", desc: "View my projects" },
    { cmd: "/achievements", desc: "See my achievements" },
    { cmd: "/experience", desc: "View my work experience" },
    { cmd: "/rateme", desc: "Rate my portfolio" },
    { cmd: "/contact", desc: "Get my contact info" },
    { cmd: "/skills", desc: "List my tech stack" },
    { cmd: "/about", desc: "Learn about me" },
    { cmd: "/music", desc: "Toggle background music" },
    { cmd: "/play", desc: "Play music" },
    { cmd: "/pause", desc: "Pause music" },
    { cmd: "/flappy", desc: "Flappy Bird leaderboard" },
    { cmd: "/clear", desc: "Clear terminal" },
  ];

  const scrollToBottom = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [lines, currentTypingText, scrollToBottom]);

  // Letter by letter typing
  const typeLine = useCallback(async (text, type = "system") => {
    setIsTyping(true);
    setCurrentTypingText("");

    for (let i = 0; i <= text.length; i++) {
      await new Promise((r) => setTimeout(r, 25));
      setCurrentTypingText(text.slice(0, i));
      if (i % 2 === 0) playSound("click", 0.05);
    }

    setLines((prev) => [...prev, { type, text }]);
    setCurrentTypingText("");
    await new Promise((r) => setTimeout(r, 50));
    setIsTyping(false);
  }, []);

  // Welcome message
  useEffect(() => {
    if (isOpen && lines.length === 0) {
      const showWelcome = async () => {
        await typeLine("> AFZAL.SYS v1.0", "system");
        await typeLine("> Type /help for commands", "system");
      };
      showWelcome();
    }
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, lines.length, typeLine]);

  // Button border animation - always running
  useEffect(() => {
    gsap.to(".btn-border-top", {
      left: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".btn-border-right", {
      top: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 0.5,
    });
    gsap.to(".btn-border-bottom", {
      right: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 1,
    });
    gsap.to(".btn-border-left", {
      bottom: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 1.5,
    });
  }, []);

  // Chat window border animation
  useEffect(() => {
    if (!isOpen) return;
    gsap.to(".chat-border-top", {
      left: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".chat-border-right", {
      top: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 0.5,
    });
    gsap.to(".chat-border-bottom", {
      right: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 1,
    });
    gsap.to(".chat-border-left", {
      bottom: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 1.5,
    });
  }, [isOpen]);

  // AI response handler
  const getAIResponse = async (userMessage) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      if (!apiKey) return "API key not configured. Try /help for commands.";

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `You are a helpful AI assistant for Afzal's portfolio website.
      
About Afzal:
- Web Developer & AI Engineer
- Skills: React, Next.js, Tailwind CSS, GSAP, AI/ML, TypeScript
- Email: appuafzal777@gmail.com
- GitHub: Afzal74

Keep responses SHORT (2-3 sentences max). Be friendly and helpful.
User: ${userMessage}`;

      const result = await model.generateContent(prompt);
      return result.response.text().slice(0, 200);
    } catch (error) {
      console.error("AI Error:", error);
      return "Sorry, I couldn't process that. Try /help for commands.";
    }
  };

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isTyping || isLoading) return;

    const userInput = input.trim();
    setInput("");
    setLines((prev) => [...prev, { type: "user", text: `> ${userInput}` }]);

    const cmd = userInput.toLowerCase();
    if (commands[cmd]) {
      const response = commands[cmd];
      if (response === "CLEAR") {
        setLines([]);
        await typeLine("> Terminal cleared", "system");
        return;
      }
      // Handle /projects - show list then navigate
      if (response === "PROJECTS") {
        await typeLine("> My Projects:", "system");
        for (const { name, desc } of projectsList) {
          await typeLine(`  • ${name} - ${desc}`, "system");
        }
        await typeLine("> Navigating to projects...", "system");
        setTimeout(() => router.push("/projects"), 1000);
        return;
      }
      // Handle /achievements - show list then navigate
      if (response === "ACHIEVEMENTS") {
        await typeLine("> My Achievements:", "system");
        for (const { name, desc } of achievementsList) {
          await typeLine(`  • ${name} - ${desc}`, "system");
        }
        await typeLine("> Navigating to achievements...", "system");
        setTimeout(() => router.push("/achievements"), 1000);
        return;
      }
      // Handle /rateme - explain and navigate to ratings
      if (response === "RATEME") {
        await typeLine("> Rate My Portfolio!", "system");
        await typeLine("  • Leave your feedback and rating", "system");
        await typeLine("  • Add a sticky note with your thoughts", "system");
        await typeLine("  • Help me improve by sharing your experience", "system");
        await typeLine("> Navigating to ratings...", "system");
        setTimeout(() => router.push("/ratings"), 1000);
        return;
      }
      // Handle /experience - show work experience
      if (response === "EXPERIENCE") {
        await typeLine("> Work Experience:", "system");
        for (const { company, role, period } of experienceList) {
          await typeLine(`  • ${company}`, "system");
          await typeLine(`    ${role} | ${period}`, "system");
        }
        return;
      }
      // Handle /music - toggle music
      if (response === "MUSIC") {
        toggleAudio();
        const status = !isPlaying ? "Playing" : "Paused";
        await typeLine(`> Music ${status} 🎵`, "system");
        return;
      }
      // Handle /play - play music
      if (response === "PLAY") {
        if (!isPlaying) toggleAudio();
        await typeLine("> Music playing 🎵", "system");
        return;
      }
      // Handle /pause - pause music
      if (response === "PAUSE") {
        if (isPlaying) toggleAudio();
        await typeLine("> Music paused ⏸️", "system");
        return;
      }
      // Handle /flappy - show flappy bird leaderboard
      if (response === "FLAPPY") {
        await typeLine("> Flappy Bird Leaderboard 🐦", "system");
        const scores = JSON.parse(localStorage.getItem("flappyHighScores") || "[]");
        if (scores.length === 0) {
          await typeLine("  No scores yet! Play the game first.", "system");
          await typeLine("  Click the bird icon in the navbar.", "system");
        } else {
          const topScores = scores.slice(0, 5);
          for (let i = 0; i < topScores.length; i++) {
            await typeLine(`  ${i + 1}. Score: ${topScores[i]}`, "system");
          }
        }
        return;
      }
      // Handle /help specially to show formatted list
      if (cmd === "/help") {
        await typeLine("> Available commands:", "system");
        for (const { cmd: c, desc } of helpCommands) {
          await typeLine(`  ${c} - ${desc}`, "system");
        }
        return;
      }
      await typeLine(`> ${response}`, "system");
      return;
    }

    setIsLoading(true);
    await typeLine("> Processing...", "system");
    const aiResponse = await getAIResponse(userInput);
    await typeLine(`> ${aiResponse}`, "ai");
    setIsLoading(false);
  };

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50">
        {/* Animated border container */}
        <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-lg">
          {/* Red moving border - clips to rounded corners */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg z-20">
            <div className="btn-border-top absolute top-0 left-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <div className="btn-border-right absolute top-[-100%] right-0 w-[2px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <div className="btn-border-bottom absolute bottom-0 right-[-100%] w-full h-[2px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
            <div className="btn-border-left absolute bottom-[-100%] left-0 w-[2px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          </div>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative w-full h-full bg-black border border-zinc-800/50 rounded-lg
                       flex items-center justify-center transition-all cursor-pointer"
            style={monoFont}
          >
            <span className="text-zinc-500 text-lg md:text-xl">
              {isOpen ? "×" : ">"}
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed bottom-24 right-6 z-40 w-80 sm:w-96 h-80 bg-black/95 rounded-lg overflow-hidden shadow-2xl shadow-red-500/10">
          <div className="chat-border-top absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-red-500 to-transparent" />
          <div className="chat-border-right absolute top-0 right-0 w-0.5 h-full bg-gradient-to-b from-red-500 to-transparent" />
          <div className="chat-border-bottom absolute bottom-0 right-0 w-full h-0.5 bg-gradient-to-l from-red-500 to-transparent" />
          <div className="chat-border-left absolute bottom-0 left-0 w-0.5 h-full bg-gradient-to-t from-red-500 to-transparent" />

          {/* Mac-style header */}
          <div className="p-2 border-b border-red-500/30 flex items-center justify-between">
            {/* Traffic light buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsOpen(false)}
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 hover:scale-110 transition-all cursor-pointer"
                title="Close"
              />
              <div
                className="w-3 h-3 rounded-full bg-yellow-500 opacity-50 cursor-not-allowed"
                title="Minimize"
              />
              <div
                className="w-3 h-3 rounded-full bg-green-500 opacity-50 cursor-not-allowed"
                title="Maximize"
              />
            </div>
            <span
              className="text-red-400 text-sm tracking-wide"
              style={monoFont}
            >
              afzal@terminal
            </span>
            {/* Extra close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-red-400 transition-colors text-sm"
              title="Close"
            >
              ✕
            </button>
          </div>

          <div
            ref={terminalRef}
            className="h-52 overflow-y-auto p-3 space-y-2"
            style={monoFont}
          >
            {lines.map((line, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed ${
                  line.type === "user"
                    ? "text-green-400"
                    : line.type === "ai"
                    ? "text-cyan-400"
                    : "text-red-400"
                }`}
              >
                {line.text}
              </div>
            ))}
            {currentTypingText && (
              <div className="text-sm text-red-400 leading-relaxed">
                {currentTypingText}
                <span className="animate-pulse">▋</span>
              </div>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="absolute bottom-0 left-0 right-0 p-2 border-t border-red-500/30"
          >
            <div className="flex items-center gap-2">
              <span className="text-red-400 text-sm" style={monoFont}>
                $
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping || isLoading}
                placeholder={isTyping ? "..." : "type here..."}
                className="flex-1 bg-transparent text-green-400 text-sm outline-none placeholder-red-500/40"
                style={monoFont}
              />
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default GeminiChat;
