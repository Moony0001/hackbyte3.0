import { useState } from "react";
import Card from "./Card";
import { X } from "lucide-react";

export default function NewBugForm({ setIsModalOpen }) {
    const [bug, setBug] = useState({
        projectName: "",
        title: "",
        description: "",
    });

    const handleReportBug = () => {
        setIsModalOpen(false);
        setBug({
            projectName: "",
            title: "",
            description: "",
        });
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