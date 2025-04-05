import { supabase } from "@/app/api/config/db/supa.js";

export async function POST(req) {
    try {
        const body = await req.json();

        const {
            name,
            description,
            testers,
            developers,
            company_id,
            manager_id,
        } = body;

        // 1. Create the project
        const { data: project, error: projectError } = await supabase
            .from("projects")
            .insert([
                {
                    name,
                    description,
                    company_id,
                    manager_id,
                },
            ])
            .select()
            .single();

        if (projectError) {
            console.error("Project insert error:", projectError);
            return new Response(JSON.stringify({ error: "Failed to create project" }), { status: 500 });
        }

        // 2. Prepare members to insert with roles
        const memberInserts = [
            ...testers.map(user_id => ({ user_id, project_id: project.id, role: "Tester" })),
            ...developers.map(user_id => ({ user_id, project_id: project.id, role: "Developer" })),
            { user_id: manager_id, project_id: project.id, role: "Manager" },
        ];

        const { error: memberError } = await supabase
            .from("project_members")
            .insert(memberInserts);

        if (memberError) {
            console.error("Member insert error:", memberError);
            return new Response(JSON.stringify({ error: "Failed to add project members" }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Project created successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });

    } catch (err) {
        console.error("Unexpected error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
