import { supabase } from "@/app/api/config/db/supa.js";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");
        console.log("User ID:", userId);
    
        if (!userId) {
            return new Response(JSON.stringify({ error: "Missing userId" }), { status:400});
        }

        const { data: userData, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();

        console.log("User Data:", userData);

        if (userError || !userData) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const userRole = userData.role;

        //Fetch all project IDs where the user is a member
        const { data: userProjects, error: projectMemberError } = await supabase
            .from("project_members")
            .select("project_id")
            .eq("user_id", userId);

        console.log("User Projects:", userProjects);

        if (projectMemberError || !userProjects.length) {
            return new Response(JSON.stringify({ error: "No projects found for user" }), { status: 202 });
        }

        const projectIds = userProjects.map(p => p.project_id);

        // 3️⃣ Fetch project details and manager name
        const { data: projects, error: projectError } = await supabase
        .from("projects")
        .select(`
            id,
            name,
            manager_id,
            users!manager_id(name)
        `)
        .in("id", projectIds);


        if (projectError) {
            return new Response(JSON.stringify({ error: "Failed to fetch projects" }), { status: 500 });
        }

        // 4️⃣ Fetch role-specific bug statistics
        const finalProjects = await Promise.all(projects.map(async (project) => {
            let bugCount = 0;

            if (userRole === "Developer") {
                const { data: devBugs } = await supabase
                    .from("bugs")
                    .select("id")
                    .eq("assigned_to", userId)
                    .eq("project_id", project.id);
                bugCount = devBugs ? devBugs.length : 0;
            } 
            else if (userRole === "Tester") {
                const { data: testerBugs } = await supabase
                    .from("bugs")
                    .select("id")
                    .eq("reported_by", userId)
                    .eq("project_id", project.id);
                bugCount = testerBugs ? testerBugs.length : 0;
            } 
            else if (userRole === "Manager") {
                const { data: projectBugs } = await supabase
                    .from("bugs")
                    .select("id")
                    .eq("project_id", project.id);
                bugCount = projectBugs ? projectBugs.length : 0;
            }

            return {
                id: project.id,
                name: project.name,
                manager: project.users?.name || "Unknown",
                role: userRole,
                bugCount
            };
        }));

        return new Response(JSON.stringify({ projects: finalProjects }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Error in getUserProjects:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
