import { generateTokenAndSetCookie } from "@/lib/utils/generateTokenAndSetCookie.js";
import { supabase } from "../../config/db/supa.js";

export async function POST(req) {
    try {
        const { username, password } = await req.json();

        const { data: user, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .or(`username.eq.${username},email.eq.${username}`)
            .single();

        if (fetchError) {
            console.error("Error fetching user from DB:", fetchError);
            return Response.json({ error: 'User not found' }, { status: 400 });
        }

        if (!user) {
            console.warn("No user found with the provided identifier");
            return Response.json({ error: 'Invalid username or password' }, { status: 400 });
        }


        const { data: session, error: authError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password,
        });

        if (authError) {
            console.error("Supabase auth failed:", authError.message);
            return Response.json({ error: 'Invalid username or password' }, { status: 400 });
        }

        const cookieHeader = generateTokenAndSetCookie(user.id);

        return new Response(JSON.stringify({
            message: "Login successful",
            _id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            companyID: user.company_id,
            createdAt: user.created_at,
            updatedAt: user.updated_at
        }), {
            status: 200,
            headers: {
                "Set-Cookie": cookieHeader,
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error("Login Error:", error.message);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
