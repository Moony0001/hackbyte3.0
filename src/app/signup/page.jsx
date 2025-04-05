"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import DropdownSelect from "../components/DropdownSelect";

export default function SignupPage() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        username: "",
        company: "",
        role: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [companyOptions, setCompanyOptions] = useState([]);

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const res = await fetch("/api/company");
                const data = await res.json();

                if (res.ok) {
                    const names = data.map((company) => company.name);
                    setCompanyOptions(names);
                } else {
                    console.error("Failed to load companies:", data.error);
                }
            } catch (err) {
                console.error("Error fetching companies:", err);
            }
        };

        fetchCompanies();
    }, []);

    const onSignUp = async () => {
        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(user),
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Signup failed");
                return;
            }

            alert("Signup successful!");
        } catch (error) {
            console.error("Signup error:", error);
            alert("Something went wrong. Please try again.");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-4 w-[90%] max-w-md mx-auto p-6 rounded-lg py-[10em]">
            <h1 className="text-3xl font-bold mb-4">Sign Up</h1>

            <label htmlFor="username" className="w-full font-medium">Username</label>
            <input 
                id="username"
                type="text"
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                placeholder="Enter username"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            />

            <label htmlFor="name" className="w-full font-medium">Name</label>
            <input 
                id="name"
                type="text"
                value={user.name}
                onChange={(e) => setUser({ ...user, name: e.target.value })}
                placeholder="Enter name"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            />

            <label htmlFor="email" className="w-full font-medium">Email</label>
            <input 
                id="email"
                type="email"
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                placeholder="Enter email"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            />

            <label htmlFor="password" className="w-full font-medium">Password</label>
            <div className="relative w-full">
                <input 
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Enter password"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600 mb-4"
                />
                <button 
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer mb-4"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <DropdownSelect 
                label="Role" 
                options={["Manager", "Developer", "Tester"]} 
                selectedValue={user.role} 
                setSelectedValue={(role) => setUser({ ...user, role })} 
            />

            <DropdownSelect 
                label="Company" 
                options={companyOptions} 
                selectedValue={user.company} 
                setSelectedValue={(company) => setUser({ ...user, company })} 
            />

            <button 
                className="w-full p-2 bg-gray-800 text-white rounded-lg mb-4 hover:bg-gray-700"
                onClick={onSignUp}
            >
                Sign Up
            </button>

            <Link href="/login" className="text-blue-800">Already have an account? Login</Link>
        </div>
    );
}
