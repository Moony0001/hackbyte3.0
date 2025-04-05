"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import Dropdown from "./Dropdown"; // hypothetical reusable dropdown
import EditableField from "./EditableField"; // hypothetical inline text editor

export default function BugCard({ bug, onClose, onUpdate }) {
    const { userId, role } = useUser();

    const [editableBug, setEditableBug] = useState({ ...bug });
    const [isEditing, setIsEditing] = useState(false);
    const isManager = role === "manager";
    const isDeveloper = role === "developer";
    const isTester = role === "tester";

    const handleFieldChange = (field, value) => {
        setEditableBug(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        // make PATCH request to update bug
        const res = await fetch(`/api/bug/${bug.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(editableBug),
        });
        const data = await res.json();
        if (res.ok) {
            onUpdate(data.updatedBug);
            setIsEditing(false);
        } else {
            alert("Failed to update bug.");
        }
    };

    const handleDelete = async () => {
        const res = await fetch(`/api/bug/${bug.id}`, {
            method: "DELETE",
        });
        if (res.ok) {
            onClose();
        } else {
            alert("Failed to delete bug.");
        }
    };

    const handleClaim = async () => {
        const res = await fetch(`/api/bug/assign`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bug_id: bug.id, developer_id: userId }),
        });
        if (res.ok) {
            const data = await res.json();
            setEditableBug(prev => ({ ...prev, assigned_to: data.developerName }));
        } else {
            alert("Failed to claim bug.");
        }
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
            <div className="bg-white shadow-lg rounded-lg p-6 w-[600px] relative">
                <button className="absolute top-4 right-4 text-gray-500" onClick={onClose}>
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-4">Bug: 
                    {isTester ? (
                        <EditableField
                            value={editableBug.title}
                            onChange={val => handleFieldChange("title", val)}
                        />
                    ) : (
                        editableBug.title
                    )}
                </h2>

                <div className="space-y-2">
                    <p><span className="font-medium">Project:</span> {editableBug.project_name}</p>
                    <p><span className="font-medium">Found by:</span> {editableBug.created_by_name}</p>
                    <p><span className="font-medium">Assigned Developer:</span> 
                        {isManager ? (
                            <Dropdown
                                options={editableBug.developerOptions}
                                selected={editableBug.assigned_to}
                                onSelect={val => handleFieldChange("assigned_to", val)}
                            />
                        ) : (
                            editableBug.assigned_to || "Not assigned"
                        )}
                    </p>

                    <p>
                        <span className="font-medium">Criticality:</span>
                        {(isManager || isDeveloper) ? (
                            <Dropdown
                                options={["Low", "Medium", "High", "Critical"]}
                                selected={editableBug.criticality}
                                onSelect={val => handleFieldChange("criticality", val)}
                            />
                        ) : (
                            editableBug.criticality
                        )}
                    </p>

                    <p>
                        <span className="font-medium">Status:</span>
                        {(isManager || isDeveloper) ? (
                            <Dropdown
                                options={["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]}
                                selected={editableBug.status}
                                onSelect={val => handleFieldChange("status", val)}
                            />
                        ) : (
                            editableBug.status
                        )}
                    </p>

                    <p>
                        <span className="font-medium">Tag:</span>
                        {(isManager || isDeveloper) ? (
                            <Dropdown
                                options={["UI", "Backend", "Logic", "Performance"]}
                                selected={editableBug.tag}
                                onSelect={val => handleFieldChange("tag", val)}
                            />
                        ) : (
                            editableBug.tag
                        )}
                    </p>

                    <p>
                        <span className="font-medium">Component:</span>
                        {(isManager || isDeveloper) ? (
                            <Dropdown
                                options={["Navbar", "Sidebar", "Login", "Dashboard", "not provided"]}
                                selected={editableBug.component}
                                onSelect={val => handleFieldChange("component", val)}
                            />
                        ) : (
                            editableBug.component
                        )}
                    </p>

                    <p>
                        <span className="font-medium">Description:</span><br />
                        {isTester ? (
                            <EditableField
                                value={editableBug.description}
                                onChange={val => handleFieldChange("description", val)}
                            />
                        ) : (
                            <span>{editableBug.description}</span>
                        )}
                    </p>

                    {editableBug.status === "CLOSED" && (
                        <p>
                            <span className="font-medium">Closure Reason:</span><br />
                            {editableBug.solution || "No solution provided."}
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    {(isManager || isDeveloper) && (
                        <button
                            onClick={handleDelete}
                            className="px-4 py-2 bg-red-500 text-white rounded-md"
                        >
                            Delete
                        </button>
                    )}
                    {isDeveloper && !editableBug.assigned_to && (
                        <button
                            onClick={handleClaim}
                            className="px-4 py-2 bg-green-500 text-white rounded-md"
                        >
                            Claim
                        </button>
                    )}
                    {(isManager || isDeveloper || isTester) && (
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-500 text-white rounded-md"
                        >
                            Save Changes
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
