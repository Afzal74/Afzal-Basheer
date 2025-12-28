# 🎮 AFZAL BASHEER - Portfolio Documentation

## Complete System Design, Architecture & Technical Overview

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack & Dependencies](#2-tech-stack--dependencies)
3. [Project Architecture](#3-project-architecture)
4. [File Structure](#4-file-structure)
5. [Page-by-Page Breakdown](#5-page-by-page-breakdown)
6. [Component Deep Dive](#6-component-deep-dive)
7. [GSAP Animations - Complete Guide](#7-gsap-animations---complete-guide)
8. [Sound Effects System](#8-sound-effects-system)
9. [Audio System Architecture](#9-audio-system-architecture)
10. [Database Integration (Supabase)](#10-database-integration-supabase)
11. [AI Integration (Gemini)](#11-ai-integration-gemini)
12. [Email Integration (EmailJS)](#12-email-integration-emailjs)
13. [Styling System](#13-styling-system)
14. [Interactive Features](#14-interactive-features)
15. [Performance Optimizations](#15-performance-optimizations)
16. [Responsive Design](#16-responsive-design)
17. [State Management](#17-state-management)
18. [Security Features](#18-security-features)

---

## 1. Project Overview

### 🎯 What is this Portfolio?

This is a **gaming-inspired, interactive portfolio website** for Afzal Basheer - a Web Developer & AI Engineer. The portfolio features:

- **Wanted Poster Theme**: A unique "bounty hunter" aesthetic with interactive elements
- **Retro Gaming UI**: Pixel fonts, terminal-style animations, and arcade-like interactions
- **High-Fidelity Animations**: Extensive use of GSAP for smooth, professional animations
- **Sound Design**: Complete audio feedback system for all interactions
- **Mini-Games**: Built-in Flappy Bird game with leaderboard
- **AI Chat Assistant**: Gemini-powered terminal chat
- **Rating System**: Interactive sticky-note rating board with Supabase backend

### 🎨 Design Philosophy

```
"Creative engineer specializing in high-fidelity interaction 
and gaming-inspired motion systems. Bridging the gap between 
code and emotion."
```

The portfolio embodies this philosophy through:
- **Immersive Experience**: Every interaction has visual and audio feedback
- **Gamification**: Bounty system, achievements, leaderboards
- **Retro-Modern Fusion**: Pixel art meets modern web design
- **Emotional Connection**: Sound effects and animations create memorable experiences

---

## 2. Tech Stack & Dependencies

### Core Framework
```json
{
  "next": "^15.1.0",      // React Framework with App Router
  "react": "^19.2.0",     // UI Library
  "react-dom": "^19.2.0"  // React DOM
}
```

### Animation & UI
```json
{
  "gsap": "^3.12.2",           // GreenSock Animation Platform
  "lucide-react": "^0.562.0"   // Icon Library
}
```

### Backend & Services
```json
{
  "@supabase/supabase-js": "^2.89.0",  // Database & Auth
  "@google/generative-ai": "^0.24.1",   // Gemini AI
  "@emailjs/browser": "^4.4.1",         // Email Service
  "resend": "^6.6.0"                    // Email API
}
```

### Styling
```json
{
  "tailwindcss": "^4.1.18",           // Utility-first CSS
  "@tailwindcss/postcss": "^4.1.18",  // PostCSS Integration
  "postcss": "^8.5.6"                 // CSS Processing
}
```

### Fonts Used
1. **Press Start 2P** - Retro pixel font for gaming aesthetic
2. **Caveat** - Handwritten font for sticky notes
3. **SF Pro Display / Inter** - Modern Apple-style font for readability

```javascript
// Font definitions used throughout
const pixelFont = { fontFamily: '"Press Start 2P", cursive' };
const appleFont = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Inter", sans-serif',
};
```

---

## 3. Project Architecture

### System Design Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        NEXT.JS APP ROUTER                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   app/       │  │  components/ │  │   lib/       │          │
│  │   page.jsx   │  │  Hero.jsx    │  │  supabase.js │          │
│  │   layout.jsx │  │  Projects.jsx│  └──────────────┘          │
│  │   globals.css│  │  etc...      │                             │
│  └──────────────┘  └──────────────┘                             │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                      CONTEXT PROVIDERS                           │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  AudioProvider - Global audio state management            │   │
│  │  - Background music control                               │   │
│  │  - Session persistence                                    │   │
│  └──────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│                      EXTERNAL SERVICES                           │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐               │
│  │  Supabase  │  │  Gemini AI │  │  EmailJS   │               │
│  │  Database  │  │  Chat Bot  │  │  Contact   │               │
│  └────────────┘  └────────────┘  └────────────┘               │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Interaction
       │
       ▼
┌──────────────┐
│ Sound Effect │ ──► playSound() ──► Audio CDN
└──────────────┘
       │
       ▼
┌──────────────┐
│ GSAP Animate │ ──► Timeline/Tween ──► DOM Update
└──────────────┘
       │
       ▼
┌──────────────┐
│ State Update │ ──► React State ──► Re-render
└──────────────┘
       │
       ▼
┌──────────────┐
│ Persistence  │ ──► Supabase/localStorage
└──────────────┘
```

---

## 4. File Structure

```
afzal-portfolio/
│
├── app/                          # Next.js App Router
│   ├── page.jsx                  # Home page (main entry)
│   ├── layout.jsx                # Root layout with providers
│   ├── globals.css               # Global styles & animations
│   ├── projects/
│   │   └── page.jsx              # Projects page wrapper
│   ├── achievements/
│   │   └── page.jsx              # Achievements page wrapper
│   ├── ratings/
│   │   └── page.jsx              # Rating board page
│   └── api/                      # API routes (if any)
│
├── components/                   # React Components
│   ├── Hero.jsx                  # Main hero section (1154 lines!)
│   ├── Projects.jsx              # Full projects page component
│   ├── HomeProjects.jsx          # Mobile-only projects preview
│   ├── Achievements.jsx          # Achievements showcase
│   ├── FlappyBird.jsx            # Mini-game component
│   ├── GeminiChat.jsx            # AI terminal chat
│   ├── RatingBoard.jsx           # Rating system container
│   ├── RatingCard.jsx            # Individual rating card
│   ├── LogoShowcase.jsx          # Tech stack marquee
│   ├── BreakingNews.jsx          # News ticker component
│   ├── AudioProvider.jsx         # Audio context provider
│   ├── MusicButton.jsx           # Floating music toggle
│   ├── SoundLink.jsx             # Link with sound effect
│   ├── TitleHeader.jsx           # Reusable header component
│   └── useSoundEffects.js        # Sound effects utility
│
├── constants/
│   └── index.js                  # Logo icons list
│
├── lib/
│   └── supabase.js               # Supabase client setup
│
├── public/
│   ├── Achievements/             # Achievement images
│   ├── actual image/             # Profile images
│   ├── Flappy bird/              # Game assets
│   ├── gamified learning platform/
│   ├── quizverse/
│   ├── vtu vault/
│   ├── Resume/
│   ├── Battle Cries of the Lost.mp3  # Background music
│   └── do-not-redeem-the-card-made-with-Voicemod.mp3
│
├── .env.local                    # Environment variables
├── package.json                  # Dependencies
├── next.config.js                # Next.js configuration
├── postcss.config.js             # PostCSS configuration
└── jsconfig.json                 # JS path aliases
```

---

## 5. Page-by-Page Breakdown

### 5.1 Home Page (`app/page.jsx`)

The main landing page orchestrates multiple components and features:

#### Components Rendered:
1. **Hero** - Main hero section with wanted poster
2. **GeminiChat** - AI terminal (floating)
3. **LogoShowcase** - Tech stack marquee
4. **HomeProjects** - Mobile-only projects preview
5. **Mobile Achievements** - Achievement cards for mobile

#### Key Features:

```javascript
// Splash screen logic - locks scroll during intro
useEffect(() => {
  const hasAnimated = sessionStorage.getItem("heroAnimated");
  if (hasAnimated) {
    setSplashComplete(true);
  } else {
    document.body.style.overflow = 'hidden';
    const timer = setTimeout(() => {
      setSplashComplete(true);
      document.body.style.overflow = 'auto';
      // Reveal content with GSAP
      gsap.fromTo(contentRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }, 4000);
  }
}, []);
```

#### Mobile Achievements Section:
- Only visible on mobile (`block md:hidden`)
- Carousel auto-rotation every 2.5 seconds
- Click-to-reveal color images (grayscale by default)
- Animated red border effect

---

### 5.2 Projects Page (`app/projects/page.jsx`)

Wrapper page that renders the `Projects` component with metadata.

```javascript
export const metadata = {
  title: 'Projects | Afzal Basheer',
  description: 'Mission Archive - My project portfolio'
}
```

### 5.3 Achievements Page (`app/achievements/page.jsx`)

Wrapper for the `Achievements` component.

### 5.4 Ratings Page (`app/ratings/page.jsx`)

Full-featured rating board with:
- Supabase integration for persistence
- Grid layout for pasted cards
- Floating cards for unpasted ratings
- Real-time average rating calculation
- Mobile-responsive design

---

## 6. Component Deep Dive

### 6.1 Hero Component (`components/Hero.jsx`) - 1154 Lines!

The Hero is the **heart of the portfolio** - a massive component handling:

#### State Management:
```javascript
const [bounty, setBounty] = useState(0);           // Current bounty amount
const [isShattered, setIsShattered] = useState(false);  // Glass break state
const [isCaptured, setIsCaptured] = useState(false);    // Win state at $1M
const [bountyPopups, setBountyPopups] = useState([]);   // Floating +$125K
const [imgUrl, setImgUrl] = useState("/actual image/code sus.jpg");
const [neutralizedPosters, setNeutralizedPosters] = useState([]);
const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });
const [holes, setHoles] = useState([]);            // Bullet holes
const [formState, setFormState] = useState({...}); // Contact form
const [showFlappyGame, setShowFlappyGame] = useState(false);
```

#### Key Features:

**1. Wanted Poster Interactive System:**
- Click to "shoot" the poster
- Glass shatters with GSAP animation
- Image changes randomly
- Bounty increases by $125,000 per click
- At $1,000,000 - "CAPTURED" state triggers

**2. Name Character Animation:**
```javascript
// Each letter is individually animated
const SplitText = ({ text, className, charClassName }) => (
  <span className={className}>
    {text.split("").map((char, i) => (
      <span key={i} className={`${charClassName} inline-block`}>
        {char}
      </span>
    ))}
  </span>
);
```

**3. Role Text Rotation:**
```javascript
const roles = ["Web Developer", "AI Engineer", "Designer", "Vibe"];
// Rotates every 2.5 seconds with slide animation
```

**4. Contact Form with EmailJS:**
```javascript
const EMAILJS_SERVICE_ID = "service_ivn6f7t";
const EMAILJS_TEMPLATE_ID = "template_eqr46z2";
const EMAILJS_PUBLIC_KEY = "UQZ_lKGW2Ghjw5Gnc";
```


---

### 6.2 FlappyBird Component (`components/FlappyBird.jsx`)

A fully functional Flappy Bird clone with:

#### Game States:
```javascript
const [gameState, setGameState] = useState("username"); 
// States: username, ready, countdown, playing, gameover
```

#### Game Physics:
```javascript
const gameRef = useRef({
  bird: { x: 60, y: 130, velocity: 0, width: 35, height: 35 },
  pipes: [],
  gravity: 0.35,      // Downward pull
  jump: -6.5,         // Upward velocity on flap
  pipeGap: 160,       // Space between pipes
  pipeWidth: 45,
  pipeSpeed: 2,       // Horizontal movement speed
  frameId: null,
});
```

#### Features:
- Username input with localStorage persistence
- 3-2-1 countdown before game starts
- Canvas-based rendering with grid background
- Collision detection for pipes and boundaries
- Score tracking with high score persistence
- Supabase leaderboard integration (top 5 scores)
- Sound effects for flap, score, and hit

#### Leaderboard System:
```javascript
const submitScore = async (finalScore) => {
  // Check if user exists
  const { data: existing } = await supabase
    .from("flappy_scores")
    .select("id, score")
    .eq("username", username)
    .single();

  if (existing && finalScore > existing.score) {
    // Update if new high score
    await supabase.from("flappy_scores")
      .update({ score: finalScore })
      .eq("id", existing.id);
  } else if (!existing) {
    // Insert new record
    await supabase.from("flappy_scores").insert({
      username, score: finalScore
    });
  }
};
```

---

### 6.3 GeminiChat Component (`components/GeminiChat.jsx`)

A terminal-style AI chat interface.

#### Available Commands:
```javascript
const commands = {
  "/help": "Available commands:",
  "/projects": "PROJECTS",      // Navigate to projects
  "/achievements": "ACHIEVEMENTS",
  "/rateme": "RATEME",          // Navigate to ratings
  "/contact": "Email: appuafzal777@gmail.com | GitHub: Afzal74",
  "/skills": "React, Next.js, Tailwind, AI/ML, GSAP, TypeScript",
  "/about": "Afzal - Web Dev & AI Engineer building cool stuff!",
  "/clear": "CLEAR",
};
```

#### Letter-by-Letter Typing Effect:
```javascript
const typeLine = useCallback(async (text, type = "system") => {
  setIsTyping(true);
  setCurrentTypingText("");

  for (let i = 0; i <= text.length; i++) {
    await new Promise((r) => setTimeout(r, 25)); // 25ms per character
    setCurrentTypingText(text.slice(0, i));
    if (i % 2 === 0) playSound("click", 0.05);   // Typing sound
  }

  setLines((prev) => [...prev, { type, text }]);
  setCurrentTypingText("");
  setIsTyping(false);
}, []);
```

#### AI Response Handler:
```javascript
const getAIResponse = async (userMessage) => {
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `You are a helpful AI assistant for Afzal's portfolio...
  Keep responses SHORT (2-3 sentences max). Be friendly and helpful.
  User: ${userMessage}`;

  const result = await model.generateContent(prompt);
  return result.response.text().slice(0, 200);
};
```

#### Mac-Style Terminal UI:
- Traffic light buttons (red/yellow/green)
- Animated red border
- Monospace font styling
- Command prompt with `$` prefix


---

### 6.4 RatingCard Component (`components/RatingCard.jsx`)

Interactive sticky-note style rating cards.

#### Features:
- **Draggable**: Mouse and touch support
- **Protected Zones**: Can't drag into header area
- **Color Selection**: 7 color options
- **Star Rating**: 1-5 stars with custom colors
- **Paste Function**: Locks card in place permanently
- **Delete Protection**: Password required to delete pasted cards

#### Protected Zones System:
```javascript
const PROTECTED_ZONES_MOBILE = [
  { x: 0, y: 0, width: 9999, height: 60 },   // Nav bar
  { x: 0, y: 60, width: 9999, height: 140 }, // Header
];

const isInProtectedZone = (x, y, cardWidth, cardHeight = 220) => {
  const zones = getProtectedZones();
  for (const zone of zones) {
    const overlapsX = x < zone.x + zone.width && x + cardWidth > zone.x;
    const overlapsY = y < zone.y + zone.height && y + cardHeight > zone.y;
    if (overlapsX && overlapsY) return true;
  }
  return false;
};
```

#### Animated Border (Pasted Cards):
```javascript
useEffect(() => {
  if (!isPasted) return;
  gsap.to(`.border-top-${card.id}`, { 
    left: "100%", duration: 3, repeat: -1, ease: "none" 
  });
  gsap.to(`.border-right-${card.id}`, { 
    top: "100%", duration: 3, repeat: -1, ease: "none", delay: 0.75 
  });
  // ... bottom and left borders with staggered delays
}, [isPasted]);
```

#### Delete Password Protection:
```javascript
const DELETE_PASSWORD = "AFZALAPPU";

const handlePasswordSubmit = () => {
  if (passwordInput === DELETE_PASSWORD) {
    playSound("click", 0.3);
    onDelete(card.id);
  } else {
    setPasswordError(true);
  }
};
```

---

### 6.5 LogoShowcase Component (`components/LogoShowcase.jsx`)

Infinite scrolling tech stack marquee.

#### Logo List (from constants/index.js):
```javascript
export const logoIconsList = [
  { name: 'React', imgPath: 'devicons/react/react-original.svg' },
  { name: 'Next.js', imgPath: 'devicons/nextjs/nextjs-original.svg' },
  { name: 'JavaScript', imgPath: 'devicons/javascript/...' },
  { name: 'TypeScript', imgPath: 'devicons/typescript/...' },
  { name: 'Tailwind CSS', imgPath: 'devicons/tailwindcss/...' },
  { name: 'Node.js', imgPath: 'devicons/nodejs/...' },
  { name: 'Git', imgPath: 'devicons/git/...' },
  { name: 'Figma', imgPath: 'devicons/figma/...' },
  { name: 'HTML5', imgPath: 'devicons/html5/...' },
  { name: 'CSS3', imgPath: 'devicons/css3/...' },
  { name: 'Python', imgPath: 'devicons/python/...' },
  { name: 'VS Code', imgPath: 'devicons/vscode/...' },
];
```

#### CSS Animation:
```css
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.marquee-box {
  display: flex;
  animation: marquee 25s linear infinite;
  width: max-content;
}

.marquee-item img {
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.marquee-item img:hover {
  filter: grayscale(0%);
  opacity: 1;
}
```


---

## 7. GSAP Animations - Complete Guide

### 7.1 GSAP Plugins Used

```javascript
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

// Register plugins (client-side only)
if (typeof window !== "undefined") {
  gsap.registerPlugin(TextPlugin);
}
```

### 7.2 Animation Categories

#### A. Entry Animations (Hero Section)

**Navigation Fade-In:**
```javascript
mainTl.fromTo(navRef.current,
  { y: -20, opacity: 0 },
  { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
);
```

**Terminal Typing Effect:**
```javascript
mainTl.to("#line-1", {
  duration: 0.5,
  text: "> SYNCING_NEURAL_LINK...",
  delay: 0.1,
  onStart: playTypingSound,
});
```

**Name Character Reveal:**
```javascript
mainTl.fromTo(".name-char",
  { opacity: 0, scale: 1.5, filter: "blur(10px)", y: 20 },
  { opacity: 1, scale: 1, filter: "blur(0px)", y: 0, 
    duration: 0.8, stagger: 0.04 }
);
```

**Role Text Rotation:**
```javascript
gsap.to(roleTextRef.current, {
  y: -15,
  opacity: 0,
  duration: 0.4,
  onComplete: () => {
    setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    gsap.fromTo(roleTextRef.current,
      { y: 15, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4 }
    );
  },
});
```

#### B. Hover Animations

**Name Shake Effect (on hover or music playing):**
```javascript
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
```

#### C. Interactive Animations

**Glass Shatter Effect (Wanted Poster):**
```javascript
// Glass shards scatter
gsap.to(".target-shard", {
  x: (i) => (i === 0 ? -80 : i === 1 ? 80 : i === 2 ? 40 : -40),
  y: (i) => (i === 0 ? -80 : i === 1 ? -40 : i === 2 ? 80 : 40),
  rotation: (i) => (i % 2 === 0 ? 180 : -180),
  scale: 0.1,
  opacity: 0,
  duration: 0.5,
  onComplete: () => {
    // Reassemble with elastic bounce
    gsap.to(".target-shard", {
      x: 0, y: 0, rotation: 0, scale: 1, opacity: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.6)",
    });
  },
});
```

**Capture Victory Animation:**
```javascript
gsap.to(auraRef.current, {
  background: "radial-gradient(circle, rgba(16, 185, 129, 0.4) 0%, rgba(0, 0, 0, 0) 70%)",
  duration: 1.5,
});

gsap.to(".target-shard", {
  rotation: 360,
  scale: 0.5,
  opacity: 0,
  duration: 0.8,
  stagger: 0.1,
});
```

#### D. Traveling Border Animation

Used throughout the portfolio for visual flair:

```javascript
// Creates a continuous light traveling around borders
gsap.to('.traveling-border', {
  left: '100%',
  duration: 2,
  repeat: -1,
  ease: 'none',
});
gsap.to('.traveling-border-right', {
  top: '100%',
  duration: 2,
  repeat: -1,
  ease: 'none',
  delay: 0.5,  // Staggered start
});
gsap.to('.traveling-border-bottom', {
  right: '100%',
  duration: 2,
  repeat: -1,
  ease: 'none',
  delay: 1,
});
gsap.to('.traveling-border-left', {
  bottom: '100%',
  duration: 2,
  repeat: -1,
  ease: 'none',
  delay: 1.5,
});
```

**CSS for Traveling Border:**
```jsx
<div className="absolute inset-0 pointer-events-none z-20">
  <div className="traveling-border absolute top-0 left-[-100%] w-full h-[3px] 
    bg-gradient-to-r from-transparent via-red-500 to-transparent 
    shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
  {/* ... right, bottom, left borders */}
</div>
```


#### E. Aura Breathing Animation

```javascript
gsap.to(auraRef.current, {
  scale: 1.1,
  opacity: 0.35,
  duration: 4,
  repeat: -1,
  yoyo: true,
  ease: "sine.inOut",
});
```

#### F. Error Shake Animation (Rating Cards)

```javascript
if (cardRef.current) {
  gsap.to(cardRef.current, {
    x: "+=5",
    duration: 0.05,
    repeat: 5,
    yoyo: true,
    ease: "power2.inOut",
    onComplete: () => gsap.set(cardRef.current, { x: 0 })
  });
}
```

#### G. News Ticker Animation (BreakingNews)

```javascript
useEffect(() => {
  const ticker = tickerRef.current;
  // Clone items for seamless loop
  ticker.innerHTML = items + items;
  const totalWidth = ticker.scrollWidth / 2;

  gsap.to(ticker, {
    x: -totalWidth,
    duration: 25,
    ease: "none",
    repeat: -1,
  });
}, []);
```

### 7.3 GSAP Easing Functions Used

| Easing | Usage |
|--------|-------|
| `power3.out` | Smooth deceleration for reveals |
| `power4.out` | Stronger deceleration for dramatic entries |
| `power2.inOut` | Symmetric for shake effects |
| `elastic.out(1, 0.6)` | Bouncy reassembly of glass shards |
| `sine.inOut` | Smooth breathing for aura |
| `back.out(1.7)` | Overshoot for button pop-ins |
| `none` | Linear for continuous loops |

### 7.4 Session-Based Animation Skipping

To prevent animations replaying on navigation:

```javascript
useLayoutEffect(() => {
  const hasAnimated = sessionStorage.getItem("heroAnimated");
  
  if (hasAnimated) {
    // Skip animations, just show everything immediately
    gsap.set(navRef.current, { opacity: 1, y: 0 });
    gsap.set(".name-char", { opacity: 1, scale: 1, filter: "blur(0px)", y: 0 });
    // ... set all elements to final state
    return;
  }

  // Run full animation sequence
  const ctx = gsap.context(() => {
    // ... animations
    sessionStorage.setItem("heroAnimated", "true");
  }, containerRef);

  return () => ctx.revert();
}, [mounted]);
```

---

## 8. Sound Effects System

### 8.1 Sound Effects Library (`components/useSoundEffects.js`)

```javascript
const fallbackSounds = {
  // UI Sounds
  hover: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3',
  click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3',
  navigate: 'https://assets.mixkit.co/active_storage/sfx/2570/2570-preview.mp3',
  select: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
  typing: 'https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3',
  
  // Game Sounds
  flap: 'https://assets.mixkit.co/active_storage/sfx/2073/2073-preview.mp3',
  score: 'https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3',
  hit: 'https://assets.mixkit.co/active_storage/sfx/2001/2001-preview.mp3',
  
  // Rating Sounds
  paste: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
  error: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3',
};
```

### 8.2 playSound Function

```javascript
export const playSound = (soundName, volume = 0.3) => {
  if (typeof window === 'undefined') return;
  
  try {
    const soundUrl = fallbackSounds[soundName];
    if (!soundUrl) return;

    const audio = new Audio(soundUrl);
    audio.volume = volume;
    audio.crossOrigin = 'anonymous';
    
    audio.play().catch(() => {
      // Silently fail - browser blocked autoplay or CORS issue
    });
  } catch (e) {
    // Silently fail
  }
};
```

### 8.3 Sound Preloading

```javascript
export const preloadSounds = () => {
  if (typeof window === 'undefined') return;
  
  Object.values(fallbackSounds).forEach((url) => {
    try {
      const audio = new Audio();
      audio.preload = 'auto';
      audio.crossOrigin = 'anonymous';
      audio.src = url;
    } catch (e) {
      // Silently fail
    }
  });
};
```

### 8.4 Sound Usage Throughout Portfolio

| Component | Sound | Trigger |
|-----------|-------|---------|
| Hero | `click` | Terminal typing, button clicks |
| Hero | `hover` | Name hover |
| Hero | `success` | Form submission |
| Navigation | `navigate` | Link clicks (SoundLink) |
| Projects | `select` | Project card hover/click |
| Achievements | `select` | Achievement card selection |
| FlappyBird | `flap` | Bird jump |
| FlappyBird | `score` | Passing pipe |
| FlappyBird | `hit` | Collision |
| GeminiChat | `click` | Typing effect |
| RatingCard | `select` | Star selection |
| RatingCard | `paste` | Card paste |
| RatingCard | `error` | Validation error |


### 8.5 Additional Sound Effects (Hero Component)

```javascript
// Gunshot and glass break for wanted poster
const handleSlash = () => {
  const gunshot = new Audio(
    "https://www.soundjay.com/mechanical/sounds/gun-gunshot-01.mp3"
  );
  const glassBreak = new Audio(
    "https://www.soundjay.com/misc/sounds/glass-break-1.mp3"
  );
  gunshot.volume = 0.3;
  glassBreak.volume = 0.4;
  gunshot.play();
  setTimeout(() => glassBreak.play(), 50);
};

// Victory sound at $1,000,000
const victorySound = new Audio(
  "https://cdn.pixabay.com/audio/2021/08/04/audio_0625c1539c.mp3"
);
victorySound.volume = 0.5;
victorySound.play();
```

---

## 9. Audio System Architecture

### 9.1 AudioProvider Context (`components/AudioProvider.jsx`)

Global audio state management for background music.

```javascript
const AudioContext = createContext(null);

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within AudioProvider');
  }
  return context;
};

export const AudioProvider = ({ children }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Restore audio state from session
    const wasPlaying = sessionStorage.getItem('audioPlaying') === 'true';
    if (wasPlaying && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      sessionStorage.setItem('audioPlaying', 'false');
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        sessionStorage.setItem('audioPlaying', 'true');
      }).catch(() => setIsPlaying(false));
    }
  };

  return (
    <AudioContext.Provider value={{ isPlaying, toggleAudio, audioRef }}>
      {mounted && (
        <audio
          ref={audioRef}
          src="/Battle Cries of the Lost.mp3"
          loop
          preload="none"
        />
      )}
      {children}
    </AudioContext.Provider>
  );
};
```

### 9.2 Layout Integration

```javascript
// app/layout.jsx
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AudioProvider>
          {children}
          <MusicButton />  {/* Floating music toggle */}
        </AudioProvider>
      </body>
    </html>
  );
}
```

### 9.3 Music Button Component

```javascript
const MusicButton = () => {
  const { isPlaying, toggleAudio } = useAudio();

  return (
    <button
      onClick={() => { playSound('click', 0.3); toggleAudio(); }}
      className="fixed bottom-6 right-6 z-50 p-3 md:p-4 rounded-full 
        bg-zinc-900/80 border border-zinc-800 hover:border-red-600"
    >
      {isPlaying ? (
        <Volume2 className="w-5 h-5 text-red-600 animate-pulse" />
      ) : (
        <Music className="w-5 h-5 text-zinc-500 hover:text-red-500" />
      )}
    </button>
  );
};
```

### 9.4 Audio-Reactive Name Animation

When music is playing, the name characters shake continuously:

```javascript
useEffect(() => {
  if (isPlaying) {
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
      gsap.to(".name-char", { x: 0, y: 0, rotation: 0, duration: 0.3 });
    }
  }
}, [isPlaying]);
```

---

## 10. Database Integration (Supabase)

### 10.1 Supabase Client Setup

```javascript
// lib/supabase.js
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
```

### 10.2 Database Tables

#### Flappy Bird Scores Table:
```sql
CREATE TABLE flappy_scores (
  id SERIAL PRIMARY KEY,
  username VARCHAR(12) NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Ratings Table:
```sql
CREATE TABLE ratings (
  id TEXT PRIMARY KEY,
  name VARCHAR(100),
  message VARCHAR(100),
  rating INTEGER DEFAULT 0,
  color VARCHAR(20) DEFAULT '#ef4444',
  width INTEGER DEFAULT 256,
  x FLOAT,
  y FLOAT,
  rotation FLOAT DEFAULT 0,
  date VARCHAR(50),
  time VARCHAR(20),
  pasted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```


### 10.3 Supabase Operations

#### Fetching Leaderboard:
```javascript
const fetchLeaderboard = async () => {
  const { data, error } = await supabase
    .from("flappy_scores")
    .select("username, score")
    .order("score", { ascending: false })
    .limit(5);
  
  if (!error && data) setLeaderboard(data);
};
```

#### Saving Rating:
```javascript
const { error } = await supabase.from("ratings").upsert({
  id: updatedCard.id,
  name: updatedCard.name,
  message: updatedCard.message,
  rating: updatedCard.rating,
  color: updatedCard.color,
  x: updatedCard.x,
  y: updatedCard.y,
  rotation: updatedCard.rotation,
  date: updatedCard.date,
  time: updatedCard.time,
  pasted: updatedCard.pasted,
  created_at: updatedCard.createdAt,
});
```

#### Loading Ratings:
```javascript
const { data, error } = await supabase
  .from("ratings")
  .select("*")
  .order("created_at", { ascending: false });
```

### 10.4 Fallback to localStorage

When Supabase is unavailable:

```javascript
if (!supabase) {
  const saved = localStorage.getItem("ratingCards");
  if (saved) setCards(JSON.parse(saved));
  return;
}
```

---

## 11. AI Integration (Gemini)

### 11.1 Gemini Setup

```javascript
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
```

### 11.2 AI Prompt Engineering

```javascript
const prompt = `You are a helpful AI assistant for Afzal's portfolio website.

About Afzal:
- Web Developer & AI Engineer
- Skills: React, Next.js, Tailwind CSS, GSAP, AI/ML, TypeScript
- Email: appuafzal777@gmail.com
- GitHub: Afzal74

Keep responses SHORT (2-3 sentences max). Be friendly and helpful.
User: ${userMessage}`;
```

### 11.3 Response Handling

```javascript
const getAIResponse = async (userMessage) => {
  try {
    const result = await model.generateContent(prompt);
    return result.response.text().slice(0, 200); // Limit response length
  } catch (error) {
    return "Sorry, I couldn't process that. Try /help for commands.";
  }
};
```

---

## 12. Email Integration (EmailJS)

### 12.1 Configuration

```javascript
const EMAILJS_SERVICE_ID = "service_ivn6f7t";
const EMAILJS_TEMPLATE_ID = "template_eqr46z2";
const EMAILJS_PUBLIC_KEY = "UQZ_lKGW2Ghjw5Gnc";
```

### 12.2 Form Submission

```javascript
import emailjs from "@emailjs/browser";

const handleFormSubmit = async (e) => {
  e.preventDefault();
  setIsSending(true);

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
      setFormStatus({ type: "success", message: "Message transmitted!" });
      setFormState({ name: "", email: "", message: "" });
    }
  } catch (error) {
    setFormStatus({ type: "error", message: "Transmission failed." });
  } finally {
    setIsSending(false);
  }
};
```

---

## 13. Styling System

### 13.1 Global CSS (`app/globals.css`)

```css
@import "tailwindcss";

/* Marquee Animation */
.marquee {
  overflow: hidden;
  position: relative;
}

.marquee-box {
  display: flex;
  animation: marquee 25s linear infinite;
  width: max-content;
}

@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

/* Grayscale hover effect */
.marquee-item img {
  height: 60px;
  filter: grayscale(100%);
  opacity: 0.6;
  transition: all 0.3s ease;
}

.marquee-item img:hover {
  filter: grayscale(0%);
  opacity: 1;
}

/* Gradient edges for marquee */
.gradient-edge {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  z-index: 10;
  pointer-events: none;
}

.gradient-edge:first-child {
  left: 0;
  background: linear-gradient(to right, #050505, transparent);
}

.gradient-edge:nth-child(2) {
  right: 0;
  background: linear-gradient(to left, #050505, transparent);
}

/* Hero badge */
.hero-badge {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  padding: 0.5rem 1.25rem;
  font-size: 0.875rem;
  color: #a1a1aa;
}
```


### 13.2 Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Background | `#050505` | Main dark background |
| Primary Red | `#ef4444` / `#dc2626` | Accents, borders, highlights |
| Dark Red | `#991b1b` | Borders, shadows |
| Zinc 900 | `#18181b` | Cards, containers |
| Zinc 800 | `#27272a` | Borders, dividers |
| Zinc 700 | `#3f3f46` | Muted elements |
| Zinc 600 | `#52525b` | Secondary text |
| Zinc 500 | `#71717a` | Tertiary text |
| Zinc 400 | `#a1a1aa` | Descriptions |
| White | `#ffffff` | Primary text |
| Yellow | `#fbbf24` | Highlights, scores |
| Green | `#22c55e` | Success states |
| Cyan | `#06b6d4` | AI responses |

### 13.3 Tailwind Custom Classes

```jsx
// Common patterns used throughout
className="bg-zinc-900/40"           // Semi-transparent background
className="border-l-4 border-red-600" // Left accent border
className="backdrop-blur-sm"          // Frosted glass effect
className="shadow-[0_0_15px_rgba(239,68,68,0.8)]" // Red glow
className="transition-all duration-300" // Smooth transitions
```

### 13.4 Sticky Note Styling (RatingCard)

```javascript
style={{
  background: "linear-gradient(135deg, #fef9e7 0%, #fdf6e3 50%, #f5f0dc 100%)",
  boxShadow: "3px 3px 10px rgba(0,0,0,0.3)",
}}

// Paper lines effect
{[...Array(10)].map((_, i) => (
  <div 
    key={i} 
    className="absolute w-full h-px bg-blue-400" 
    style={{ top: `${20 + i * 18}px` }} 
  />
))}

// Red margin line
<div className="absolute left-6 top-0 bottom-0 w-px bg-red-400 opacity-40" />

// Tape effect
<div style={{ 
  background: "linear-gradient(180deg, rgba(255,255,200,0.9) 0%, rgba(255,255,180,0.7) 100%)",
  transform: "translateX(-50%) rotate(-1deg)" 
}} />
```

---

## 14. Interactive Features

### 14.1 Wanted Poster Bounty System

**How it works:**
1. User clicks on the wanted poster image
2. Gunshot + glass break sounds play
3. Glass shards scatter with GSAP animation
4. Image changes to random meme image
5. Bounty increases by $125,000
6. Floating "+$125,000" popup appears
7. Old image becomes "neutralized" poster in background
8. At $875,000, final image (Afzal's real photo) appears
9. At $1,000,000, "CAPTURED" state triggers with victory sound

**Glass Shards Configuration:**
```javascript
const shards = [
  "polygon(0 0, 100% 0, 50% 50%, 0 50%)",      // Top-left
  "polygon(100% 0, 100% 100%, 50% 50%)",       // Right
  "polygon(100% 100%, 0 100%, 50% 50%)",       // Bottom
  "polygon(0 100%, 0 0, 50% 50%)",             // Left
];
```

### 14.2 Bullet Holes Effect

```javascript
const handleSlash = () => {
  const holeId = Date.now();
  setHoles((prev) => [...prev, { id: holeId, x: hoverPos.x, y: hoverPos.y }]);
  
  // Remove hole after animation
  setTimeout(() => {
    setHoles((prev) => prev.filter((h) => h.id !== holeId));
  }, 600);
};
```

### 14.3 Clickable Name Characters

Each letter in "AFZAL BASHEER" can be clicked to toggle red color:

```javascript
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
```

### 14.4 Image Grayscale Toggle

Project and achievement images are grayscale by default:

```jsx
className={`transition-all duration-1000 ${
  imageClicked 
    ? 'grayscale-0 brightness-100' 
    : 'grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100'
}`}
```

### 14.5 Draggable Rating Cards

```javascript
const handleMouseDown = (e) => {
  if (e.target.closest(".no-drag") || isPasted) return;
  setIsDragging(true);
  const rect = cardRef.current.getBoundingClientRect();
  setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
};

useEffect(() => {
  if (!isDragging) return;
  const handleMouseMove = (e) => {
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;
    if (!isInProtectedZone(newX, newY, cardWidth)) {
      onUpdate({ ...card, x: newX, y: newY });
    }
  };
  // ... event listeners
}, [isDragging]);
```

---

## 15. Performance Optimizations

### 15.1 Session-Based Animation Caching

Prevents re-running entry animations on navigation:

```javascript
const hasAnimated = sessionStorage.getItem("heroAnimated");
if (hasAnimated) {
  // Set final states immediately
  gsap.set(navRef.current, { opacity: 1, y: 0 });
  return;
}
// ... run animations
sessionStorage.setItem("heroAnimated", "true");
```

### 15.2 Sound Cooldown System

Prevents sound spam in games:

```javascript
const lastSoundTime = useRef(0);

const playGameSound = (soundName, volume = 0.3, cooldown = 100) => {
  const now = Date.now();
  if (now - lastSoundTime.current > cooldown) {
    playSound(soundName, volume);
    lastSoundTime.current = now;
  }
};
```


### 15.3 Lazy Audio Loading

```javascript
<audio
  ref={audioRef}
  src="/Battle Cries of the Lost.mp3"
  loop
  preload="none"  // Don't load until needed
/>
```

### 15.4 Image Carousel Optimization

```javascript
useEffect(() => {
  const currentProject = projects[activeIndex];
  if (!currentProject.carouselImages) return;

  const interval = setInterval(() => {
    setCarouselIndex((prev) => (prev + 1) % currentProject.carouselImages.length);
  }, 2500);

  return () => clearInterval(interval); // Cleanup on unmount
}, [activeIndex]);
```

### 15.5 GSAP Context Cleanup

```javascript
useLayoutEffect(() => {
  const ctx = gsap.context(() => {
    // ... animations
  }, containerRef);

  return () => ctx.revert(); // Cleanup all animations
}, [mounted]);
```

### 15.6 Conditional Rendering

```javascript
if (!mounted) return null; // Prevent hydration mismatch

// Or with placeholder
if (!mounted) {
  return <div className="opacity-0 h-12 md:h-32" />;
}
```

---

## 16. Responsive Design

### 16.1 Breakpoint Strategy

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Default | < 640px | Mobile |
| `sm:` | ≥ 640px | Small tablets |
| `md:` | ≥ 768px | Tablets |
| `lg:` | ≥ 1024px | Laptops |
| `xl:` | ≥ 1280px | Desktops |

### 16.2 Mobile-Specific Components

```jsx
// HomeProjects - Only visible on mobile
<section className="block md:hidden py-6">

// Desktop navigation item hidden on mobile
<SoundLink className="hidden md:block">Home</SoundLink>
```

### 16.3 Responsive Font Sizes

```jsx
// Pixel font scaling
className="text-[5px] md:text-[8px]"
className="text-[6px] md:text-[9px]"
className="text-[8px] md:text-[10px]"

// Apple font scaling
className="text-xs md:text-2xl"
className="text-xl md:text-4xl lg:text-5xl"

// Clamp for fluid typography
className="text-[clamp(0.55rem,1.2vw,1.2rem)]"
className="text-[clamp(0.75rem,4.5vw,4.5rem)]"
```

### 16.4 Responsive Spacing

```jsx
className="px-4 md:px-12 lg:px-24"
className="py-6 md:py-16"
className="gap-4 md:gap-12"
className="p-2 md:p-6"
```

### 16.5 Responsive Card Widths

```javascript
const getCardWidth = () => (
  typeof window !== "undefined" && window.innerWidth < 640 ? 160 : 200
);
```

### 16.6 Mobile Grid vs Desktop Float (Ratings)

```jsx
// Grid layout for pasted cards on all devices
<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
  {pastedCards.map((card) => (
    <RatingCard isMobileGrid={true} />
  ))}
</div>

// Floating cards for unpasted only
{cards.filter(c => !c.pasted).map((card) => (
  <RatingCard isMobileGrid={false} />
))}
```

---

## 17. State Management

### 17.1 Local Component State

Most state is managed locally with `useState`:

```javascript
const [activeIndex, setActiveIndex] = useState(0);
const [carouselIndex, setCarouselIndex] = useState(0);
const [mounted, setMounted] = useState(false);
const [imageClicked, setImageClicked] = useState(false);
```

### 17.2 Context API (Audio)

Global audio state via React Context:

```javascript
const AudioContext = createContext(null);

// Provider wraps entire app
<AudioProvider>
  {children}
</AudioProvider>

// Consumer hook
const { isPlaying, toggleAudio } = useAudio();
```

### 17.3 Session Storage

For persisting state across navigation:

```javascript
// Animation state
sessionStorage.setItem("heroAnimated", "true");
sessionStorage.getItem("heroAnimated");

// Audio state
sessionStorage.setItem('audioPlaying', 'true');
```

### 17.4 Local Storage

For persisting data across sessions:

```javascript
// High scores
localStorage.setItem("flappyHighScore", score.toString());
localStorage.getItem("flappyHighScore");

// Username
localStorage.setItem("flappyUsername", username);

// Fallback ratings storage
localStorage.setItem("ratingCards", JSON.stringify(cards));
```

### 17.5 Refs for Mutable Values

```javascript
const gameRef = useRef({
  bird: { x: 60, y: 130, velocity: 0 },
  pipes: [],
  frameId: null,
});

const shakeTl = useRef(null);  // GSAP timeline reference
const lastSoundTime = useRef(0);  // Sound cooldown
```

---

## 18. Security Features

### 18.1 Delete Password Protection

Rating cards require password to delete after pasting:

```javascript
const DELETE_PASSWORD = "AFZALAPPU";

const handlePasswordSubmit = () => {
  if (passwordInput === DELETE_PASSWORD) {
    onDelete(card.id);
  } else {
    setPasswordError(true);
  }
};
```

### 18.2 Environment Variables

Sensitive keys stored in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
```

### 18.3 Input Validation

```javascript
// Username length limit
onChange={(e) => setUsername(e.target.value.slice(0, 12))}
maxLength={12}

// Message length limit
onChange={(e) => {
  const val = e.target.value.slice(0, 100);
  setLocalMessage(val);
}}
maxLength={100}
```

### 18.4 Error Handling

```javascript
// Graceful Supabase failures
try {
  const { data, error } = await supabase.from("ratings").select("*");
  if (error) throw error;
} catch (error) {
  // Fallback to localStorage
  const saved = localStorage.getItem("ratingCards");
  if (saved) setCards(JSON.parse(saved));
}

// Silent audio failures
audio.play().catch(() => {
  // Browser blocked autoplay - silently fail
});
```


---

## 19. Complete Animation Timeline (Hero)

Here's the full animation sequence that plays on first visit:

```
TIME    ANIMATION
─────────────────────────────────────────────────────────
0.0s    Navigation slides down (y: -20 → 0, opacity: 0 → 1)
0.5s    Nav items fade in (stagger: 0.1s each)
0.6s    Terminal line 1 types: "> SYNCING_NEURAL_LINK..."
1.2s    Terminal line 2 types: "> CALIBRATING_MOTION..."
1.9s    Terminal line 3 types: "> TARGET_LOCKED: AFZAL"
2.1s    "I am a" characters fade in (stagger: 0.03s)
2.3s    "AFZAL BASHEER" letters reveal (blur → clear, scale: 1.5 → 1)
2.6s    Music button pops in (scale: 0.5 → 1, elastic)
2.8s    Role text slides in ("Web Developer")
3.0s    Description border fades in
3.2s    Description words fade in (stagger: 0.05s)
3.4s    Social links fade in
3.5s    Wanted poster scales in
3.7s    Target box appears
3.9s    Glass shards assemble (rotation: 15 → 0)
4.0s    Content below hero fades in
4.0s+   Continuous animations start:
        - Traveling border loops (2s per side)
        - Aura breathing (4s cycle)
        - Role text rotation (every 2.5s)
```

---

## 20. Project Data Structures

### 20.1 Projects Array

```javascript
const projects = [
  {
    id: 'M-01',
    title: 'Gamified Learning Platform',
    tech: ['React.js', 'Node.js', 'MongoDB', 'Supabase', 'Tailwind CSS'],
    desc: 'A gamified web platform designed to improve learning outcomes...',
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    carouselImages: [
      '/gamified learning platform/Home.jpg',
      '/gamified learning platform/Live class.jpg',
      '/gamified learning platform/Realtime quiz.jpg',
      '/gamified learning platform/Student Pov.png'
    ],
    link: 'https://ignite-vidya.vercel.app'
  },
  // ... more projects
];
```

### 20.2 Achievements Array

```javascript
const achievements = [
  {
    id: 'ACH-01',
    title: 'CodeCircuit Hackathon Finalist',
    year: '2024',
    tags: ['Top 50', 'Outlier.ai'],
    desc: 'Selected in the top 50 out of 5,000+ participants...',
    img: 'https://images.unsplash.com/...',
    carouselImages: ['/Achievements/codecircuit/CodeCircuit.jpg'],
    stat: 'Top 50/5K+'
  },
  // ... more achievements
];
```

### 20.3 Rating Card Structure

```javascript
const newCard = {
  id: Date.now().toString(),
  name: "",
  message: "",
  rating: 0,
  color: "#ef4444",
  width: 200,
  x: Math.random() * (window.innerWidth - 300) + 50,
  y: Math.random() * (window.innerHeight - 400) + 100,
  rotation: Math.random() * 4 - 2,
  date: "Sat, Dec 28, 2024",
  time: "10:30 AM",
  pasted: false,
  createdAt: new Date().toISOString()
};
```

---

## 21. Icon Usage (Lucide React)

```javascript
import {
  Music,           // Music toggle
  Volume2,         // Playing state
  Trophy,          // Achievements
  ArrowRight,      // Navigation arrows
  ArrowLeft,       // Back navigation
  ShieldCheck,     // Mission brief
  ExternalLink,    // External links
  Terminal,        // Section headers
  Medal,           // Achievement unlocked
  Award,           // Stat badges
  Plus,            // Add button
  Star,            // Ratings
  X,               // Close buttons
  GripVertical,    // Drag handle
  Check,           // Paste button
  Trash2,          // Delete button
  Users,           // User count
  Loader2,         // Loading spinner
  Zap,             // Breaking news
} from "lucide-react";
```

---

## 22. Key CSS Animations Summary

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| Marquee scroll | 25s | linear | Logo showcase |
| Traveling border | 2-3s | none | Red border effect |
| Aura breathing | 4s | sine.inOut | Background glow |
| Role rotation | 0.4s | default | Text swap |
| Glass shatter | 0.5s | default | Poster click |
| Glass reassemble | 0.8s | elastic.out | After shatter |
| Name shake | 0.08s | none | Hover/music |
| Error shake | 0.05s × 5 | power2.inOut | Validation |
| Fade in | 0.8-1s | power3.out | Entry animations |
| Slide in | 0.6-0.8s | power4.out | Cards, elements |

---

## 23. Environment Setup

### Required Environment Variables:

```env
# .env.local

# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Gemini AI (Chat)
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key

# EmailJS is configured directly in code (public keys)
```

### Running the Project:

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 24. Summary

This portfolio is a **masterclass in interactive web design**, featuring:

✅ **1154+ lines** of Hero component alone  
✅ **12+ sound effects** for immersive feedback  
✅ **20+ GSAP animations** for smooth motion  
✅ **Full Flappy Bird game** with leaderboard  
✅ **AI-powered terminal** chat  
✅ **Draggable rating cards** with persistence  
✅ **Responsive design** for all devices  
✅ **Session-based** animation caching  
✅ **Supabase integration** for data persistence  
✅ **EmailJS** for contact form  
✅ **Gemini AI** for intelligent responses  

The portfolio successfully bridges **code and emotion** through thoughtful animation, sound design, and gamification - exactly as its tagline promises.

---

*Documentation generated for Afzal Basheer's Portfolio*  
*Last updated: December 2024*
