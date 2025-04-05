// import { supabase } from "@/app/api/config/db/supa.js";

// export async function POST(req) {
//     try {
//         const authHeader = req.headers.get("Authorization");
//         if (!authHeader) {
//             return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
//         }

//         const token = authHeader.split("Bearer ")[1];
//         const { data: user, error: authError } = await supabase.auth.getUser(token);

//         if (authError || !user) {
//             return new Response(JSON.stringify({ error: "Invalid user session" }), { status: 401 });
//         }

//         const userId = user.id; // Get logged-in user ID

//         // 1️⃣ Validate if the user is a manager
//         const { data: managerData, error: managerError } = await supabase
//             .from("users")
//             .select("role, company_id")
//             .eq("id", userId)
//             .single();

//         if (managerError || !managerData || managerData.role !== "manager") {
//             return new Response(JSON.stringify({ error: "Only managers can create projects" }), { status: 403 });
//         }

//         const { name, description, testers = [], developers = [] } = await req.json(); // Extract data from request

//         if (!name || !description) {
//             return new Response(JSON.stringify({ error: "Project name and description are required" }), { status: 400 });
//         }

//         // 2️⃣ Insert project into the database
//         const { data: newProject, error: projectError } = await supabase
//             .from("projects")
//             .insert([
//                 {
//                     name,
//                     description,
//                     manager_id: userId,
//                     company_id: managerData.company_id,
//                     created_at: new Date(),
//                     updated_at: new Date(),
//                 }
//             ])
//             .select("id")
//             .single();

//         if (projectError || !newProject) {
//             return new Response(JSON.stringify({ error: "Failed to create project" }), { status: 500 });
//         }

//         const projectId = newProject.id;

//         // 3️⃣ Insert testers and developers into `project_members`
//         const projectMembers = [
//             ...testers.map(userId => ({ user_id: userId, project_id: projectId })),
//             ...developers.map(userId => ({ user_id: userId, project_id: projectId }))
//         ];

//         if (projectMembers.length > 0) {
//             const { error: memberError } = await supabase.from("project_members").insert(projectMembers);
//             if (memberError) {
//                 return new Response(JSON.stringify({ error: "Failed to assign members to project" }), { status: 500 });
//             }
//         }

//         return new Response(JSON.stringify({ message: "Project created successfully", projectId }), {
//             status: 201,
//             headers: { "Content-Type": "application/json" }
//         });

//     } catch (error) {
//         console.error("Error creating project:", error);
//         return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
//     }
// }

import { supabase } from "@/app/api/config/db/supa.js";

export async function POST(req) {
    try {
        const { name, description, testers = [], developers = [], manager_id, company_id } = await req.json();

        if (!name || !description) {
            return new Response(JSON.stringify({ error: "Project name and description are required" }), { status: 400 });
        }

        const { data: newProject, error: projectError } = await supabase
            .from("projects")
            .insert([
                {
                    name,
                    description,
                    manager_id,
                    company_id,
                    created_at: new Date(),
                    updated_at: new Date(),
                }
            ])
            .select("id")
            .single();

        if (projectError || !newProject) {
            return new Response(JSON.stringify({ error: "Failed to create project" }), { status: 500 });
        }

        const projectId = newProject.id;

        const projectMembers = [
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

        return new Response(JSON.stringify({ message: "Project created successfully", projectId }), {
            status: 201,
            headers: { "Content-Type": "application/json" }
        });

    } catch (error) {
        console.error("Unhandled server error:", error.stack || error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}
