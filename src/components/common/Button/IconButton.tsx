import React from "react";

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "text";
  size?: "sm" | "md" | "lg";
  icon: React.ReactNode;
  label?: string;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  variant = "text",
  size = "md",
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full focus:outline-none transition-colors";

  const variantStyles = {
    primary:
      "bg-[#7B1984] text-white hover:bg-[#671571] disabled:bg-[#7B1984]/50",
    secondary:
      "bg-[#FFF9F9] border border-[#7B1984]/15 text-black hover:bg-gray-50 disabled:bg-[#FFF9F9]/50",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:text-gray-400",
    text: "text-gray-700 hover:bg-gray-100 disabled:text-gray-400",
  };

  const sizeStyles = {
    sm: label ? "p-1.5 text-xs gap-1" : "p-1.5",
    md: label ? "p-2 text-sm gap-2" : "p-2",
    lg: label ? "p-3 text-base gap-2" : "p-3",
  };

  const iconSizeStyles = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const buttonStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <button className={buttonStyles} {...props}>
      <span className={iconSizeStyles[size]}>{icon}</span>
      {label && <span>{label}</span>}
    </button>
  );
};

export default IconButton;
