"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { supabase } from "@/lib/supabase";
import { playSound } from "./useSoundEffects";
import { initializeSecurityMeasures, validateScoreData } from "@/lib/security";

const FlappyBird = ({ onClose }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState("username"); // username, ready, countdown, playing, gameover
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [birdPos, setBirdPos] = useState({ x: 60, y: 130 });
  const [username, setUsername] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const gameRef = useRef({
    bird: { x: 60, y: 130, velocity: 0, width: 35, height: 35 },
    pipes: [],
    gravity: 0.35,
    jump: -6.5,
    pipeGap: 160,
    pipeWidth: 45,
    pipeSpeed: 2,
    frameId: null,
  });

  const lastSoundTime = useRef(0);

  const pixelFont = { fontFamily: '"Press Start 2P", cursive' };

  // Play sound with cooldown to prevent spam
  const playGameSound = (soundName, volume = 0.3, cooldown = 100) => {
    const now = Date.now();
    if (now - lastSoundTime.current > cooldown) {
      playSound(soundName, volume);
      lastSoundTime.current = now;
    }
  };

  // Load high score and leaderboard
  useEffect(() => {
    initializeSecurityMeasures();

    const saved = localStorage.getItem("flappyHighScore");
    if (saved) setHighScore(parseInt(saved));

    const savedUsername = localStorage.getItem("flappyUsername");
    if (savedUsername) {
      setUsername(savedUsername);
    }

    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from("flappy_scores")
        .select("username, score")
        .order("score", { ascending: false })
        .limit(5);

      if (!error && data) {
        setLeaderboard(data);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
    }
  };

  const submitScore = async (finalScore) => {
    if (!supabase || !username || isSubmitting) return;

    // Validate score before submission
    if (!validateScoreData(finalScore, { username })) {
      console.warn("Invalid score data detected");
      return;
    }

    setIsSubmitting(true);
    try {
      // Call server-side validation API
      const validationResponse = await fetch("/api/validate-score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, score: finalScore }),
      });

      if (!validationResponse.ok) {
        console.warn("Score validation failed on server");
        setIsSubmitting(false);
        return;
      }

      // Check if user already has a score
      const { data: existing } = await supabase
        .from("flappy_scores")
        .select("id, score")
        .eq("username", username)
        .single();

      if (existing) {
        // Only update if new score is higher
        if (finalScore > existing.score) {
          await supabase
            .from("flappy_scores")
            .update({ score: finalScore })
            .eq("id", existing.id);
        }
      } else {
        // Insert new record
        await supabase.from("flappy_scores").insert({
          username: username,
          score: finalScore,
        });
      }
      await fetchLeaderboard();
      console.log("Score submitted successfully:", finalScore);
    } catch (error) {
      console.error("Error submitting score:", error);
    }
    setIsSubmitting(false);
  };

  const resetGame = useCallback(() => {
    const game = gameRef.current;
    game.bird = { x: 60, y: 130, velocity: 0, width: 35, height: 35 };
    game.pipes = [];
    setBirdPos({ x: 60, y: 130 });
    setScore(0);
  }, []);

  const startGame = () => {
    if (!username.trim()) return;
    playSound("click", 0.4);
    localStorage.setItem("flappyUsername", username);
    setGameState("ready");
  };

  const jump = useCallback(() => {
    if (gameState === "ready") {
      playSound("click", 0.3);
      setCountdown(3);
      setGameState("countdown");
      resetGame();
    } else if (gameState === "playing") {
      playGameSound("flap", 0.4, 50);
      gameRef.current.bird.velocity = gameRef.current.jump;
    } else if (gameState === "gameover") {
      playSound("click", 0.3);
      setGameState("ready");
      resetGame();
    }
  }, [gameState, resetGame]);

  // Countdown timer
  useEffect(() => {
    if (gameState !== "countdown") return;

    if (countdown === 0) {
      setGameState("playing");
      return;
    }

    playSound("click", 0.3);
    const timer = setTimeout(() => {
      setCountdown((c) => c - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [gameState, countdown]);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        if (gameState === "username" || gameState === "countdown") return;
        jump();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [jump, gameState]);

  // Game loop
  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const game = gameRef.current;

    let lastPipeTime = 0;
    const pipeInterval = 2200;

    const gameLoop = (timestamp) => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#1a1a1a";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 30) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      game.bird.velocity += game.gravity;
      game.bird.y += game.bird.velocity;
      setBirdPos({ x: game.bird.x, y: game.bird.y });

      if (timestamp - lastPipeTime > pipeInterval) {
        const gapY = Math.random() * (canvas.height - game.pipeGap - 100) + 50;
        game.pipes.push({ x: canvas.width, gapY: gapY, passed: false });
        lastPipeTime = timestamp;
      }

      game.pipes = game.pipes.filter((pipe) => pipe.x + game.pipeWidth > 0);

      let gameOver = false;
      game.pipes.forEach((pipe) => {
        pipe.x -= game.pipeSpeed;

        // Top building (pipe)
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(pipe.x, 0, game.pipeWidth, pipe.gapY);
        ctx.strokeStyle = "#0f0f1a";
        ctx.lineWidth = 2;
        ctx.strokeRect(pipe.x, 0, game.pipeWidth, pipe.gapY);

        // Top building windows
        const windowSize = 8;
        const windowGap = 12;
        const windowMargin = 6;
        ctx.fillStyle = "#fbbf24";
        for (
          let wy = windowMargin;
          wy < pipe.gapY - windowSize;
          wy += windowGap
        ) {
          for (
            let wx = windowMargin;
            wx < game.pipeWidth - windowSize;
            wx += windowGap
          ) {
            // Randomly light some windows
            ctx.fillStyle = Math.random() > 0.3 ? "#fbbf24" : "#1f1f3a";
            ctx.fillRect(pipe.x + wx, wy, windowSize - 2, windowSize - 2);
          }
        }
        // Top building roof
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(pipe.x - 3, pipe.gapY - 8, game.pipeWidth + 6, 8);

        const bottomPipeY = pipe.gapY + game.pipeGap;
        // Bottom building (pipe)
        ctx.fillStyle = "#1a1a2e";
        ctx.fillRect(
          pipe.x,
          bottomPipeY,
          game.pipeWidth,
          canvas.height - bottomPipeY
        );
        ctx.strokeStyle = "#0f0f1a";
        ctx.strokeRect(
          pipe.x,
          bottomPipeY,
          game.pipeWidth,
          canvas.height - bottomPipeY
        );

        // Bottom building windows
        for (
          let wy = bottomPipeY + windowMargin + 8;
          wy < canvas.height - windowSize;
          wy += windowGap
        ) {
          for (
            let wx = windowMargin;
            wx < game.pipeWidth - windowSize;
            wx += windowGap
          ) {
            ctx.fillStyle = Math.random() > 0.3 ? "#fbbf24" : "#1f1f3a";
            ctx.fillRect(pipe.x + wx, wy, windowSize - 2, windowSize - 2);
          }
        }
        // Bottom building base
        ctx.fillStyle = "#dc2626";
        ctx.fillRect(pipe.x - 3, bottomPipeY, game.pipeWidth + 6, 8);

        const birdRight = game.bird.x + game.bird.width - 5;
        const birdBottom = game.bird.y + game.bird.height - 5;
        const birdLeft = game.bird.x + 5;
        const birdTop = game.bird.y + 5;

        if (
          birdRight > pipe.x &&
          birdLeft < pipe.x + game.pipeWidth &&
          (birdTop < pipe.gapY || birdBottom > bottomPipeY)
        ) {
          gameOver = true;
        }

        if (!pipe.passed && pipe.x + game.pipeWidth < game.bird.x) {
          pipe.passed = true;
          playGameSound("score", 0.5, 0);
          setScore((s) => {
            const newScore = s + 1;
            if (newScore > highScore) {
              setHighScore(newScore);
              localStorage.setItem("flappyHighScore", newScore.toString());
            }
            return newScore;
          });
        }
      });

      if (game.bird.y < 0 || game.bird.y + game.bird.height > canvas.height) {
        gameOver = true;
      }

      if (gameOver) {
        playGameSound("hit", 0.5, 0);
        const finalScore = game.pipes.filter((p) => p.passed).length;
        submitScore(finalScore > 0 ? finalScore : score);
        setGameState("gameover");
        setShowLeaderboard(true);
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 24px 'Press Start 2P', monospace";
      ctx.fillText(score.toString(), canvas.width / 2 - 10, 50);

      game.frameId = requestAnimationFrame(gameLoop);
    };

    game.frameId = requestAnimationFrame(gameLoop);

    return () => {
      if (game.frameId) cancelAnimationFrame(game.frameId);
    };
  }, [gameState, score, highScore]);

  // Draw ready/gameover/countdown screens
  useEffect(() => {
    if (gameState === "playing" || gameState === "username") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#1a1a1a";
    for (let i = 0; i < canvas.width; i += 30) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvas.height);
      ctx.stroke();
    }
    for (let i = 0; i < canvas.height; i += 30) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvas.width, i);
      ctx.stroke();
    }

    ctx.fillStyle = "#dc2626";
    ctx.font = "14px 'Press Start 2P', monospace";
    ctx.textAlign = "center";

    if (gameState === "countdown") {
      ctx.fillText("GET READY!", canvas.width / 2, 80);
      ctx.fillStyle = "#fff";
      ctx.font = "48px 'Press Start 2P', monospace";
      ctx.fillText(
        countdown.toString(),
        canvas.width / 2,
        canvas.height / 2 + 20
      );
    } else if (gameState === "ready") {
      ctx.fillText("FLAPPY BIRD", canvas.width / 2, 50);
      ctx.fillStyle = "#666";
      ctx.font = "8px 'Press Start 2P', monospace";
      ctx.fillText("CLICK OR SPACE", canvas.width / 2, canvas.height / 2 + 20);
      ctx.fillText("TO START", canvas.width / 2, canvas.height / 2 + 35);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(
        `PLAYER: ${username}`,
        canvas.width / 2,
        canvas.height / 2 + 60
      );
    } else if (gameState === "gameover") {
      ctx.fillText("GAME OVER", canvas.width / 2, 50);
      ctx.fillStyle = "#fff";
      ctx.font = "10px 'Press Start 2P', monospace";
      ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 + 15);
      ctx.fillStyle = "#fbbf24";
      ctx.fillText(
        `BEST: ${highScore}`,
        canvas.width / 2,
        canvas.height / 2 + 35
      );
      ctx.fillStyle = "#666";
      ctx.font = "7px 'Press Start 2P', monospace";
      ctx.fillText("CLICK TO RETRY", canvas.width / 2, canvas.height / 2 + 60);
    }
  }, [gameState, score, highScore, username, countdown]);

  // Animated red border
  useEffect(() => {
    gsap.to(".game-border-top", {
      left: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
    });
    gsap.to(".game-border-right", {
      top: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 0.5,
    });
    gsap.to(".game-border-bottom", {
      right: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 1,
    });
    gsap.to(".game-border-left", {
      bottom: "100%",
      duration: 2,
      repeat: -1,
      ease: "none",
      delay: 1.5,
    });
  }, []);

  const birdStyle =
    gameState === "playing"
      ? {
          left: `${(birdPos.x / 300) * 100}%`,
          top: `${(birdPos.y / 300) * 100}%`,
        }
      : { left: "50%", top: "45%", transform: "translate(-50%, -50%)" };

  // Username input screen
  if (gameState === "username") {
    return (
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm">
        <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-6 max-w-sm w-full mx-4">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-zinc-500 hover:text-red-500 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <div className="text-center mb-6">
            <img
              src="/Flappy bird/Bird.gif"
              alt="Flappy Bird"
              className="w-16 h-16 mx-auto mb-3"
            />
            <h3 style={pixelFont} className="text-red-500 text-sm">
              FLAPPY BIRD
            </h3>
          </div>

          <div className="space-y-4">
            <div>
              <label
                style={pixelFont}
                className="text-zinc-400 text-[8px] block mb-2"
              >
                ENTER YOUR NAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.slice(0, 12))}
                onKeyDown={(e) => e.key === "Enter" && startGame()}
                placeholder="Player"
                maxLength={12}
                className="w-full bg-black border border-zinc-700 rounded px-3 py-2 text-white text-sm focus:border-red-500 focus:outline-none"
                autoFocus
              />
            </div>

            <button
              onClick={startGame}
              disabled={!username.trim()}
              style={pixelFont}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white text-[10px] py-3 rounded transition-colors"
            >
              START GAME
            </button>

            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              style={pixelFont}
              className="w-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[8px] py-2 rounded transition-colors"
            >
              {showLeaderboard ? "HIDE" : "VIEW"} LEADERBOARD
            </button>

            {showLeaderboard && (
              <div className="bg-black border border-zinc-800 rounded p-3">
                <h4
                  style={pixelFont}
                  className="text-red-500 text-[8px] mb-3 text-center"
                >
                  TOP 5 SCORES
                </h4>
                {leaderboard.length > 0 ? (
                  <div className="space-y-2">
                    {leaderboard.map((entry, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <span
                          style={pixelFont}
                          className="text-[7px] text-zinc-400"
                        >
                          {i + 1}. {entry.username}
                        </span>
                        <span
                          style={pixelFont}
                          className="text-[8px] text-yellow-500"
                        >
                          {entry.score}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p
                    style={pixelFont}
                    className="text-zinc-600 text-[7px] text-center"
                  >
                    No scores yet!
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative bg-zinc-900 border border-zinc-800 rounded-lg p-4 max-w-sm w-full mx-4">
        {/* Red moving border on outer card */}
        <div className="absolute inset-0 pointer-events-none z-40 overflow-hidden rounded-lg">
          <div className="game-border-top absolute top-0 left-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          <div className="game-border-right absolute top-[-100%] right-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          <div className="game-border-bottom absolute bottom-0 right-[-100%] w-full h-[3px] bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
          <div className="game-border-left absolute bottom-[-100%] left-0 w-[3px] h-full bg-gradient-to-b from-transparent via-red-500 to-transparent shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-zinc-500 hover:text-red-500 transition-colors z-10"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="text-center mb-3">
          <div className="flex items-center justify-center gap-2">
            <img
              src="/Flappy bird/Bird.gif"
              alt="Flappy Bird"
              className="w-8 h-8"
            />
            <h3 style={pixelFont} className="text-red-500 text-xs">
              FLAPPY BIRD
            </h3>
          </div>
        </div>

        {/* Game canvas */}
        <div className="relative w-full aspect-square">
          <canvas
            ref={canvasRef}
            width={300}
            height={300}
            onClick={jump}
            className="w-full h-full rounded border border-zinc-700 cursor-pointer"
          />
          <img
            src="/Flappy bird/Bird.gif"
            alt="Bird"
            className="absolute w-[12%] h-[12%] object-contain pointer-events-none"
            style={birdStyle}
          />
        </div>

        <div className="flex justify-between items-center mt-3 px-2">
          <span style={pixelFont} className="text-zinc-500 text-[8px]">
            HIGH: {highScore}
          </span>
          <button
            onClick={() => setShowLeaderboard(!showLeaderboard)}
            style={pixelFont}
            className="text-[6px] text-zinc-400 hover:text-red-500 transition-colors"
          >
            🏆 LEADERBOARD
          </button>
        </div>

        {showLeaderboard && (
          <div className="mt-3 bg-black border border-zinc-800 rounded p-3">
            <h4
              style={pixelFont}
              className="text-red-500 text-[8px] mb-3 text-center"
            >
              TOP 5 SCORES
            </h4>
            {leaderboard.length > 0 ? (
              <div className="space-y-2">
                {leaderboard.map((entry, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <span
                      style={pixelFont}
                      className="text-[7px] text-zinc-400"
                    >
                      {i + 1}. {entry.username}
                    </span>
                    <span
                      style={pixelFont}
                      className="text-[8px] text-yellow-500"
                    >
                      {entry.score}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p
                style={pixelFont}
                className="text-zinc-600 text-[7px] text-center"
              >
                No scores yet!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlappyBird;
