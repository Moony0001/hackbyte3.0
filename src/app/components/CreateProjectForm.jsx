"use client";

import { useState, useEffect } from "react";
import Card from "./Card";
import { X } from "lucide-react";
import MultiSelectDropdown from "./MultiSelectDropdown";
// import Cookies from "js-cookie";
import { useUser } from "../context/UserContext";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useUserDetails from "@/hooks/useUserDetails";

export default function CreateProjectForm({ setIsModalOpen }) {
    const [project, setProject] = useState({
        name: "",
        description: "",
        testers: [],
        developers: [],
        company_id: "",
        manager_id: "",
    });

    const user = useUser(); 

    const { userData: testerList } = useUserDetails("Tester");
    const { userData: developerList } = useUserDetails("Developer");

    useEffect(() => {
        if (testerList) {
            console.log("Tester List:", testerList);
        }
        if (developerList) {
            console.log("Developer List:", developerList);
        }
    }, []);
    

    useEffect(() => {
        console.log("User from create Project:", user?.userId);
    }, [user]);


    const handleCreateProject = async () => {
        try {
            if (!user) {
                alert("No user found. Please login again.");
                return;
            } else {
                console.log("User in create project try:", user);
            }

            const supabase = createClientComponentClient();
            const { data, error } = await supabase
                .from("users")
                .select("company_id")
                .eq("id", user.userId)
                .single();

            console.log("usercreateform data from context:", data);

            if (error) {
                console.error("Error fetching company:", error);
            } else {
                console.log("Fetched user company:", data.company_id);
            }
    
            const res = await fetch("/api/project/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: project.name,
                    description: project.description,
                    testers: project.testers,
                    developers: project.developers,
                    company_id: data.company_id,
                    manager_id: user.userId,
                }),
            });
    
            if (!res.ok) {
                alert(data.error || "Failed to create project.");
                return;
            }
    
            alert("Project created successfully!");
            setIsModalOpen(false);
            setProject({ name: "", description: "", testers: [], developers: [] });
    
        } catch (error) {
            console.error("Error creating project:", error);
            alert("Something went wrong.");
        }
    };
    

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-[2px] z-9999">
            <Card>
                <div className="w-96 bg-black rounded-md relative p-4 border-[#FA1C32]">
                    <button
                        className="absolute top-3 right-3 text-[#F91E34]"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-xl font-bold mb-4">Create New Project</h2>

                    <input
                        type="text"
                        placeholder="Project Name"
                        className="w-full border p-2 rounded-md mb-3"
                        value={project.name}
                        onChange={(e) =>
                            setProject({ ...project, name: e.target.value })
                        }
                    />

                    <textarea
                        placeholder="Project Description"
                        className="w-full border p-2 rounded-md mb-4"
                        rows="3"
                        value={project.description}
                        onChange={(e) =>
                            setProject({ ...project, description: e.target.value })
                        }
                    />

                    <MultiSelectDropdown
                        label="Testers"
                        options={testerList || []}
                        selected={project.testers}
                        setSelected={(selectedTesters) =>
                            setProject({ ...project, testers: selectedTesters })
                        }
                    />

                    <MultiSelectDropdown
                        label="Developers"
                        options={developerList || []}
                        selected={project.developers}
                        setSelected={(selectedDevelopers) =>
                            setProject({ ...project, developers: selectedDevelopers })
                        }
                    />

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-md border-2 border-transparent hover:-translate-y-1 hover:shadow-md hover:border-[#6c6969] transition-all duration-200 cursor-pointer"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-[#F91E34] text-black rounded-md border-2 border-transparent hover:-translate-y-1 hover:shadow-md hover:border-[#3b2225] transition-all duration-200 cursor-pointer"
                            onClick={handleCreateProject}
                        >
                            Create Project
                        </button>
                    </div>

                </div>
            </Card>
        </div>
    );
}