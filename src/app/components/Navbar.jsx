"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const [searchTerm, setSearchTerm] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const router = useRouter();
    
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch("/api/auth/me");
                const data = await res.json();
                setIsLoggedIn(res.ok && !!data?.user);
            } catch (error) {
                console.error("Error fetching /api/auth/me:", error);
                setIsLoggedIn(false);
            }
        };
    
        checkAuth();
    }, []);
    
    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            setIsLoggedIn(false);
            router.push("/login");
        } catch (err) {
            console.error("Logout error", err);
        }
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);


    return (
        <nav className="fixed grid grid-cols-3 items-center bg-[#295F98] p-8 text-black shadow-lg w-full z-50">
            <div>
                <img src="/logo.png" alt="APTS" className="h-10" />
            </div>

            <div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="hidden sm:block px-3 py-1 rounded-md bg-white border border-gray-600 outline-none focus:border-blue-500 w-full"
                />
            </div>

            <div className="place-self-end" ref={dropdownRef}>
                
                {mounted && isLoggedIn ? (
                    <div className="relative">
                        <img
                            src="https://i.pinimg.com/736x/66/9d/66/669d6694bf9e1047f5d925a281ce48bc.jpg"
                            alt="Profile"
                            onClick={() => setDropdownOpen((prev) => !prev)}
                            className="h-10 w-10 rounded-full cursor-pointer border border-white hover:opacity-90 transition"
                        />
                        {dropdownOpen && (
                            <div className="absolute right-0 mt-2 bg-white border border-gray-300 rounded-md shadow-md z-10 w-32">
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    mounted && (
                        <Link
                            href="/login"
                            className="bg-[#F2EFE7] px-4 py-2 rounded-lg hover:-translate-y-2 transition inline-block"
                        >
                            Login
                        </Link>
                    )
                )}
            </div>
        </nav>
    );
}
