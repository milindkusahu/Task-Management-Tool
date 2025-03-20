import React, { forwardRef } from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      fullWidth = false,
      className = "",
      leftIcon,
      rightIcon,
      id,
      ...props
    },
    ref
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const baseInputStyles =
      "rounded-md border bg-white px-3 py-2 focus:outline-none focus:ring-1";

    const stateStyles = error
      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
      : "border-gray-300 focus:border-[#7B1984] focus:ring-[#7B1984]";

    const widthStyles = fullWidth ? "w-full" : "";

    const iconPaddingStyles = leftIcon ? "pl-9" : rightIcon ? "pr-9" : "";

    const inputStyles = `${baseInputStyles} ${stateStyles} ${widthStyles} ${iconPaddingStyles} ${className}`;

    return (
      <div className={`${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {leftIcon}
            </span>
          )}

          <input ref={ref} id={inputId} className={inputStyles} {...props} />

          {rightIcon && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              {rightIcon}
            </span>
          )}
        </div>

        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
