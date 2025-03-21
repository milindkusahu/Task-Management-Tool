import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "../../../utils/icons";

export interface TaskFiltersProps {
  onFilterChange: (filters: TaskFilterValues) => void;
  initialValues?: Partial<TaskFilterValues>;
}

export interface TaskFilterValues {
  category: string;
  startDate: string;
  endDate: string;
  searchText: string;
  tags: string[];
}

const TaskFilters: React.FC<TaskFiltersProps> = ({
  onFilterChange,
  initialValues = {},
}) => {
  const [filters, setFilters] = useState<TaskFilterValues>({
    category: initialValues.category || "",
    startDate: initialValues.startDate || "",
    endDate: initialValues.endDate || "",
    searchText: initialValues.searchText || "",
    tags: initialValues.tags || [],
  });

  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTagsDropdown, setShowTagsDropdown] = useState(false);
  const [newTag, setNewTag] = useState("");

  const categoryRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryRef.current &&
        !categoryRef.current.contains(event.target as Node) &&
        showCategoryDropdown
      ) {
        setShowCategoryDropdown(false);
      }

      if (
        dateRef.current &&
        !dateRef.current.contains(event.target as Node) &&
        showDateDropdown
      ) {
        setShowDateDropdown(false);
      }

      if (
        tagsRef.current &&
        !tagsRef.current.contains(event.target as Node) &&
        showTagsDropdown
      ) {
        setShowTagsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showCategoryDropdown, showDateDropdown, showTagsDropdown]);

  const handleCategorySelect = (category: string) => {
    setFilters((prev) => ({
      ...prev,
      category,
    }));
    setShowCategoryDropdown(false);
  };

  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      startDate: e.target.value,
    }));
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      endDate: e.target.value,
    }));
  };

  const clearDateFilter = () => {
    setFilters((prev) => ({
      ...prev,
      startDate: "",
      endDate: "",
    }));
    setShowDateDropdown(false);
  };

  const handleTagAdd = () => {
    if (newTag.trim() === "") return;

    setFilters((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag.trim()],
    }));

    setNewTag("");
  };

  const handleTagRemove = (tagToRemove: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-gray-600 whitespace-nowrap">Filter by:</span>
      <div className="flex gap-2">
        {/* Category filter */}
        <div className="relative filter-dropdown" ref={categoryRef}>
          <button
            onClick={() => {
              setShowCategoryDropdown(!showCategoryDropdown);
              setShowDateDropdown(false);
              setShowTagsDropdown(false);
            }}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-full bg-white text-sm"
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
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-md z-10 w-40">
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
        <div className="relative filter-dropdown" ref={dateRef}>
          <button
            onClick={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowCategoryDropdown(false);
              setShowTagsDropdown(false);
            }}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-xl bg-white text-sm"
          >
            <span>
              {filters.startDate && filters.endDate
                ? `${filters.startDate} to ${filters.endDate}`
                : filters.startDate
                ? `From ${filters.startDate}`
                : filters.endDate
                ? `Until ${filters.endDate}`
                : "Date Range"}
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showDateDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-md z-10 w-64 p-2">
              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={handleStartDateChange}
                  className="w-full p-2 border border-gray-300 rounded-full text-sm"
                />
              </div>

              <div className="mb-2">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={handleEndDateChange}
                  className="w-full p-2 border border-gray-300 rounded text-sm"
                />
              </div>

              {(filters.startDate || filters.endDate) && (
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

        {/* Tags filter */}
        <div className="relative filter-dropdown" ref={tagsRef}>
          <button
            onClick={() => {
              setShowTagsDropdown(!showTagsDropdown);
              setShowDateDropdown(false);
              setShowCategoryDropdown(false);
            }}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-full bg-white text-sm"
          >
            <span>
              {filters.tags.length > 0
                ? `Tags (${filters.tags.length})`
                : "Tags"}
            </span>
            <ChevronDownIcon className="w-4 h-4" />
          </button>

          {showTagsDropdown && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-sm shadow-md z-10 w-64 p-2">
              <div className="mb-2 flex">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 p-2 border border-gray-300 rounded-l text-sm"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleTagAdd();
                    }
                  }}
                />
                <button
                  onClick={handleTagAdd}
                  className="bg-blue-500 text-white px-3 py-2 rounded-r text-sm"
                >
                  Add
                </button>
              </div>

              {filters.tags.length > 0 ? (
                <div className="mb-2">
                  <div className="text-xs font-medium text-gray-700 mb-1">
                    Selected Tags:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {filters.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center"
                      >
                        {tag}
                        <button
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1 text-blue-500 hover:text-blue-700"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-500 mb-2">
                  No tags selected. Add tags to filter tasks.
                </div>
              )}

              {filters.tags.length > 0 && (
                <button
                  className="w-full text-left text-xs text-blue-600 hover:underline"
                  onClick={() => setFilters((prev) => ({ ...prev, tags: [] }))}
                >
                  Clear all tags
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskFilters;
