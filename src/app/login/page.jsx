"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [user, setUser] = useState({
        identifier: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const onLogin = async () => {
    
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: user.identifier,
                    password: user.password
                })
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                alert(data.error || "Login failed");
                return;
            }
    
            alert("Login successful!");
            router.push("/"); 
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong. Please try again.");
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-4 w-[90%] max-w-md mx-auto p-6 rounded-lg">
            <h1 className="text-3xl font-bold mb-4">Login</h1>

            <label htmlFor="identifier" className="w-full font-medium">Email or Username</label>
            <input 
                id="identifier"
                type="text" 
                value={user.identifier}
                onChange={(e) => setUser({ ...user, identifier: e.target.value })}
                placeholder="Enter email or username"
                className="w-full p-2 border border-gray-300 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
            />

            <label htmlFor="password" className="w-full font-medium">Password</label>
            <div className="relative w-full">
                <input 
                    id="password"
                    type={showPassword ? "text" : "password"} 
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                />
                <button 
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <button 
                className="w-full p-2 m-10 bg-gray-800 text-white rounded-lg mb-4 hover:bg-gray-700"
                onClick={onLogin}
            >
                Login
            </button>

            <Link href="/signup" className="text-blue-800">Don't have an account? Sign up</Link>
        </div>
    );
}
