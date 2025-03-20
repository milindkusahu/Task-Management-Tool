import React from "react";

export interface NoResultsProps {
  message?: string;
  imageSrc?: string;
  className?: string;
}

const NoResults: React.FC<NoResultsProps> = ({
  message = "It looks like we can't find any results that match.",
  imageSrc = "/not-found.png",
  className = "",
}) => {
  return (
    <div
      className={`w-full flex flex-col items-center justify-center py-16 ${className}`}
    >
      <img
        src={imageSrc}
        alt="No results found"
        className="w-32 h-32 mb-4 opacity-80"
      />
      <p className="text-center text-gray-600">{message}</p>
    </div>
  );
};

export default NoResults;
