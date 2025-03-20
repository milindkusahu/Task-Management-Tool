import React from "react";
import { SortDirection } from "../../../utils/sortUtils";

export interface SortIndicatorProps {
  direction: SortDirection | null;
  onClick: () => void;
  className?: string;
}

const SortIndicator: React.FC<SortIndicatorProps> = ({
  direction,
  onClick,
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex flex-col items-center justify-center focus:outline-none ${className}`}
      aria-label={
        direction === "asc"
          ? "Sort ascending"
          : direction === "desc"
          ? "Sort descending"
          : "Sort"
      }
    >
      {/* Up arrow */}
      <svg
        width="8"
        height="4"
        viewBox="0 0 8 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`mb-0.5 ${
          direction === "asc" ? "text-blue-600" : "text-gray-400"
        }`}
      >
        <path d="M4 0L7.4641 3H0.535898L4 0Z" fill="currentColor" />
      </svg>

      {/* Down arrow */}
      <svg
        width="8"
        height="4"
        viewBox="0 0 8 4"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`${
          direction === "desc" ? "text-blue-600" : "text-gray-400"
        }`}
      >
        <path d="M4 4L0.535898 1L7.4641 1L4 4Z" fill="currentColor" />
      </svg>
    </button>
  );
};

export default SortIndicator;
