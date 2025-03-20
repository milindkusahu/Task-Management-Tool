import React, { forwardRef } from "react";

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, className = "", id, ...props }, ref) => {
    // Generate a unique ID if none provided
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;

    return (
      <div className="flex items-start">
        <div className="flex items-center h-5">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className={`focus:ring-[#7B1984] h-4 w-4 text-[#7B1984] border-gray-300 rounded ${className}`}
            {...props}
          />
        </div>

        {label && (
          <div className="ml-3 text-sm">
            <label htmlFor={checkboxId} className="font-medium text-gray-700">
              {label}
            </label>

            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
