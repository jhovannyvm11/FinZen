import React from 'react';
import { Input } from '@heroui/react';

// Search icon component
const SearchIcon = () => (
  <svg
    className="h-4 w-4 text-default-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined';
  disabled?: boolean;
  isClearable?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Buscar...',
  className = '',
  size = 'md',
  variant = 'bordered',
  disabled = false,
  isClearable = true,
}) => {
  return (
    <Input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={className}
      size={size}
      variant={variant}
      disabled={disabled}
      isClearable={isClearable}
      startContent={<SearchIcon />}
    />
  );
};

export default SearchInput;
