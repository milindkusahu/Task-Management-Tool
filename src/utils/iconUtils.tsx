import React from "react";

export interface IconProps {
  width?: number | string;
  height?: number | string;
  color?: string;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const createIcon = (
  svgPath: React.ReactNode,
  viewBox: string = "0 0 24 24"
) => {
  const IconComponent: React.FC<IconProps> = ({
    width = 24,
    height = 24,
    color = "currentColor",
    className = "",
    style = {},
    onClick,
    ...props
  }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      stroke={color}
      className={className}
      style={{ color, ...style }}
      onClick={onClick}
      {...props}
    >
      {svgPath}
    </svg>
  );

  return IconComponent;
};
