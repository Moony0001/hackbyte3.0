"use client";
import { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
    const { data: session } = useSession();
    const [searchTerm, setSearchTerm] = useState("");

    return (
        <nav className="grid grid-cols-3 space-between items-center bg-[#295F98] p-8 text-black shadow-lg w-full ">
            <div>
                <img src="../logo.png" alt="APTS" className="h-10" />
            </div>
            <div className="">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    className="hidden sm:block px-3 py-1 rounded-md bg-white border border-gray-600 outline-none focus:border-blue-500 w-full"
                />
            </div>
            <div className="place-self-end ">
                {session ? (
                    <button 
                        onClick={() => signOut()} 
                        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-500 transition"
                    >
                        Profile
                    </button>
                ) : (
                    <button 
                        onClick={() => signIn()} 
                        className="bg-[#F2EFE7] px-4 py-2 rounded-lg hover:-translate-y-2 transition"
                    >
                        Login
                    </button>
                )}
            </div>
        </nav>
    );
}