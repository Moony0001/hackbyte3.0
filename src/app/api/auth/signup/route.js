import { supabase } from "../../config/db/supa.js";
import { generateTokenAndSetCookie } from "../../../../lib/utils/generateTokenAndSetCookie.js";
import bcrypt from "bcryptjs";

export async function POST(req) {
    try {
        const { name, email, username, role, company, password } = await req.json();

        if (!name) {
            return Response.json({ error: "Name is required" }, { status: 400 });
        }

        if (!email) {
            return Response.json({ error: "Email is required" }, { status: 400 });
        }

        if (!username) {
            return Response.json({ error: "Username is required" }, { status: 400 });
        }

        if (!password) {
            return Response.json({ error: "Password is required" }, { status: 400 });
        }

        if (!role) {
            return Response.json({ error: "Role is required" }, { status: 400 });
        }

        if (!company) {
            return Response.json({ error: "Company is required" }, { status: 400 });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return Response.json({ error: 'Invalid email format' }, { status: 400 });
        }

        if (password.length < 6) {
            return Response.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
        }

        const { data: existingUser, error: checkUserError } = await supabase
            .from('users')
            .select('id')
            .or(`username.eq.${username},email.eq.${email}`)
            .maybeSingle();

        if (checkUserError) {
            console.error("Error checking existing user:", checkUserError);
        }

        if (existingUser) {
            return Response.json({ error: 'Username or email is already taken' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            console.error("Auth error:", authError.message);
            return new Response(JSON.stringify({ error: authError.message }), { status: 400 });
        }


        let { data: companyData, error: companyCheckError } = await supabase
            .from('company')
            .select('id')
            .eq('name', company)
            .maybeSingle();

        if (companyCheckError) {
            console.error("Error checking company:", companyCheckError);
        }

        if (!companyData) {
            const { data: newCompany, error: newCompanyError } = await supabase
                .from('company')
                .insert([{ name: company }])
                .select('id')
                .single();

            if (newCompanyError) {
                console.error("Company creation error:", newCompanyError);
                return Response.json({ error: 'Failed to create company' }, { status: 500 });
            }
            companyData = newCompany;
        }

        const { data: newUser, error: userError } = await supabase
            .from('users')
            .insert([{ 
                id: authData.user.id, 
                name, 
                username, 
                email, 
                password: hashedPassword, 
                role, 
                company_id: companyData.id 
            }])
            .select()
            .single();

        if (userError) {
            console.error("User creation error:", userError);
            return new Response(JSON.stringify({ error: userError.message }), { status: 400 });
        }


        const cookieHeader = generateTokenAndSetCookie(newUser.id);
        return new Response(JSON.stringify({ message: 'User created successfully', user: newUser }), {
            status: 201,
            headers: {
                "Set-Cookie": cookieHeader,
                "Content-Type": "application/json"
            }
        });

    } catch (error) {
        console.error("Signup Error:", error.message);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
