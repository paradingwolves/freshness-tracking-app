import React, {useState, useEffect} from "react";
import './StockTable.css';

const FilterSelect = ({ options, selectedFilter, onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleOptionClick = (optionValue) => {
        onFilterChange(optionValue);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleDocumentClick = (e) => {
            if (!e.target.classList.contains("select-value")) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("click", handleDocumentClick);
        } else {
            document.removeEventListener("click", handleDocumentClick);
        }

        return () => {
            document.removeEventListener("click", handleDocumentClick);
        };
    }, [isOpen]);

    return (
        <div className={`filter-select select ${isOpen ? "open" : ""}`}>
            <div className="select-value" onClick={toggleDropdown}>
                {options.find((option) => option.value === selectedFilter)?.label}
            </div>
            <ul className="select-options">
                {options.map((option) => (
                    <li
                        key={option.value}
                        onClick={() => handleOptionClick(option.value)}
                        className={selectedFilter === option.value ? "is-selected" : ""}
                    >
                        {option.label}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FilterSelect;