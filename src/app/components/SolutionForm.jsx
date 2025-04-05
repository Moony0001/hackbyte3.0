"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function SolutionForm({ bugName = "Bug Title", onClose }) {
    const [solution, setSolution] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitted solution:", {
            bugName,
            solution,
        });
        setSolution("");
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="relative bg-black p-6 rounded-xl w-full max-w-md border border-gray-700">
                <button
                    type="button"
                    className="absolute top-4 right-4 text-gray-300 hover:text-[#F91E34]"
                    onClick={onClose}
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-semibold mb-4">
                    Insert Solution for <span className="text-[#F91E34]">{bugName}</span>
                </h2>

                <form onSubmit={handleSubmit}>
                    <textarea
                        className="w-full h-32 p-3 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:border-[#F91E34]"
                        placeholder="Write your solution here..."
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="mt-4 w-full bg-[#F91E34] text-black py-2 px-4 rounded-md hover:bg-[#d01a2e] transition-all"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
