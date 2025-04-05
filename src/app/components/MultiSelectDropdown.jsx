import { useState, useEffect, useRef } from "react";

const MultiSelectDropdown = ({ label, options, selected, setSelected }) => {
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const filteredOptions = options.filter((option) =>
        option.name.toLowerCase().includes(searchTerm.toLowerCase())
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
        if (!selected.some((item) => item.id === option.id)) {
            setSelected([...selected, option]);
        }
    };

    const handleRemoveOption = (option) => {
        setSelected(selected.filter((item) => item.id !== option.id));
    };

    return (
        <div className="w-full relative" ref={dropdownRef}>
            <label htmlFor="dropdown" className="block font-semibold mb-1">
                {label}
            </label>

            <div
                className="w-full p-2 border border-gray-300 rounded-sm mb-4 focus:outline-none focus:border-gray-600 cursor-pointer"
                onClick={() => setDropdownOpen(!dropdownOpen)}
            >
                {selected?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {selected.map((item) => (
                            <div
                                key={item.id}
                                className="flex items-center bg-blue-500 text-green px-3 py-1 rounded-full text-sm"
                            >
                                {item.name}
                                <button
                                    className="ml-2 text-green hover:text-green"
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
                    <input
                        type="text"
                        placeholder={`Search ${label.toLowerCase()}...`}
                        className="w-full p-2 border-b border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    {filteredOptions.map((option) => (
                        <div
                            key={option.id}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelectOption(option)}
                        >
                            {option.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;