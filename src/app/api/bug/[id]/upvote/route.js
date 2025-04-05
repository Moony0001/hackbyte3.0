export async function POST(req, { params }) {
    try {
        const { id } = params; // bug_id
        const body = await req.json();
        const { user_id } = body;

        // Prevent duplicate upvotes
        const { data: existing, error: checkError } = await supabase
            .from("bug_upvotes")
            .select("*")
            .eq("bug_id", id)
            .eq("user_id", user_id)
            .single();

        if (existing) {
            return new Response(JSON.stringify({ message: "Already upvoted" }), { status: 409 });
        }

        // Insert into junction table
        const { error: insertError } = await supabase
            .from("bug_upvotes")
            .insert({ bug_id: id, user_id });

        if (insertError) {
            return new Response(JSON.stringify({ error: "Failed to record upvote" }), { status: 500 });
        }

        // Increment bug upvotes count
        const { error: updateError } = await supabase
            .from("bugs")
            .update({ upvotes: supabase.rpc('increment', { x: 1 }) }) // or just manually increment with JS
            .eq("id", id);

        if (updateError) {
            return new Response(JSON.stringify({ error: "Failed to increment upvote count" }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Upvoted successfully" }), { status: 200 });

    } catch (err) {
        console.error("Upvote error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
