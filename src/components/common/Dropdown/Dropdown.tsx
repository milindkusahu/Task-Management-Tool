import React, { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "../../../utils/icons";

export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  fullWidth?: boolean;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  label,
  error,
  fullWidth = false,
  className = "",
  buttonClassName = "",
  disabled = false,
  icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  };

  const baseButtonStyles =
    "flex items-center justify-between px-3 py-2 border rounded-md focus:outline-none";

  const stateButtonStyles = disabled
    ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-300"
    : error
    ? "border-red-500 focus:ring-1 focus:ring-red-500"
    : "border-gray-300 hover:border-gray-400 focus:border-[#7B1984] focus:ring-1 focus:ring-[#7B1984]";

  const widthStyles = fullWidth ? "w-full" : "";

  const buttonStyles = `${baseButtonStyles} ${stateButtonStyles} ${widthStyles} ${buttonClassName}`;

  return (
    <div
      className={`relative ${fullWidth ? "w-full" : ""} ${className}`}
      ref={dropdownRef}
    >
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <button
        type="button"
        className={buttonStyles}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="flex items-center">
          {icon && <span className="mr-2">{icon}</span>}
          <span className={!selectedOption ? "text-gray-500" : ""}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </span>
        <ChevronDownIcon className="w-5 h-5 text-gray-400" />
      </button>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <ul className="py-1" role="listbox" aria-labelledby="dropdown-button">
            {options.map((option) => (
              <li
                key={option.value}
                className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                  option.value === value ? "bg-[#7B1984]/10 font-medium" : ""
                }`}
                onClick={() => handleSelect(option.value)}
                role="option"
                aria-selected={option.value === value}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
