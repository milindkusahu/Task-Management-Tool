import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "success"
    | "warning"
    | "error"
    | "info"
    | "work"
    | "personal";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "default",
  size = "md",
  className = "",
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-full font-medium";

  const variantStyles = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
    work: "bg-purple-100 text-purple-800",
    personal: "bg-orange-100 text-orange-800",
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  };

  const badgeStyles = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return <span className={badgeStyles}>{children}</span>;
};

export default Badge;
