"use client";
import { Plus, X } from "lucide-react";
import { useState } from "react";
import CreateProjectForm from "./CreateProjectForm";
// import NewBugForm from "./NewBugForm";
import CenterProjectDescription from "./CenterProjectDescription";

export default function CenterPage({ selectedProject, setSelectedProject }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="p-4 flex items-center justify-center relative w-full">
        {selectedProject ? (
            <CenterProjectDescription selectedProject={selectedProject} setSelectedProject={setSelectedProject}/>
        ) : (
            <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center">
                <Plus className="w-12 h-12 text-gray-500" />
            </button>
        )}

        {isModalOpen && (
            // if tester then display newBugForm 
            // <NewBugForm setIsModalOpen={setIsModalOpen}/>
            <CreateProjectForm setIsModalOpen={setIsModalOpen}/>
        )}
        </div>
    );
}