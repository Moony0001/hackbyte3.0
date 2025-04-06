"use client";
import { useEffect, useState } from "react";
import MultiSelectDropdown from "./MultiSelectDropdown";
import useUserDetails from "@/hooks/useUserDetails.js";
import { useUser } from "../context/UserContext.js";

export default function CenterProjectDescription({ selectedProject, setSelectedProject }) {
    const [projectDetails, setProjectDetails] = useState(null);
    const user = useUser();

    const { userData: testers } = useUserDetails("Tester");
    const { userData: developers } = useUserDetails("Developer");

    const fetchProjectDetails = async () => {
        try {
            const res = await fetch(`/api/project/${selectedProject.id}`, {
                method: "GET",
                credentials: "include"
            });
            const data = await res.json();

            if (res.ok) {
                setProjectDetails(data.project);
            } else {
                console.error("Error fetching project details", data.error);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    useEffect(() => {
        if (selectedProject) fetchProjectDetails();
    }, [selectedProject]);

    const handleTesterChange = (selectedTesters) => {
        setProjectDetails({ ...projectDetails, testers: selectedTesters });
    };

    const handleDeveloperChange = (selectedDevelopers) => {
        setProjectDetails({ ...projectDetails, developers: selectedDevelopers });
    };

    console.log("selectedProject: ", selectedProject);

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
                </>
            ) : (
                <p className="text-gray-500">Loading project...</p>
            )}
        </div>
    );
}
