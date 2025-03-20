import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  isLoading = false,
  className = "",
  disabled,
  ...props
}) => {
  const baseStyles =
    "font-semibold rounded-[41px] focus:outline-none transition-colors";

  const variantStyles = {
    primary:
      "bg-[#7B1984] text-white hover:bg-[#671571] disabled:bg-[#7B1984]/50",
    secondary:
      "bg-[#FFF9F9] border border-[#7B1984]/15 text-black hover:bg-gray-50 disabled:bg-[#FFF9F9]/50",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400",
    text: "text-gray-700 hover:bg-gray-50 disabled:text-gray-400",
  };

  const sizeStyles = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-2 text-base",
    lg: "px-10 py-3.5 text-base",
  };

  const widthStyles = fullWidth ? "w-full" : "";

  const loadingStyles = isLoading ? "opacity-80 cursor-wait" : "";

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyles} ${loadingStyles} ${className}`;

  return (
    <button
      className={buttonStyles}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-3 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{children}</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
