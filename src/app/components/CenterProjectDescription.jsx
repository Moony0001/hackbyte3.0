"use client";
import MultiSelectDropdown from "./MultiSelectDropdown";
import { X } from "lucide-react";
import useUserDetails from "@/hooks/useUserDetails";
import { use, useEffect } from "react";

export default function CenterProjectDescription({ selectedProject, setSelectedProject }) {
    // const testers = ["tester_1", "tester_2", "tester_3", "tester_4"];
    // const developers = ["dev_1", "dev_2", "dev_3", "dev_4"];

    // useEffect(() => {
    //     const testers = useUserDetails("Tester").userData;
    //     const developers = useUserDetails("Developer").userData;

    //     console.log("Testers:", testers);
    //     console.log("Developers:", developers);
    // }, [])
    
    const { userData: testers, error: testersError } = useUserDetails("Tester");
    const { userData: developers, error: devsError } = useUserDetails("Developer");

    const setProject = (updatedProject) => {
        setSelectedProject(updatedProject);
    };

    return (
        <div className="text-center w-80">
            <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
            <h5 className="text-lg">Tester: {selectedProject.tester}</h5>
            <h5 className="text-lg">Developer: {selectedProject.developer}</h5>
            <h6 className="text-pink-800"> add project description </h6>
            <h6 className="text-green-800"> add bug list </h6>

            <MultiSelectDropdown
                label="Testers"
                options={testers || []}
                selected={selectedProject.testers || []}
                setSelected={(selectedTesters) =>
                    setProject({ ...selectedProject, testers: selectedTesters })
                }
            />

            <MultiSelectDropdown
                label="Developers"
                options={developers || []}
                selected={selectedProject.developers || []}
                setSelected={(selectedDevelopers) =>
                    setProject({ ...selectedProject, developers: selectedDevelopers })
                }
            />
        </div>
    )
}