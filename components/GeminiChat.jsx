"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { gsap } from "gsap";
import { playSound } from "./useSoundEffects";

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

  const monoFont = {
    fontFamily: '"SF Mono", "Fira Code", "Monaco", monospace',
  };

  const commands = {
    "/help": "Available commands:",
    "/projects": "PROJECTS",
    "/achievements": "ACHIEVEMENTS",
    "/contact": "Email: appuafzal777@gmail.com | GitHub: Afzal74",
    "/skills": "React, Next.js, Tailwind, AI/ML, GSAP, TypeScript",
    "/about": "Afzal - Web Dev & AI Engineer building cool stuff!",
    "/clear": "CLEAR",
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

  const helpCommands = [
    { cmd: "/projects", desc: "View my projects" },
    { cmd: "/achievements", desc: "See my achievements" },
    { cmd: "/contact", desc: "Get my contact info" },
    { cmd: "/skills", desc: "List my tech stack" },
    { cmd: "/about", desc: "Learn about me" },
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

  // Red border animation
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 w-10 h-10 bg-black/90 border border-red-500/50 rounded-lg
                   flex items-center justify-center hover:bg-red-500/20 hover:border-red-500 transition-all"
        style={monoFont}
      >
        <span className="text-red-400 text-sm">{isOpen ? "×" : ">"}</span>
      </button>

      {isOpen && (
        <div className="fixed bottom-20 left-4 z-40 w-80 sm:w-96 h-80 bg-black/95 rounded-lg overflow-hidden shadow-2xl shadow-red-500/10">
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
              className="text-red-400 text-[10px] tracking-wide"
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
                className={`text-[11px] leading-relaxed ${
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
              <div className="text-[11px] text-red-400 leading-relaxed">
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
              <span className="text-red-400 text-[11px]" style={monoFont}>
                $
              </span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isTyping || isLoading}
                placeholder={isTyping ? "..." : "type here..."}
                className="flex-1 bg-transparent text-green-400 text-[11px] outline-none placeholder-red-500/40"
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
