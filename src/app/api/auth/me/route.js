import { verifyToken } from "@/lib/utils/verifyToken"; // you need this
import { NextResponse } from "next/server";

export async function GET(req) {
    try {
        const token = req.cookies.get("jwt")?.value;
        if (!token) return NextResponse.json({ user: null }, { status: 401 });

        const user = verifyToken(token); 
        return NextResponse.json({ user });
    } catch {
        return NextResponse.json({ user: null }, { status: 401 });
    }
}