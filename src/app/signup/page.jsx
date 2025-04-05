"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import DropdownSelect from "../components/DropdownSelect";
import Card from "../components/Card";

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
        <div className="flex flex-col items-center justify-center min-h-screen py-3 w-[90%] max-w-md mx-auto p-6 rounded-lg pt-[150px]">
            <Card>
                <div className="w-full text-black text-center rounded-md relative p-10 ">
                    <h1 className="text-3xl font-bold mb-4">Sign Up</h1>

                    <label htmlFor="username" className="w-full font-medium text-left">Username</label>
                    <input
                        id="username"
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        placeholder=""
                        className="w-full p-2 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                    />

                    <label htmlFor="name" className="w-full font-medium text-left">Name</label>
                    <input
                        id="name"
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        placeholder=""
                        className="w-full p-2 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                    />

                    <label htmlFor="email" className="w-full font-medium text-left">Email</label>
                    <input
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder=""
                        className="w-full p-2 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
                    />

                    <label htmlFor="password" className="w-full font-medium text-left">Password</label>
                    <div className="relative w-full mb-4">
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
                            className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff className="text-[#F91E34]" size={20} /> : <Eye className="text-[#F91E34]" size={20} />}
                        </button>
                    </div>

                    <DropdownSelect
                        label="Role"
                        options={["Manager", "Developer", "Tester"]}
                        selectedValue={user.role}
                        setSelectedValue={(role) => setUser({ ...user, role })}
                        isRole={true}
                    />

                    <DropdownSelect
                        label="Company"
                        options={companyOptions}
                        selectedValue={user.company}
                        setSelectedValue={(company) => setUser({ ...user, company })}
                        isRole={false}
                    />

                    <button
                        className="w-full py-2 my-6 bg-[#F91E34] text-white rounded-lg hover:-translate-y-2 transition duration-200 cursor-pointer hover:bg-[#d91e2e]"
                        onClick={onSignUp}
                    >
                        Sign Up
                    </button>

                    <div className="text-center text-gray-600">
                        <Link href="/login" className="text-[#F91E34]">Already have an account? Login</Link>
                    </div>
                </div>
            </Card>
        </div>
    );
}