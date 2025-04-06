import { supabase } from "../../config/db/supa";
import { Client } from "@gradio/client";


export async function POST(req) {
    try {
        const body = await req.json();

        let {
            project_name,
            description,
            title, // maybe blank or user editable after RAG
            created_by,
            component = "not provided" // default value
        } = body;

        
        const { data: project, error: projectError } = await supabase
            .from("projects")
            .select("id")
            .eq("name", project_name)
            .single();

        if (projectError || !project) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        const projectId = project.id;

        const now = new Date().toISOString();


        //GET PRIORITY FROM ML MODEL

        const client = await Client.connect("infinityy/Triage");

        if (!title || title.trim() === "") {
            const titleResult = await client.predict("/predict", {
                component,
                description,
                pid: projectId.toString(),
                mode: "title"
            });

            title = titleResult?.data || "Untitled Bug"; // fallback
        }

        const priorityResult = await client.predict("/predict", {
            component,
            title,
            description,
            mode: "priority"
        });

        const priority = priorityResult?.data?.toUpperCase?.() || "MEDIUM"; // fallback

        // 2. Insert new bug
        const { data: newBug, error: insertError } = await supabase
            .from("bugs")
            .insert([
                {
                    title,
                    description,
                    status: "OPEN",
                    priority_level: priority,
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
