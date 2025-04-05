import { useRef, useState, useEffect } from "react";

export default function DropdownSelect({ label, options, selectedValue, setSelectedValue, isRole }) {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [customValue, setCustomValue] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="w-full relative mb-4" ref={dropdownRef}>
            <label className="font-medium">{label}</label>

            <div 
                className="w-full p-2 border border-gray-600 rounded-md cursor-pointer focus:outline-none focus:border-gray-600 h-10"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {selectedValue && (
                    <span>{selectedValue}</span>
                )}
            </div>

            {dropdownOpen && (
                <div className="absolute w-full bg-white border border-gray-600 rounded-md shadow-md mt-1 z-10">
                    {!isRole && (
                        <input
                            type="text"
                            placeholder={`Search ${label.toLowerCase()}...`}
                            className="w-full p-2 border-b border-gray-600 focus:outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    )}


                    {filteredOptions.map((option) => (
                        <div 
                            key={option} 
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => {
                                setSelectedValue(option);
                                setDropdownOpen(false);
                                setSearchTerm(""); 
                            }}
                        >
                            {option}
                        </div>
                    ))}

                    {!isRole && (
                        <>
                            <div 
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => setCustomValue("")}
                            >
                                Other...
                            </div>

                            {customValue !== null && (
                                <input
                                    type="text"
                                    placeholder={`Enter custom ${label.toLowerCase()}`}
                                    className="w-full p-2 border-t border-gray-600 focus:outline-none"
                                    value={customValue}
                                    onChange={(e) => setCustomValue(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && customValue.trim() !== "") {
                                            setSelectedValue(customValue.trim());
                                            setDropdownOpen(false);
                                            setSearchTerm(""); 
                                        }
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
