import { supabase } from "../../../config/db/supa.js";

export async function GET(req, { params }) {
    try {
        const { id } = params; // Bug ID from the URL

        // Fetch the bug details along with project name and tester/developer info
        const { data: bug, error: bugError } = await supabase
            .from("bugs")
            .select(`
                id,
                title,
                description,
                solution,
                status,
                priority_level,
                deadline,
                created_at,
                updated_at,
                closed_at,
                component,
                tag,
                project_id,
                projects(name),
                created_by,
                users!created_by(name),
                assigned_to,
                assigned_user:name
            `)
            .eq("id", id)
            .single();

        if (bugError || !bug) {
            return new Response(JSON.stringify({ error: "Bug not found" }), { status: 404 });
        }

        // Format response
        const response = {
            id: bug.id,
            title: bug.title,
            description: bug.description,
            solution: bug.solution || "No solution provided",
            status: bug.status,
            priority_level: bug.priority_level,
            deadline: bug.deadline || "No deadline assigned",
            created_at: bug.created_at,
            updated_at: bug.updated_at || "Not updated",
            closed_at: bug.closed_at || "Not closed",
            component: bug.component || "Not provided",
            tag: bug.tag,
            project_name: bug.projects?.name || "Unknown",
            tester_name: bug.users?.name || "Unknown",
            developer_name: bug.assigned_user || "Not assigned"
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Bug fetch error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}


export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const updates = await req.json();

        if (!id) {
            return new Response(JSON.stringify({ error: "Bug ID is required" }), { status: 400 });
        }

        // Add timestamp to indicate bug update
        updates.updated_at = new Date();

        const { data, error } = await supabase
            .from("bugs")
            .update(updates)
            .eq("id", id)
            .select("*")
            .single();

        if (error) {
            console.error("Update error:", error);
            return new Response(JSON.stringify({ error: "Failed to update bug" }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Bug updated successfully", updatedBug: data }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Bug update error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}