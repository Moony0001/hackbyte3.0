"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SolutionForm({ bugName = "Sample Bug", onClose }) {
    const [solution, setSolution] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted Solution:", {
            bugName,
            solution,
        });
        setSolution("");
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
            <div className="relative max-w-md w-full bg-black text-white p-6 rounded-xl border border-gray-800">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-[#F91E34]"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-2xl font-semibold mb-4">
                    Insert Solution for: <span className="text-[#F91E34]">{bugName}</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea
                        className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-[#F91E34]"
                        rows="5"
                        placeholder="Write your solution here..."
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#F91E34] text-black rounded-lg font-medium hover:bg-[#d01a2e] transition-all"
                    >
                        Submit Solution
                    </button>
                </form>
            </div>
        </div>
    );
}
