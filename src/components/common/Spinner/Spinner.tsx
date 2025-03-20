import React from "react";

export interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "white";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  color = "primary",
  className = "",
}) => {
  const sizeStyles = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const colorStyles = {
    primary: "border-[#7B1984]",
    secondary: "border-gray-400",
    white: "border-white",
  };

  const spinnerStyles = `animate-spin rounded-full border-t-2 border-b-2 ${sizeStyles[size]} ${colorStyles[color]} ${className}`;

  return (
    <div className="inline-flex">
      <div className={spinnerStyles}></div>
    </div>
  );
};

export default Spinner;
