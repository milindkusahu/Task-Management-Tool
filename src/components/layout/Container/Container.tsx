import React from "react";

export interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  padding?: boolean;
  className?: string;
}

const Container: React.FC<ContainerProps> = ({
  children,
  maxWidth = "xl",
  padding = true,
  className = "",
}) => {
  const maxWidthStyles = {
    xs: "max-w-xs",
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-[1402px]",
    full: "max-w-full",
  };

  const paddingStyles = padding ? "px-4 md:px-8" : "";

  const containerStyles = `mx-auto ${maxWidthStyles[maxWidth]} ${paddingStyles} ${className}`;

  return <div className={containerStyles}>{children}</div>;
};

export default Container;
