import { use, useState } from "react";
import Card from "./Card";
import { X } from "lucide-react";
import { useUser } from "../context/UserContext";

export default function NewBugForm({ setIsModalOpen }) {
    const [bug, setBug] = useState({
        projectName: "",
        title: "",
        description: "",
    });

    const user = useUser();

    const handleReportBug = async () => {
        try {

            if (!user) {
                alert("No user found. Please login again.");
                return;
            } else {
                console.log("User in create project try:", user);
            }

            if (!bug.projectName || !bug.description) {
                alert("Project name and description are required.");
                return;
            }

            const response = await fetch("/api/bug/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    project_name: bug.projectName,
                    title: bug.title, // can be empty string
                    description: bug.description,
                    created_by: user.userId, // <- Replace this with real user info
                    component: "not provided" // or make it editable in the form
                })
            });
    
            const result = await response.json();
    
            if (!response.ok) {
                console.error("Error reporting bug:", result.error);
                alert("Failed to report bug: " + result.error);
                return;
            }
    
            console.log("Bug reported successfully:", result);
    
            // Reset form and close modal
            setBug({
                projectName: "",
                title: "",
                description: "",
            });
            setIsModalOpen(false);
        } catch (error) {
            console.error("Unexpected error:", error);
            alert("Unexpected error while reporting bug.");
        }
    };
    

    return (
        <div className="fixed inset-0 flex items-center text-black justify-center backdrop-blur-[2px] z-9999">
            <Card>
                <div className="w-96 bg-white rounded-md relative p-4">
                    <button
                        className="absolute top-3 right-3 text-gray-500"
                        onClick={() => setIsModalOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <h2 className="text-xl font-bold mb-4">Report New Bug</h2>

                    <input
                        type="text"
                        placeholder="Project Name"
                        className="w-full border p-2 rounded-md mb-3"
                        value={bug.projectName}
                        onChange={(e) =>
                            setBug({ ...bug, projectName: e.target.value })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Bug Title"
                        className="w-full border p-2 rounded-md mb-3"
                        value={bug.title}
                        onChange={(e) =>
                            setBug({ ...bug, title: e.target.value })
                        }
                    />

                    <textarea
                        type="text"
                        placeholder="Bug Description"
                        className="w-full border p-2 rounded-md mb-3"
                        value={bug.description}
                        onChange={(e) =>
                            setBug({ ...bug, description: e.target.value })
                        }
                    />

                    <div className="flex justify-end gap-3 mt-4">
                        <button
                            className="px-4 py-2 bg-gray-300 rounded-md"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-[#F91E34] text-green rounded-md"
                            onClick={handleReportBug}
                        >
                            Report Bug
                        </button>
                    </div>
                </div>
            </Card>
        </div>
    );
}