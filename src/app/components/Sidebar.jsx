"use client";
import { useEffect, useState } from "react";
import { X } from "lucide-react";
import Card from "./Card";
import { useUser } from "../context/UserContext";

export default function Sidebar({ setSelectedProject, sidebarOpen, setSidebarOpen }) {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    const user = useUser();

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch("/api/project/all", {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();

                if (res.ok) {
                    console.log("Fetched projects:", data.projects);
                    setProjects(data.projects);
                } else {
                    console.error("Project fetch error:", data.error);
                }
            } catch (error) {
                console.error("Failed to fetch projects", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProjects(); 
    }, [user]);

    return (
        <div className="">
            {/* Desktop Sidebar */}
            <div className="hidden md:block p-4 mt-30 border-r border-gray-200 h-screen">
                <h1 className="font-bold text-lg mb-4">Your Projects</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : projects.length === 0 ? (
                    <p className="text-gray-500">Sorry, no projects found.</p>
                ) : (
                    projects.map((project) => (
                        <button
                            key={project.id}
                            className="w-full text-left"
                            onClick={() => setSelectedProject(project)}
                        >
                            <Card className="transition-transform duration-200 transform hover:scale-105">
                                <div className="p-4 w-60">
                                    <h3 className="font-semibold text-black">Project: {project.name || "Unnamed"}</h3>
                                    <h5 className="text-sm text-gray-600">Manager: {project.manager || "Unknown"}</h5>
                                    <h5 className="text-sm text-black">
                                        Bugs{" "}
                                        {project.role === "tester"
                                            ? `Found: ${project.bugCount ?? 0}`
                                            : project.role === "developer"
                                            ? `Assigned: ${project.bugCount ?? 0}`
                                            : `Total: ${project.bugCount ?? 0}`}
                                    </h5>
                                </div>
                            </Card>
                        </button>
                    ))
                )}
            </div>

            {/* Mobile Sidebar */}
            <div
                className={`pl-4 fixed top-30 left-0 h-full w-[40%] bg-white shadow-lg border-r border-gray-200 transition-transform duration-300 ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } md:hidden`}
                style={{ zIndex: 50 }}
            >
                <button
                    className="absolute top-4 right-4 text-[#F91E34]"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>

                <h1 className="font-bold text-lg mb-4">Your Projects</h1>
                {loading ? (
                    <p>Loading...</p>
                ) : projects.length === 0 ? (
                    <p className="text-gray-500">Sorry, no projects found.</p>
                ) : (
                    projects.map((project) => (
                        <button
                            key={project.id}
                            className="w-full text-left"
                            onClick={() => {
                                setSelectedProject(project);
                                setSidebarOpen(false);
                            }}
                        >
                            <Card className="transition-transform duration-200 transform hover:scale-105">
                                <div>
                                    <h3 className="font-semibold">Project: {project.name}</h3>
                                    <h5 className="text-sm text-gray-600">Manager: {project.manager}</h5>
                                    <h5 className="text-sm">
                                        Bugs {project.role === "tester"
                                            ? `Found: ${project.bugCount}`
                                            : project.role === "developer"
                                            ? `Assigned: ${project.bugCount}`
                                            : `Total: ${project.bugCount}`}
                                    </h5>
                                </div>
                            </Card>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
}
