import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { username, score } = await request.json();

    // Validate inputs
    if (!username || typeof score !== "number") {
      return new Response(
        JSON.stringify({ error: "Invalid input" }),
        { status: 400 }
      );
    }

    // Validate score is reasonable (Flappy Bird max ~999)
    if (score < 0 || score > 999 || !Number.isInteger(score)) {
      return new Response(
        JSON.stringify({ error: "Invalid score" }),
        { status: 400 }
      );
    }

    // Validate username length
    if (username.length > 50 || username.length < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid username" }),
        { status: 400 }
      );
    }

    // Check if score is suspiciously high compared to existing scores
    if (supabase) {
      const { data: topScores } = await supabase
        .from("flappy_scores")
        .select("score")
        .order("score", { ascending: false })
        .limit(10);

      if (topScores && topScores.length > 0) {
        const avgTopScore =
          topScores.reduce((sum, s) => sum + s.score, 0) / topScores.length;
        // Flag if score is more than 5x the average (potential cheat)
        if (score > avgTopScore * 5) {
          return new Response(
            JSON.stringify({ error: "Score validation failed" }),
            { status: 400 }
          );
        }
      }
    }

    return new Response(
      JSON.stringify({ valid: true, score }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Score validation error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
