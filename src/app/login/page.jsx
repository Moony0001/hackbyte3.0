"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Card from "../components/Card";

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
        <div className="flex flex-col items-center justify-center min-h-screen py-3 w-[90%] max-w-md mx-auto p-6 rounded-lg pt-[120px]">
            <Card>
                <div className="w-full text-black text-center rounded-md relative p-10 ">                
                    <h1 className="text-3xl font-bold mb-6">Login</h1>

                    <label htmlFor="identifier" className="w-full font-medium">Email or Username</label>
                    <input 
                        id="identifier"
                        type="text" 
                        value={user.identifier}
                        onChange={(e) => setUser({ ...user, identifier: e.target.value })}
                        placeholder=""
                        className="w-full p-2 border border-gray-600 rounded-lg mb-2 focus:outline-none focus:border-gray-600"
                    />

                    <label htmlFor="password" className="w-full font-medium">Password</label>
                    <div className="relative w-full">
                        <input 
                            id="password"
                            type={showPassword ? "text" : "password"} 
                            value={user.password}
                            onChange={(e) => setUser({ ...user, password: e.target.value })}
                            placeholder=""
                            className="w-full p-2 border border-gray-600 rounded-lg focus:outline-none focus:border-gray-600"
                        />
                        <button 
                            type="button"
                            className="absolute inset-y-0 right-3 flex items-center text-[#F91E34]"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>

                    <button 
                        className="w-full py-2 my-10 bg-[#F91E34] text-center rounded-lg mb-4 hover:-translate-y-2 transition duration-200 cursor-pointer hover:bg-[#F91E34]"
                        onClick={onLogin}
                    >
                        Login
                    </button>

                    <div className="text-center text-gray-600">
                        <Link href="/signup" className="text-[#F91E34]">Don't have an account? Sign up</Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}
