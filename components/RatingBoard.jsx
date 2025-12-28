"use client";

import { useState, useEffect } from "react";
import { Plus, Star } from "lucide-react";
import RatingCard from "./RatingCard";

export default function RatingBoard() {
  const [cards, setCards] = useState([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load cards from localStorage initially (we'll add Supabase later)
    const saved = localStorage.getItem("ratingCards");
    if (saved) {
      setCards(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage whenever cards change
  useEffect(() => {
    if (mounted && cards.length > 0) {
      localStorage.setItem("ratingCards", JSON.stringify(cards));
    }
  }, [cards, mounted]);

  const addCard = () => {
    const now = new Date();
    const newCard = {
      id: Date.now().toString(),
      name: "",
      rating: 0,
      color: "#eab308",
      x: Math.random() * (window.innerWidth - 300) + 50,
      y: Math.random() * (window.innerHeight - 400) + 100,
      rotation: Math.random() * 6 - 3, // -3 to 3 degrees
      date: now.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      time: now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      createdAt: now.toISOString(),
    };
    setCards((prev) => [...prev, newCard]);
  };

  const updateCard = (updatedCard) => {
    setCards((prev) =>
      prev.map((card) => (card.id === updatedCard.id ? updatedCard : card))
    );
  };

  const deleteCard = (id) => {
    setCards((prev) => prev.filter((card) => card.id !== id));
    // Update localStorage
    const remaining = cards.filter((card) => card.id !== id);
    if (remaining.length === 0) {
      localStorage.removeItem("ratingCards");
    }
  };

  if (!mounted) return null;

  return (
    <>
      {/* Add button - fixed position */}
      <button
        onClick={addCard}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
      >
        <Plus
          size={20}
          className="group-hover:rotate-90 transition-transform"
        />
        <span className="font-medium">Add Rating</span>
        <Star size={16} fill="white" />
      </button>

      {/* Render all cards */}
      {cards.map((card) => (
        <RatingCard
          key={card.id}
          card={card}
          onUpdate={updateCard}
          onDelete={deleteCard}
        />
      ))}
    </>
  );
}
