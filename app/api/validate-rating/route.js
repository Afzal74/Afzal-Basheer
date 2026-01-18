import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { id, name, message, rating, color, pasted, isNewRating } = await request.json();

    // CRITICAL: Prevent duplicate submissions
    // Check if this rating ID already exists in the database
    if (pasted && id && supabase) {
      try {
        const { data: existing, error: queryError } = await supabase
          .from("ratings")
          .select("id, pasted, created_at")
          .eq("id", id)
          .single();

        // If rating already exists in DB, reject the submission
        if (existing) {
          return new Response(
            JSON.stringify({ error: "Rating already submitted" }),
            { status: 409 }
          );
        }
      } catch (err) {
        // 404 is expected for new ratings, other errors should be logged
        if (err.code !== "PGRST116") {
          console.warn("Database check error:", err);
        }
      }
    }

    // Validate rating
    if (!Number.isInteger(rating) || rating < 0 || rating > 5) {
      return new Response(
        JSON.stringify({ error: "Invalid rating" }),
        { status: 400 }
      );
    }

    // Validate name
    if (!name || name.length > 50 || name.length < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid name" }),
        { status: 400 }
      );
    }

    // Validate message
    if (!message || message.length > 500 || message.length < 1) {
      return new Response(
        JSON.stringify({ error: "Invalid message" }),
        { status: 400 }
      );
    }

    // Validate color format (hex)
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return new Response(
        JSON.stringify({ error: "Invalid color" }),
        { status: 400 }
      );
    }

    // Check for suspicious patterns (spam, injection attempts)
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /onclick/i,
      /onerror/i,
      /eval\(/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(name) || pattern.test(message)) {
        return new Response(
          JSON.stringify({ error: "Invalid content" }),
          { status: 400 }
        );
      }
    }

    return new Response(
      JSON.stringify({ valid: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Rating validation error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
