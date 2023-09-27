import React, {useState, useEffect, useRef} from "react";
import './StockTable.css';

const FilterSelect = ({ options, value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectRef = useRef(null);
  
    useEffect(() => {
      const handleDocumentClick = (e) => {
        if (selectRef.current && !selectRef.current.contains(e.target)) {
          setIsOpen(false);
        }
      };
  
      if (isOpen) {
        document.addEventListener('click', handleDocumentClick);
      } else {
        document.removeEventListener('click', handleDocumentClick);
      }
  
      return () => {
        document.removeEventListener('click', handleDocumentClick);
      };
    }, [isOpen]);
  
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
  
    const handleOptionClick = (optionValue) => {
      onChange(optionValue);
      setIsOpen(false);
    };

    const selectedLabel = options.find((option) => option.value === value)?.label;

  
    return (
      <div className={`filter-select select ${isOpen ? 'open' : ''}`} onClick={toggleDropdown} ref={selectRef}>
        <div className="select-value">{selectedLabel}</div>
        <ul className="select-options">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={value === option.value ? 'is-selected' : ''}
            >
              {option.label}
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default FilterSelect;