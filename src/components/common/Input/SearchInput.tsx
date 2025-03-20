import React from "react";
import { SearchIcon } from "../../../utils/icons";
import Input, { InputProps } from "./Input";

export interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
  onSearch?: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onSearch,
  placeholder = "Search",
  className = "",
  ...props
}) => {
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onSearch && typeof value === "string") {
      onSearch(value);
    }
  };

  return (
    <Input
      leftIcon={<SearchIcon className="w-[18px] h-[18px]" />}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onKeyPress={handleKeyPress}
      className={`rounded-[60px] ${className}`}
      {...props}
    />
  );
};

export default SearchInput;
