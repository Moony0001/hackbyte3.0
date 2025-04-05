import { supabase } from "@/app/api/config/db/supa.js";

export async function GET() {
    const { data, error } = await supabase
        .from("company")
        .select("id, name");

    if (error) {
        return new Response(JSON.stringify({ error: "Failed to fetch companies" }), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" }
    });
}


export async function POST(req) {
    const { name } = await req.json();

    const { data, error } = await supabase
        .from("company")
        .insert([{ name }])
        .select()
        .single();

    if (error) {
        if (error.code === "23505") {
            return new Response(JSON.stringify({ error: "Company already exists" }), { status: 409 });
        }
        return new Response(JSON.stringify({ error: "Failed to create company" }), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
        status: 201,
        headers: { "Content-Type": "application/json" }
    });
}

