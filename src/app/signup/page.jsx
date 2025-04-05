"use client";

import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import DropdownSelect from "../components/DropdownSelect";

export default function SignupPage() {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        username: "",
        companyName: "",
        role: "",
    });
    const [showPassword, setShowPassword] = useState(false);

    const onSignUp = async () => {
        console.log("User:", user);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-4 w-[90%] max-w-md mx-auto p-6 rounded-lg">
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
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                />
                <button 
                    type="button"
                    className="absolute inset-y-0 right-3 flex items-center text-gray-600 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>

            <label htmlFor="companyName" className="w-full font-medium">Company Name</label>
            <input 
                id="companyName"
                type="text"
                value={user.companyName}
                onChange={(e) => setUser({ ...user, companyName: e.target.value })}
                placeholder="Enter name"
                className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
            />

            <DropdownSelect 
                label="Role" 
                options={["Manager", "Developer", "Tester"]} 
                selectedValue={user.role} 
                setSelectedValue={(role) => setUser({ ...user, role })} 
            />

            <DropdownSelect 
                label="Company" 
                options={["Google", "Microsoft", "Amazon"]} 
                selectedValue={user.companyName} 
                setSelectedValue={(companyName) => setUser({ ...user, companyName })} 
            />
            
            {/* 
            {user.role === "Manager" && (
                <div className="w-full">
                    <label htmlFor="token" className="w-full font-medium">Token</label>
                    <input 
                        id="token"
                        type="token"
                        value={user.token}
                        onChange={(e) => setUser({ ...user, token: e.target.value })}
                        placeholder="Enter token"
                        className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                    />
                </div>
            )} */}

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