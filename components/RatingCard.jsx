"use client";

import { useState, useRef, useEffect } from "react";
import { Star, X, GripVertical, Check, Trash2 } from "lucide-react";
import { gsap } from "gsap";
import { playSound } from "./useSoundEffects";

// Add cursor blink animation
const cursorStyle = `
  @keyframes blink {
    0%, 49% { opacity: 1; }
    50%, 100% { opacity: 0; }
  }
  input.cursor-blink {
    caret-color: rgba(0, 0, 0, 0.8);
  }
  input.cursor-blink:focus {
    caret-color: rgba(0, 0, 0, 0.8);
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = cursorStyle;
  document.head.appendChild(style);
}

const COLORS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#3b82f6",
  "#8b5cf6",
  "#ec4899",
];

// Random anime avatar URLs - using DiceBear with proper format
const ANIME_AVATARS = [
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user1",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user2",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user3",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user4",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user5",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user6",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user7",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user8",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user9",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user10",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user11",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user12",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user13",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user14",
  "https://api.dicebear.com/8.x/avataaars/svg?seed=user15",
];

const DELETE_PASSWORD = "AFZALAPPU";

// Responsive card width
const getCardWidth = () =>
  typeof window !== "undefined" && window.innerWidth < 640 ? 160 : 200;

const PROTECTED_ZONES_MOBILE = [
  { x: 0, y: 0, width: 9999, height: 60 },
  { x: 0, y: 60, width: 9999, height: 140 },
];

const PROTECTED_ZONES_DESKTOP = [
  { x: 0, y: 0, width: 9999, height: 70 },
  { x: 0, y: 70, width: 9999, height: 170 },
];

const getProtectedZones = () =>
  typeof window !== "undefined" && window.innerWidth < 640
    ? PROTECTED_ZONES_MOBILE
    : PROTECTED_ZONES_DESKTOP;

const isInProtectedZone = (x, y, cardWidth, cardHeight = 220) => {
  const zones = getProtectedZones();
  for (const zone of zones) {
    const overlapsX = x < zone.x + zone.width && x + cardWidth > zone.x;
    const overlapsY = y < zone.y + zone.height && y + cardHeight > zone.y;
    if (overlapsX && overlapsY) return true;
  }
  return false;
};

export default function RatingCard({
  card,
  onUpdate,
  onDelete,
  isMobileGrid,
  mobileIndex,
}) {
  const cardRef = useRef(null);
  const borderRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [localName, setLocalName] = useState(card.name || "");
  const [localMessage, setLocalMessage] = useState(card.message || "");
  const [cardWidth, setCardWidth] = useState(200);
  const [isMobile, setIsMobile] = useState(false);
  const [userId, setUserId] = useState(null);
  const [nameFocused, setNameFocused] = useState(false);
  const [messageFocused, setMessageFocused] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(card.avatarUrl || null);

  const isPasted = card.pasted === true;
  const isOwnRating = userId && card.userId === userId;

  // Set responsive card width and detect mobile
  useEffect(() => {
    const updateWidth = () => {
      setCardWidth(getCardWidth());
      setIsMobile(window.innerWidth < 640);
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("ratingUserId");
    setUserId(id);
  }, []);

  useEffect(() => {
    setLocalName(card.name || "");
    setLocalMessage(card.message || "");

    // Load avatar from localStorage if it exists
    if (card.pasted && card.id) {
      const avatarMap = JSON.parse(
        localStorage.getItem("ratingAvatars") || "{}"
      );
      if (avatarMap[card.id]) {
        setAvatarUrl(avatarMap[card.id]);
      }
    }
  }, [card.id, card.pasted]);

  // Animated border for pasted cards - same as Projects
  useEffect(() => {
    if (!isPasted || !borderRef.current) return;
    const id = card.id;
    gsap.to(`.border-top-${id}`, {
      left: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
    });
    gsap.to(`.border-right-${id}`, {
      top: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 0.75,
    });
    gsap.to(`.border-bottom-${id}`, {
      right: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 1.5,
    });
    gsap.to(`.border-left-${id}`, {
      bottom: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
      delay: 2.25,
    });
  }, [isPasted, card.id]);

  const handleMouseDown = (e) => {
    if (e.target.closest(".no-drag") || isPasted || isMobileGrid) return;
    setIsDragging(true);
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  useEffect(() => {
    if (!isDragging || isPasted) return;
    const handleMouseMove = (e) => {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      if (!isInProtectedZone(newX, newY, cardWidth)) {
        onUpdate({ ...card, x: newX, y: newY });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, dragOffset, card, onUpdate, isPasted, cardWidth]);

  const handleTouchStart = (e) => {
    if (e.target.closest(".no-drag") || isPasted || isMobileGrid) return;
    const touch = e.touches[0];
    setIsDragging(true);
    const rect = cardRef.current.getBoundingClientRect();
    setDragOffset({
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    });
  };

  useEffect(() => {
    if (!isDragging || isPasted) return;
    const handleTouchMove = (e) => {
      const touch = e.touches[0];
      const newX = touch.clientX - dragOffset.x;
      const newY = touch.clientY - dragOffset.y;
      if (!isInProtectedZone(newX, newY, cardWidth)) {
        onUpdate({ ...card, x: newX, y: newY });
      }
    };
    const handleTouchEnd = () => setIsDragging(false);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);
    return () => {
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, dragOffset, card, onUpdate, isPasted, cardWidth]);

  const [ratingError, setRatingError] = useState(false);

  const handlePaste = () => {
    if (!localName.trim() || card.rating === 0) {
      playSound("error", 0.3);
      if (!localName.trim()) {
        setNameError(true);
        setTimeout(() => setNameError(false), 2000);
      }
      if (card.rating === 0) {
        setRatingError(true);
        setTimeout(() => setRatingError(false), 2000);
      }
      // Shake the card to indicate error
      if (cardRef.current) {
        gsap.to(cardRef.current, {
          x: "+=5",
          duration: 0.05,
          repeat: 5,
          yoyo: true,
          ease: "power2.inOut",
          onComplete: () => gsap.set(cardRef.current, { x: 0 }),
        });
      }
      return;
    }
    playSound("paste", 0.5);
    const randomAvatar =
      ANIME_AVATARS[Math.floor(Math.random() * ANIME_AVATARS.length)];
    setAvatarUrl(randomAvatar);

    // Save avatar to localStorage
    const avatarMap = JSON.parse(localStorage.getItem("ratingAvatars") || "{}");
    avatarMap[card.id] = randomAvatar;
    localStorage.setItem("ratingAvatars", JSON.stringify(avatarMap));

    onUpdate({ ...card, pasted: true, avatarUrl: randomAvatar });
  };

  const handleDeleteClick = () => {
    setShowDeletePrompt(true);
  };

  const handleConfirmDelete = () => {
    playSound("click", 0.3);
    onDelete(card.id);
  };

  const handleStarClick = (rating) => {
    if (isPasted) return;
    playSound("select", 0.3);
    onUpdate({ ...card, rating });
  };

  const handleColorChange = (color) => {
    if (isPasted) return;
    playSound("click", 0.2);
    onUpdate({ ...card, color });
  };

  // For mobile grid layout, use relative positioning
  const cardStyle = isMobileGrid
    ? { position: "relative", width: "100%" }
    : {
        position: "fixed",
        left: card.x,
        top: card.y,
        width: cardWidth,
        zIndex: isDragging ? 1000 : 100,
        transform: `rotate(${card.rotation || 0}deg)`,
      };

  return (
    <div
      ref={cardRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={cardStyle}
      className={`group relative ${
        isMobileGrid ? "" : isPasted ? "cursor-default" : "cursor-grab"
      } ${isDragging ? "cursor-grabbing" : ""}`}
    >
      {/* Animated red border - outside grayscale */}
      {isPasted && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          <div
            className={`border-top-${card.id} absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,1)]`}
          />
          <div
            className={`border-right-${card.id} absolute top-[-100%] right-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,1)]`}
          />
          <div
            className={`border-bottom-${card.id} absolute bottom-0 right-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,1)]`}
          />
          <div
            className={`border-left-${card.id} absolute bottom-[-100%] left-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,1)]`}
          />
        </div>
      )}
      <div
        ref={borderRef}
        className="relative bg-[#fef9e7] shadow-lg"
        style={{
          background:
            "linear-gradient(135deg, #fef9e7 0%, #fdf6e3 50%, #f5f0dc 100%)",
          boxShadow: "3px 3px 10px rgba(0,0,0,0.3)",
        }}
      >
        {/* Paper lines */}
        <div className="absolute inset-0 opacity-15 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-blue-400"
              style={{ top: `${20 + i * 18}px` }}
            />
          ))}
        </div>

        {/* Red margin */}
        <div className="absolute left-6 top-0 bottom-0 w-px bg-red-400 opacity-40" />

        {/* Tape */}
        <div
          className="absolute -top-2 left-1/2 -translate-x-1/2 w-12 h-4 opacity-50"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,200,0.9) 0%, rgba(255,255,180,0.7) 100%)",
            transform: "translateX(-50%) rotate(-1deg)",
          }}
        />

        {/* Header */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-amber-200/50">
          <GripVertical
            size={12}
            className={isPasted ? "text-gray-300" : "text-amber-600/50"}
          />
          {isPasted && isOwnRating && (
            <button
              onClick={handleDeleteClick}
              className="no-drag p-0.5 hover:bg-red-100 rounded"
            >
              <Trash2 size={12} className="text-red-400" />
            </button>
          )}
          {!isPasted && (
            <button
              onClick={() => onDelete(card.id)}
              className="no-drag p-0.5 hover:bg-red-100 rounded"
            >
              <X size={12} className="text-red-400" />
            </button>
          )}
        </div>

        {/* Delete prompt */}
        {showDeletePrompt && (
          <div className="absolute inset-0 bg-black/85 z-30 flex flex-col items-center justify-center p-3 rounded">
            <p className="text-white text-[10px] mb-3 text-center">
              Are you sure?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeletePrompt(false)}
                className="no-drag px-3 py-1.5 text-[10px] bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="no-drag px-3 py-1.5 text-[10px] bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div
          className="pl-8 pr-2 sm:pr-3 py-2 sm:py-3"
          onMouseDown={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 mb-1">
            {avatarUrl && isPasted && (
              <img
                src={avatarUrl}
                alt="avatar"
                className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border border-gray-300"
              />
            )}
            <input
              type="text"
              value={localName}
              onChange={(e) => {
                if (isPasted) return;
                setLocalName(e.target.value);
                setNameError(false);
                onUpdate({ ...card, name: e.target.value });
              }}
              onFocus={() => setNameFocused(true)}
              onBlur={() => setNameFocused(false)}
              placeholder={nameError ? "Name required!" : "Your name..."}
              readOnly={isPasted}
              className={`no-drag flex-1 bg-transparent border-none outline-none text-sm sm:text-base font-bold placeholder:font-normal cursor-text cursor-blink ${
                nameError
                  ? "text-red-500 placeholder:text-red-400"
                  : "text-gray-800 placeholder:text-gray-400"
              }`}
              style={{ fontFamily: "'Caveat', cursive" }}
            />
          </div>

          {localMessage || !isPasted ? (
            <input
              type="text"
              value={localMessage}
              onChange={(e) => {
                if (isPasted) return;
                const val = e.target.value.slice(0, 100);
                setLocalMessage(val);
                onUpdate({ ...card, message: val });
              }}
              onFocus={() => setMessageFocused(true)}
              onBlur={() => setMessageFocused(false)}
              placeholder="Message..."
              maxLength={100}
              readOnly={isPasted}
              className={`no-drag w-full bg-transparent border-none outline-none text-gray-700 text-[10px] sm:text-sm placeholder:text-gray-500 mt-0.5 cursor-text font-medium cursor-blink`}
              style={{ fontFamily: "'Caveat', cursive" }}
            />
          ) : (
            <div className="mt-0.5 h-5 sm:h-6" />
          )}

          {/* Stars */}
          <div
            className={`flex gap-0.5 my-1.5 sm:my-2 ${
              ratingError ? "animate-pulse" : ""
            }`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => {
                  handleStarClick(star);
                  setRatingError(false);
                }}
                disabled={isPasted}
                className={`no-drag ${
                  isPasted ? "" : "hover:scale-110"
                } transition-transform`}
              >
                <Star
                  size={14}
                  className="sm:w-[18px] sm:h-[18px]"
                  fill={star <= card.rating ? card.color : "transparent"}
                  stroke={
                    star <= card.rating
                      ? card.color
                      : ratingError
                      ? "#ef4444"
                      : "#d1d5db"
                  }
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>
          {ratingError && (
            <p
              className="text-red-500 text-[8px] -mt-1 mb-1"
              style={{ fontFamily: "'Caveat', cursive" }}
            >
              Please rate!
            </p>
          )}

          {/* Colors */}
          {!isPasted && (
            <div className="flex gap-1 sm:gap-1.5 mb-1.5 sm:mb-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(color)}
                  className={`no-drag w-3 h-3 sm:w-4 sm:h-4 rounded-full hover:scale-110 transition-transform ${
                    card.color === color
                      ? "ring-2 ring-offset-1 ring-gray-400"
                      : ""
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          )}

          {/* Paste button */}
          {!isPasted && (
            <button
              onClick={handlePaste}
              className="no-drag w-full py-1 sm:py-1.5 bg-green-500 hover:bg-green-600 text-white text-[10px] sm:text-xs font-medium rounded flex items-center justify-center gap-1 mb-1 sm:mb-1.5"
            >
              <Check size={10} className="sm:w-3 sm:h-3" /> Paste
            </button>
          )}

          {/* Date & Time */}
          <div
            className="text-[8px] sm:text-[10px] text-gray-500 pt-1 sm:pt-1.5 border-t border-amber-200/30"
            style={{ fontFamily: "'Caveat', cursive" }}
          >
            {card.date} • {card.time}
          </div>
        </div>
      </div>
    </div>
  );
}
