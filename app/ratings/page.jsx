"use client";

import { useState, useEffect, useRef } from "react";
import { Plus, Star, ArrowLeft, Users, Loader2 } from "lucide-react";
import { gsap } from "gsap";
import RatingCard from "@/components/RatingCard";
import SoundLink from "@/components/SoundLink";
import { playSound } from "@/components/useSoundEffects";
import { supabase } from "@/lib/supabase";

const pixelFont = { fontFamily: '"Press Start 2P", cursive' };
const appleFont = {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
};

export default function RatingsPage() {
  const [cards, setCards] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef(null);
  const headerRef = useRef(null);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load cards from Supabase
  useEffect(() => {
    setMounted(true);
    loadCards();
  }, []);

  const loadCards = async () => {
    if (!supabase) {
      // Fallback to localStorage if no Supabase
      const saved = localStorage.getItem("ratingCards");
      if (saved) setCards(JSON.parse(saved));
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("ratings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        // Table might not exist yet - that's okay, just use empty array
        if (
          error.code === "42P01" ||
          error.message?.includes("does not exist")
        ) {
          console.log("Ratings table not found - please create it in Supabase");
          setCards([]);
          setLoading(false);
          return;
        }
        throw error;
      }

      // Transform from DB format to card format
      const loadedCards = (data || []).map((item) => ({
        id: item.id,
        name: item.name || "",
        message: item.message || "",
        rating: item.rating || 0,
        color: item.color || "#ef4444",
        width: item.width || 256,
        x: item.x || 400,
        y: item.y || 300,
        rotation: item.rotation || 0,
        date: item.date || "",
        time: item.time || "",
        pasted: item.pasted || false,
        createdAt: item.created_at,
      }));

      setCards(loadedCards);
    } catch (error) {
      console.error("Error loading ratings:", error?.message || error);
      // Fallback to localStorage
      const saved = localStorage.getItem("ratingCards");
      if (saved) setCards(JSON.parse(saved));
    }
    setLoading(false);
  };

  // Animate nav and header after mount
  useEffect(() => {
    if (!mounted) return;
    gsap.fromTo(
      navRef.current,
      { y: -20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
    );
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.3, ease: "power3.out" }
    );
  }, [mounted]);

  const addCard = async () => {
    playSound("click", 0.4);
    const now = new Date();
    const isMobile = window.innerWidth < 640;
    const cardW = isMobile ? 160 : 200;
    const minY = isMobile ? 200 : 250;

    const spawnX = Math.random() * (window.innerWidth - cardW - 20) + 10;
    const spawnY = Math.random() * (window.innerHeight - 350) + minY;

    const newCard = {
      id: Date.now().toString(),
      name: "",
      message: "",
      rating: 0,
      color: "#ef4444",
      width: cardW,
      x: spawnX,
      y: spawnY,
      rotation: Math.random() * 4 - 2,
      date: now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      pasted: false,
      createdAt: now.toISOString(),
    };

    setCards((prev) => [...prev, newCard]);
  };

  const updateCard = async (updatedCard) => {
    setCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );

    // Save to Supabase when card is pasted
    if (updatedCard.pasted && supabase) {
      try {
        const { error } = await supabase.from("ratings").upsert({
          id: updatedCard.id,
          name: updatedCard.name,
          message: updatedCard.message,
          rating: updatedCard.rating,
          color: updatedCard.color,
          width: updatedCard.width,
          x: updatedCard.x,
          y: updatedCard.y,
          rotation: updatedCard.rotation,
          date: updatedCard.date,
          time: updatedCard.time,
          pasted: updatedCard.pasted,
          created_at: updatedCard.createdAt,
        });
        if (error) throw error;
      } catch (error) {
        console.error("Error saving rating:", error);
      }
    }
  };

  const deleteCard = async (id) => {
    playSound("click", 0.3);
    setCards((prev) => prev.filter((card) => card.id !== id));

    // Delete from Supabase
    if (supabase) {
      try {
        const { error } = await supabase.from("ratings").delete().eq("id", id);
        if (error) throw error;
      } catch (error) {
        console.error("Error deleting rating:", error);
      }
    }
  };

  // Calculate average rating (only pasted cards count)
  const pastedCards = cards.filter((c) => c.pasted);
  const ratedCards = pastedCards.filter((c) => c.rating > 0);
  const avgRating =
    ratedCards.length > 0
      ? (
          ratedCards.reduce((sum, c) => sum + c.rating, 0) / ratedCards.length
        ).toFixed(1)
      : "0.0";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#050505] text-white">
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
                item.name === "Rate Me"
                  ? "text-red-500"
                  : "text-zinc-500 hover:text-red-500"
              } ${item.hidden ? "hidden" : ""}`}
            >
              {item.name}
              <span
                className={`absolute -bottom-1 left-0 h-[1px] bg-red-600 transition-all duration-300 ${
                  item.name === "Rate Me" ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
            </SoundLink>
          ))}
        </div>
      </nav>

      {/* Header Section */}
      <div className="pt-16 md:pt-32 pb-4 md:pb-10">
        <div className="container mx-auto px-4 md:px-12 lg:px-24">
          <div
            ref={headerRef}
            className="ratings-header mb-4 md:mb-8 opacity-0"
          >
            <div
              style={pixelFont}
              className="text-zinc-600 text-[8px] md:text-[10px] tracking-widest mb-2 md:mb-4 uppercase flex items-center gap-2"
            >
              <Star size={12} className="md:w-[14px] md:h-[14px]" />{" "}
              Rating_Board / {pastedCards.length} Ratings
            </div>

            <div className="flex flex-wrap items-center gap-3 md:gap-6">
              <h2
                style={appleFont}
                className="text-xl md:text-4xl lg:text-5xl font-bold text-white"
              >
                Rating Board
              </h2>

              <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800 px-2 md:px-4 py-1.5 md:py-2 rounded">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={12}
                      className="md:w-4 md:h-4"
                      fill={
                        star <= Math.round(parseFloat(avgRating))
                          ? "#ef4444"
                          : "transparent"
                      }
                      stroke={
                        star <= Math.round(parseFloat(avgRating))
                          ? "#ef4444"
                          : "#3f3f46"
                      }
                      strokeWidth={1.5}
                    />
                  ))}
                </div>
                <span style={pixelFont} className="text-xs md:text-base">
                  <span className="text-red-500">{avgRating}</span>
                  <span className="text-zinc-600">/5</span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 md:gap-4 mt-2 md:mt-4">
              <div className="flex items-center gap-1.5 md:gap-2 text-zinc-500">
                <Users size={12} className="md:w-[14px] md:h-[14px]" />
                <span style={pixelFont} className="text-[7px] md:text-[10px]">
                  {pastedCards.length} TOTAL
                </span>
              </div>
              <div className="flex items-center gap-1.5 md:gap-2 text-zinc-500">
                <Star
                  size={12}
                  className="md:w-[14px] md:h-[14px] text-red-500"
                  fill="#ef4444"
                />
                <span style={pixelFont} className="text-[7px] md:text-[10px]">
                  {ratedCards.length} RATED
                </span>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={28} className="animate-spin text-red-500 mb-4" />
              <p style={pixelFont} className="text-[9px] text-zinc-500">
                Loading...
              </p>
            </div>
          )}

          {/* Grid Layout for Pasted Cards */}
          {!loading && (
            <>
              {pastedCards.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[40vh] py-16 text-center">
                  <div className="text-4xl md:text-6xl mb-4 md:mb-6 opacity-30">
                    ⭐
                  </div>
                  <h3
                    style={appleFont}
                    className="text-lg md:text-2xl text-zinc-400 mb-1 md:mb-2"
                  >
                    No ratings yet
                  </h3>
                  <p
                    style={pixelFont}
                    className="text-[7px] md:text-[10px] text-zinc-600"
                  >
                    {isMobile
                      ? "Tap ADD to rate"
                      : "> Click the button to add your rating"}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4 pb-20">
                  {pastedCards.map((card, index) => (
                    <RatingCard
                      key={card.id}
                      card={card}
                      onUpdate={updateCard}
                      onDelete={deleteCard}
                      isMobileGrid={true}
                      mobileIndex={index}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Button - Floating */}
      <button
        onClick={addCard}
        className="fixed bottom-6 right-4 md:bottom-8 md:right-6 z-[999] flex items-center gap-1.5 md:gap-2 px-3 py-2.5 md:px-4 md:py-3 bg-red-600 hover:bg-red-500 text-white transition-all hover:scale-105 group border border-red-500 shadow-lg shadow-red-500/30 rounded-sm"
        style={pixelFont}
      >
        <Plus
          size={18}
          className="md:w-[20px] md:h-[20px] group-hover:rotate-90 transition-transform"
        />
        <span className="text-[8px] md:text-[10px]">ADD</span>
      </button>

      {/* Floating cards - only unpasted cards float */}
      {cards
        .filter((c) => !c.pasted)
        .map((card) => (
          <RatingCard
            key={card.id}
            card={card}
            onUpdate={updateCard}
            onDelete={deleteCard}
            isMobileGrid={false}
          />
        ))}
    </div>
  );
}
