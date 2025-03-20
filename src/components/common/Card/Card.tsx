import React from "react";

export interface CardProps {
  children: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footerClassName?: string;
  hoverable?: boolean;
  bordered?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  contentClassName = "",
  headerClassName = "",
  footerClassName = "",
  hoverable = false,
  bordered = true,
}) => {
  const baseStyles = "bg-white rounded-lg overflow-hidden";

  const hoverStyles = hoverable ? "transition-shadow hover:shadow-md" : "";

  const borderStyles = bordered ? "border border-gray-200" : "";

  const shadowStyles = "shadow-sm";

  const cardStyles = `${baseStyles} ${hoverStyles} ${borderStyles} ${shadowStyles} ${className}`;

  const defaultContentStyles = "p-4";
  const contentStyles = `${defaultContentStyles} ${contentClassName}`;

  const defaultHeaderStyles = "px-4 py-3 border-b border-gray-200";
  const headerStyles = `${defaultHeaderStyles} ${headerClassName}`;

  const defaultFooterStyles = "px-4 py-3 border-t border-gray-200";
  const footerStyles = `${defaultFooterStyles} ${footerClassName}`;

  return (
    <div className={cardStyles}>
      {(title || subtitle) && (
        <div className={headerStyles}>
          {title && <div className="font-semibold text-gray-900">{title}</div>}
          {subtitle && (
            <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
          )}
        </div>
      )}

      <div className={contentStyles}>{children}</div>

      {footer && <div className={footerStyles}>{footer}</div>}
    </div>
  );
};

export default Card;
