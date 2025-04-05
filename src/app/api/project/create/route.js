import { supabase } from "../../config/db/supa.js";

export async function GET(req) {
    try {
        //Get the currently logged-in user from Supabase
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const { data: user, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Invalid user session" }), { status: 401 });
        }

        const userId = user.id; // Extract user ID

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();

        if (userError || !userData) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const userRole = userData.role;

        //Fetch all project IDs where the user is a member
        const { data: userProjects, error: projectMemberError } = await supabase
            .from("project_members")
            .select("project_id")
            .eq("user_id", userId);

        if (projectMemberError || !userProjects.length) {
            return new Response(JSON.stringify({ error: "No projects found for user" }), { status: 404 });
        }

        const projectId = newProject.id;

        const projectMembers = [
            {
                user_id: manager_id,
                project_id: projectId,
                role: "Manager"
            },
            ...testers.map(user => ({
                user_id: user.id,
                project_id: projectId,
                role: "Tester"
            })),
            ...developers.map(user => ({
                user_id: user.id,
                project_id: projectId,
                role: "Developer"
            }))
        ];

        if (projectMembers.length > 0) {
            const { error: memberError } = await supabase.from("project_members").insert(projectMembers);

            if (memberError) {
                return new Response(JSON.stringify({ error: "Failed to assign members to project" }), { status: 500 });
            }
        }

        return new Response(JSON.stringify({ projects: finalProjects }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error in getUserProjects:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
