import { supabase } from "@/app/api/config/db/supa.js";
import { verifyToken } from "@/lib/utils/verifyToken.js";
import { NextResponse } from "next/server";

export async function GET(req, context) {
    try {
        const { id } = context.params;

        const token = req.cookies.get("jwt")?.value;

        if (!token) {
            return NextResponse.json({ error: "Unauthorized: Missing token" }, { status: 401 });
        }

        const decoded = verifyToken(token);
        if (!decoded) {
            return NextResponse.json({ error: "Unauthorized: Invalid token" }, { status: 401 });
        }

        const url = new URL(req.url);

        const userId = decoded.userId;

        const { data: userRole, error: userError } = await supabase
            .from("users")
            .select("role")
            .eq("id", userId)
            .single();

        if (!userId || !userRole) {
            return new Response(JSON.stringify({ error: "Unauthorized: Missing user info" }), { status: 401 });
        }

        // Get project details + manager name
        const { data: project, error: projectError } = await supabase
            .from("projects")
            .select(`
                id,
                name,
                description,
                created_at,
                updated_at,
                manager_id,
                users!manager_id(name)
            `)
            .eq("id", id)
            .single();

        if (projectError || !project) {
            return new Response(JSON.stringify({ error: "Project not found" }), { status: 404 });
        }

        if (
            userRole === "tester" ||
            userRole === "developer"
        ) {
            const { data: isMember, error: memberCheckError } = await supabase
                .from("project_members")
                .select("*")
                .eq("project_id", id)
                .eq("user_id", userId);

            if (memberCheckError || isMember.length === 0) {
                return new Response(JSON.stringify({ error: "Forbidden: Not a project member" }), { status: 403 });
            }
        } else if (userRole === "manager" && project.manager_id !== userId) {
            return new Response(JSON.stringify({ error: "Forbidden: Not the manager of this project" }), { status: 403 });
        }

        // Get all members (user_id) for this project
        const { data: projectMembers, error: memberError } = await supabase
            .from("project_members")
            .select("user_id")
            .eq("project_id", id);

        if (memberError) {
            return new Response(JSON.stringify({ error: "Failed to fetch project members" }), { status: 500 });
        }

        const userIds = projectMembers.map(member => member.user_id);

        // Fetch user names and roles for developers and testers
        const { data: users, error: usersError } = await supabase
            .from("users")
            .select("id, name, role")
            .in("id", userIds);

        if (usersError) {
            return new Response(JSON.stringify({ error: "Failed to fetch user info" }), { status: 500 });
        }

        const developers = users.filter(u => u.role === "developer").map(u => u.name);
        const testers = users.filter(u => u.role === "tester").map(u => u.name);

        let bugsQuery = supabase
            .from("bugs")
            .select("*")
            .eq("project_id", id)
            .order("created_at", { ascending: false });


        if (userRole === "tester") {
            bugsQuery = bugsQuery.eq("created_by", userId);
        }


        const { data: bugs, error: bugsError } = await bugsQuery;

        if (bugsError) {
            return new Response(JSON.stringify({ error: "Failed to fetch bugs" }), { status: 500 });
        }

        let assignedBugs = [];
        if (userRole === "developer") {
            const { data: assigned, error: assignedError } = await supabase
                .from("bugs")
                .select("*")
                .eq("project_id", id)
                .eq("assigned_to", userId)
                .order("created_at", { ascending: false });

            if (!assignedError) {
                assignedBugs = assigned;
            }
        }

        // Get total bug count for pagination metadata
        let bugCountQuery = supabase
            .from("bugs")
            .select("*", { count: "exact", head: true })
            .eq("project_id", id);

        if (userRole === "tester") {
            bugCountQuery = bugCountQuery.eq("created_by", userId);
        }

        const { count: totalBugs, error: countError } = await bugCountQuery;

        if (countError) {
            return new Response(JSON.stringify({ error: "Failed to fetch bug count" }), { status: 500 });
        }


        const response = {
            id: project.id,
            name: project.name,
            description: project.description,
            created_at: project.created_at,
            updated_at: project.updated_at,
            manager: project.users?.name || "Unknown",
            developers,
            testers,
            bugs,
            assignedBugs: userRole === "developer" ? assignedBugs : undefined,
        };

        return new Response(JSON.stringify(response), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Project fetch error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

export async function PATCH(req, { params }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { name, description } = body;

        // Optional: validate input
        if (!name && !description) {
            return new Response(JSON.stringify({ error: "Nothing to update" }), { status: 400 });
        }

        const updates = {
            ...(name && { name }),
            ...(description && { description }),
            updated_at: new Date()
        };

        const { error: updateError } = await supabase
            .from("projects")
            .update(updates)
            .eq("id", id);

        if (updateError) {
            return new Response(JSON.stringify({ error: "Failed to update project" }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Project updated successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Project update error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}

// DELETE route — Delete project and related records
export async function DELETE(req, { params }) {
    try {
        const { id } = params;

        // Optional: remove all project_members first
        const { error: memberDeleteError } = await supabase
            .from("project_members")
            .delete()
            .eq("project_id", id);

        if (memberDeleteError) {
            console.warn("Failed to remove project members:", memberDeleteError.message);
        }

        // Optional: remove all bugs associated with this project
        const { error: bugsDeleteError } = await supabase
            .from("bugs")
            .delete()
            .eq("project_id", id);

        if (bugsDeleteError) {
            console.warn("Failed to delete project bugs:", bugsDeleteError.message);
        }

        // Finally: delete the project itself
        const { error: deleteError } = await supabase
            .from("projects")
            .delete()
            .eq("id", id);

        if (deleteError) {
            return new Response(JSON.stringify({ error: "Failed to delete project" }), { status: 500 });
        }

        return new Response(JSON.stringify({ message: "Project deleted successfully" }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Project delete error:", err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
}