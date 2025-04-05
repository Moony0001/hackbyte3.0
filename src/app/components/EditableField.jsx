"use client";

import { useState } from "react";

export default function EditableField({ value, onChange }) {
    const [editing, setEditing] = useState(false);
    const [tempValue, setTempValue] = useState(value);

    const handleBlur = () => {
        setEditing(false);
        onChange(tempValue);
    };

    return (
        <>
            {editing ? (
                <input
                    type="text"
                    className="border rounded px-2 py-1 w-full"
                    value={tempValue}
                    onChange={e => setTempValue(e.target.value)}
                    onBlur={handleBlur}
                    autoFocus
                />
            ) : (
                <span
                    className="cursor-pointer underline hover:text-blue-600"
                    onClick={() => setEditing(true)}
                >
                    {value}
                </span>
            )}
        </>
    );
}
