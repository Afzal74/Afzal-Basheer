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
      console.warn(`Invalid score attempt: ${score} by ${username}`);
      return new Response(
        JSON.stringify({ error: "Invalid score - out of range" }),
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
      try {
        const { data: topScores } = await supabase
          .from("flappy_scores")
          .select("score")
          .order("score", { ascending: false })
          .limit(10);

        if (topScores && topScores.length > 0) {
          const maxScore = Math.max(...topScores.map(s => s.score));
          
          // Only reject if score is IMPOSSIBLY high (more than 10x the max)
          // This allows legitimate high scores while blocking obvious cheats
          if (score > maxScore * 10 && maxScore > 0) {
            console.warn(`Impossible score: ${score} vs max ${maxScore} by ${username}`);
            return new Response(
              JSON.stringify({ error: "Score impossibly high" }),
              { status: 400 }
            );
          }
        }
      } catch (dbError) {
        console.error("Database error during validation:", dbError);
        // Continue with validation even if DB check fails
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
