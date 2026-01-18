import { supabase } from "@/lib/supabase";

export async function POST(request) {
  try {
    const { id } = await request.json();

    if (!id || !supabase) {
      return new Response(
        JSON.stringify({ error: "Invalid request" }),
        { status: 400 }
      );
    }

    // CRITICAL: Check if rating is pasted before allowing deletion
    try {
      const { data: rating, error: queryError } = await supabase
        .from("ratings")
        .select("id, pasted")
        .eq("id", id)
        .single();

      // If rating exists and is pasted, prevent deletion
      if (rating && rating.pasted) {
        return new Response(
          JSON.stringify({ error: "Cannot delete submitted ratings" }),
          { status: 403 }
        );
      }
    } catch (err) {
      // If we can't find it, it's probably not in DB (unpasted card)
      // Allow deletion to proceed
    }

    // Only delete unpasted cards from database
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
