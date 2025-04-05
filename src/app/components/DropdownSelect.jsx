import MultiSelectDropdown from "./MultiSelectDropdown";
import { X } from "lucide-react";

export default function CenterProjectDescription({ selectedProject, setSelectedProject }) {
    const testers = ["tester_1", "tester_2", "tester_3", "tester_4"];
    const developers = ["dev_1", "dev_2", "dev_3", "dev_4"];

    console.log("selected Projects: ", selectedProject);

    return (
        <div className="text-center">
            <h2 className="text-2xl font-bold">{selectedProject.name}</h2>
            <h5 className="text-lg">Tester: {selectedProject.tester}</h5>
            <h5 className="text-lg">Developer: {selectedProject.developer}</h5>

            <MultiSelectDropdown
                label="Testers"
                options={testers}
                selected={selectedProject.testers}
                setSelected={(selectedTesters) =>
                    setProject({ ...selectedProject, testers: selectedTesters })
                }
            />

            <MultiSelectDropdown
                label="Developers"
                options={developers}
                selected={selectedProject.developers}
                setSelected={(selectedDevelopers) =>
                    setProject({ ...selectedProject, developers: selectedDevelopers })
                }
            />

            <button
                className="mt-4 text-red-500"
                onClick={() => setSelectedProject(null)}
            >
                <X className="w-5 h-5" />
            </button>
        </div>
    )
}