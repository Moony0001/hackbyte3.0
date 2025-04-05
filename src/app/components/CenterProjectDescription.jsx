"use client";
import { useEffect, useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import useUserDetails from "@/hooks/useUserDetails.js";
import { useUser } from "../context/UserContext.js";
import BugCard from "./BugCard";

export default function CenterProjectDescription({ selectedProject, setSelectedProject }) {
    
    const [projectDetails, setProjectDetails] = useState(null);
    const [bugs, setBugs] = useState([]);
    const [selectedBug, setSelectedBug] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const user = useUser();


    const { userData: testers } = useUserDetails("Tester");
    const { userData: developers } = useUserDetails("Developer");

    const fetchProjectDetails = async () => {
        try {
            const res = await fetch(`/api/project/${selectedProject.id}?page=${page}`, {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();

            if (res.ok) {
                setProjectDetails(data.project);
                setBugs(data.bugs);
                setTotalPages(data.totalPages);
            } else {
                console.error("Error fetching project details", data.error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        if (selectedProject) fetchProjectDetails();
    }, [selectedProject, page]);

    const handleTesterChange = (selectedTesters) => {
        setProjectDetails({ ...projectDetails, testers: selectedTesters });
    };

    const handleDeveloperChange = (selectedDevelopers) => {
        setProjectDetails({ ...projectDetails, developers: selectedDevelopers });
    };

    return (
        <div className="text-center w-full max-w-3xl relative">
            {projectDetails ? (
                <>
                    <h2 className="text-2xl font-bold">{projectDetails.name}</h2>
                    <h5 className="text-lg text-gray-700 mb-2">Managed by: {projectDetails.manager}</h5>
                    <p className="text-sm text-gray-500 mb-4">
                        {projectDetails.description || "No description provided."}
                    </p>

                    <MultiSelectDropdown
                        label="Testers"
                        options={testers || []}
                        selected={projectDetails.testers || []}
                        setSelected={handleTesterChange}
                    />
                    <MultiSelectDropdown
                        label="Developers"
                        options={developers || []}
                        selected={projectDetails.developers || []}
                        setSelected={handleDeveloperChange}
                    />

                    <h4 className="text-lg font-semibold mt-6">Bugs</h4>

                    {bugs.length === 0 ? (
                        <p className="italic text-gray-400 mt-2">No bugs yet!</p>
                    ) : (
                        <div className="flex flex-col mt-4 gap-2">
                            {bugs.map((bug, index) => (
                                <div
                                    key={bug.id}
                                    onClick={() => setSelectedBug(bug)}
                                    className={`cursor-pointer transition hover:scale-[1.01] duration-200 ${
                                        index % 2 === 0
                                            ? "bg-neutral-900 text-white"
                                            : "bg-neutral-800 text-gray-300"
                                    } p-4 rounded-md shadow`}
                                >
                                    <h4 className="font-bold text-lg">{bug.title}</h4>
                                    <p className="text-sm">Status: {bug.status}</p>
                                    <p className="text-sm">Priority: {bug.priority}</p>
                                    <p className="text-xs italic">
                                        Created on: {new Date(bug.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    <div className="flex justify-center gap-4 mt-4">
                        <button
                            disabled={page <= 1}
                            onClick={() => setPage(page - 1)}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span className="text-sm text-gray-700">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page >= totalPages}
                            onClick={() => setPage(page + 1)}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>

                    {/* BugCard Modal (Optional Enhancement) */}
                    {selectedBug && (
                        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white w-[90%] md:w-[600px] rounded-lg p-6 relative shadow-xl">
                                <BugCard
                                    bug={selectedBug}
                                    onClose={() => setSelectedBug(null)}
                                    onUpdate={fetchProjectDetails}
                                />
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-500">Loading project...</p>
            )}
        </div>
    );
}