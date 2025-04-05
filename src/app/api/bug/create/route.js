import { supabase } from "../../../config/db/supa.js";

//YOUR ML MODEL HERE?

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            project_name,
            description,
            title, // Editable RAG generated title
            priority, // ML generated priority (e.g., 'LOW', 'MEDIUM', 'HIGH')
            created_by, // user_id of the tester
            component = "not provided" // default value
        } = body;

        // 1. Get project_id using project_name
        const { data: project, error: projectError } = await supabase
            .from("projects")
            .select("id")
            .eq("name", project_name)
            .single();

        if (projectError || !project) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        const now = new Date().toISOString();


        //GET PRIORITY FROM ML MODEL

        // 2. Insert new bug
        const { data: newBug, error: insertError } = await supabase
            .from("bugs")
            .insert([
                {
                    title,
                    description,
                    status: "OPEN",
                    priority,
                    created_by,
                    component,
                    project_id: project.id,
                    created_at: now,
                    updated_at: now,
                    upvotes: 0
                }
            ])
            .select()
            .single();

        if (insertError) {
            console.error(insertError);
            return new Response(JSON.stringify({ error: "Bug creation failed" }), { status: 500 });
        }

        return new Response(JSON.stringify(newBug), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Bug creation error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
