import React, { useState, useEffect } from "react";
import { ChevronDownIcon } from "../../../utils/icons";

export interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilterValues) => void;
  initialValues?: Partial<TaskFilterValues>;
}

export interface TaskFilterValues {
  category: string;
  dueDate: string;
  searchText: string;
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFilterChange,
  initialValues = {},
}) => {
  const [filters, setFilters] = useState<TaskFilterValues>({
    category: initialValues.category || "",
    dueDate: initialValues.dueDate || "",
    searchText: initialValues.searchText || "",
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  useEffect(() => {
    onFilterChange(filters);
    // Ensure we close dropdowns when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (showCategoryDropdown || showDateDropdown) {
        if (!(event.target as Element).closest(".filter-dropdown")) {
          setShowCategoryDropdown(false);
          setShowDateDropdown(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [filters, onFilterChange, showCategoryDropdown, showDateDropdown]);

  const handleCategorySelect = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));
    setShowCategoryDropdown(false);
  };

  const handleDueDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      dueDate: e.target.value,
    }));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      searchText: e.target.value,
    }));
  };

  const clearDateFilter = () => {
    setFilters((prev) => ({
      ...prev,
      dueDate: "",
    }));
    setShowDateDropdown(false);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-600 whitespace-nowrap">Filter by:</span>

        {/* Category filter */}
        <div className="relative filter-dropdown">
          <button
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowDateDropdown(false);
            }}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded bg-white text-sm"
          >
            <span>
              {filters.category === "WORK"
                ? "Work"
                : filters.category === "PERSONAL"
                ? "Personal"
                : "All Categories"}
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showCategoryDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-md z-10 w-40">
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                onClick={() => handleCategorySelect("")}
              >
                All Categories
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                onClick={() => handleCategorySelect("WORK")}
              >
                Work
              </button>
              <button
                className="w-full text-left px-3 py-2 hover:bg-gray-100 text-sm"
                onClick={() => handleCategorySelect("PERSONAL")}
              >
                Personal
              </button>
            </div>
          )}
        </div>

        {/* Due date filter */}
        <div className="relative filter-dropdown">
          <button
            onClick={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowCategoryDropdown(false);
            }}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded bg-white text-sm"
          >
            <span>{filters.dueDate || "Due Date"}</span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showDateDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-md z-10 w-48 p-2">
              <input
                type="date"
                value={filters.dueDate}
                onChange={handleDueDateChange}
                className="w-full p-2 border border-gray-300 rounded text-sm mb-2"
              />
              {filters.dueDate && (
                <button
                  className="w-full text-left text-xs text-blue-600 hover:underline"
                  onClick={clearDateFilter}
                >
                  Clear date filter
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Search input */}
      <div className="w-full md:w-auto">
        <div className="relative">
          <input
            type="text"
            value={filters.searchText}
            onChange={handleSearchChange}
            placeholder="Search tasks"
            className="w-full md:w-64 pl-8 pr-3 py-1.5 rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
