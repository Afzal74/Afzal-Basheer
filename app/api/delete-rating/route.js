import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { id, userId } = await request.json();

    if (!id || !userId || !supabase) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400 }
      );
    }

    // Check if rating exists and verify ownership
    try {
      const { data: rating, error: queryError } = await supabase
        .from("ratings")
        .select("id, pasted, user_id")
        .eq("id", id)
        .single();

      // If rating exists, verify the user owns it
      if (rating) {
        // Allow deletion only if:
        // 1. User owns the rating (user_id matches)
        // 2. OR rating is unpasted (draft)
        if (rating.pasted && rating.user_id !== userId) {
          return new Response(
            JSON.stringify({ error: "Cannot delete someone else's rating" }),
            { status: 403 }
          );
        }
      }
    } catch (err) {
      // If we can't find it, it's probably not in DB (unpasted card)
      // Allow deletion to proceed
    }

    // Delete the rating
    const { error } = await supabase.from("ratings").delete().eq("id", id);

    if (error) {
      return new Response(
        JSON.stringify({ error: "Failed to delete rating" }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete rating error:", error);
    return new Response(
      JSON.stringify({ error: "Server error" }),
      { status: 500 }
    );
  }
}
