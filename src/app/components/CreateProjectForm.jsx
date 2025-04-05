import { useState, useEffect, useRef } from "react";

const MultiSelectDropdown = ({ label, options, selected, setSelected }) => {
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const filteredOptions = options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelectOption = (option) => {
        if (!selected?.includes(option)) {
            setSelected([...selected, option]);
        }
    };

    const handleRemoveOption = (option) => {
        setSelected(selected.filter((item) => item !== option));
    };

    return (
        <div className="w-full relative" ref={dropdownRef}>
            <label htmlFor="dropdown" className="block font-semibold mb-1">{label}</label>
            
            <div 
                className="w-full p-2 border border-gray-300 rounded-sm mb-4 focus:outline-none focus:border-gray-600 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {selected?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selected.map((item) => (
                            <div key={item} className="flex items-center bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
                                {item}
                                <button 
                                    className="ml-2 text-white hover:text-white"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemoveOption(item);
                                    }}
                                >
                                    ✖
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">Select {label.toLowerCase()}...</p>
                )}
            </div>

            {dropdownOpen && (
                <div className="absolute w-full bg-white border border-gray-300 rounded-sm shadow-md mt-1 z-10 max-h-60 overflow-auto">
                    {/* Search input field */}
                    <input
                        type="text"
                        placeholder={`Search ${label.toLowerCase()}...`}
                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    
                    {/* Filtered options */}
                    {filteredOptions.map((option) => (
                        <div 
                            key={option} 
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectOption(option)}
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;