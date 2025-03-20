import React from "react";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
  label?: React.ReactNode;
  labelPosition?: "start" | "center" | "end";
}

const Divider: React.FC<DividerProps> = ({
  orientation = "horizontal",
  className = "",
  label,
  labelPosition = "center",
}) => {
  const baseStyles =
    orientation === "horizontal"
      ? "border-t border-gray-200 w-full"
      : "border-l border-gray-200 h-full";

  const dividerStyles = `${baseStyles} ${className}`;

  if (!label) {
    return <div className={dividerStyles}></div>;
  }

  const labelContainerStyles = {
    horizontal: {
      base: "flex items-center",
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    },
    vertical: {
      base: "flex flex-col items-center",
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
    },
  };

  const containerStyles =
    orientation === "horizontal"
      ? `${labelContainerStyles.horizontal.base} ${labelContainerStyles.horizontal[labelPosition]}`
      : `${labelContainerStyles.vertical.base} ${labelContainerStyles.vertical[labelPosition]}`;

  const labelStyles =
    orientation === "horizontal"
      ? "px-2 text-sm text-gray-500"
      : "py-2 text-sm text-gray-500";

  return (
    <div className={containerStyles}>
      {orientation === "horizontal" ? (
        <>
          {labelPosition === "start" ? (
            <>
              <span className={labelStyles}>{label}</span>
              <div className={dividerStyles}></div>
            </>
          ) : labelPosition === "end" ? (
            <>
              <div className={dividerStyles}></div>
              <span className={labelStyles}>{label}</span>
            </>
          ) : (
            <>
              <div className={dividerStyles}></div>
              <span className={labelStyles}>{label}</span>
              <div className={dividerStyles}></div>
            </>
          )}
        </>
      ) : (
        <>
          {labelPosition === "start" ? (
            <>
              <span className={labelStyles}>{label}</span>
              <div className={dividerStyles}></div>
            </>
          ) : labelPosition === "end" ? (
            <>
              <div className={dividerStyles}></div>
              <span className={labelStyles}>{label}</span>
            </>
          ) : (
            <>
              <div className={dividerStyles}></div>
              <span className={labelStyles}>{label}</span>
              <div className={dividerStyles}></div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Divider;
