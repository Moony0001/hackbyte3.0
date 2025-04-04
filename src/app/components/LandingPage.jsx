"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import CenterPage from "./CenterPart";
import { Menu } from "lucide-react";

export default function LandingPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen">
            <div className="absolute top-30 left-5 md:hidden">
                <button onClick={() => setSidebarOpen(true)}>
                    <Menu className="w-8 h-8 text-gray-800" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[20%_70%] min-h-screen">
                <div className="hidden md:block bg-gray-200 p-4">
                    <Sidebar />
                </div>
                <div className="bg-white p-4">
                    <CenterPage />
                </div>
            </div>

            <div
                className={`fixed top-0 left-0 h-full w-[70%] bg-white p-4 shadow-lg transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
                style={{ zIndex: 50 }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-600"
                    onClick={() => setSidebarOpen(false)}
                >
                    ✖
                </button>
                <Sidebar />
            </div>
        </div>
    );
}