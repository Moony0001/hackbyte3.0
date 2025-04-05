"use client";
import { X } from "lucide-react";
import Card from "./Card";
import { useEffect, useState } from "react";
// import supabase from "@/app/api/config/db/supa";

export default function Sidebar({ setSelectedProject, sidebarOpen, setSidebarOpen }) {
    const projects = [
        { id: 1, name: "Project Alpha", tester: ["Alice"], developer: ["Bob"] },
        { id: 2, name: "Project Beta", tester: ["Charlie"], developer: ["David"] },
        { id: 3, name: "Project Gamma", tester: ["Eve"], developer: ["Frank"] },
    ];

    return (
        <div className="z-999">
            <div className="hidden md:block p-4 mt-30">
                <h1 className="font-bold text-lg mb-4">Your Projects</h1>
                {projects.map((project) => (
                    <button
                        key={project.id}
                        className="w-full text-left"
                        onClick={() => setSelectedProject(project)}
                    >
                        <Card>
                            <div>
                                <h3 className="font-semibold">Project: {project.name}</h3>
                                <h5>Tester: {project.tester}</h5>
                                <h5>Developer: {project.developer}</h5>
                            </div>
                        </Card>
                    </button>
                ))}
            </div>

            <div
                className={`fixed top-26 left-0 h-full w-[40%] bg-white p-4 shadow-lg transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}
                style={{ zIndex: 50 }}
            >
                <button
                    className="absolute top-4 right-4 text-gray-600"
                    onClick={() => setSidebarOpen(false)}
                >
                    <X className="w-6 h-6" />
                </button>

                <h1 className="font-bold text-lg mb-4">Your Projects</h1>

                {projects.map((project) => (
                    <button
                        key={project.id}
                        className="w-full text-left"
                        onClick={() => {
                            setSelectedProject(project);
                            setSidebarOpen(false); 
                        }}
                    >
                        <Card>
                            <div>
                                <h3 className="font-semibold">Project: {project.name}</h3>
                                <h5>Tester: {project.tester}</h5>
                                <h5>Developer: {project.developer}</h5>
                            </div>
                        </Card>
                    </button>
                ))}
            </div>
        </div>
    );
}