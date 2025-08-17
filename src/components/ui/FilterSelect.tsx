import React from 'react';
import { Select, SelectItem } from '@heroui/react';

interface FilterSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { key: string; label: string }[];
  placeholder?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'flat' | 'bordered' | 'faded' | 'underlined';
  disabled?: boolean;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Filtrar...',
  className = '',
  size = 'md',
  variant = 'bordered',
  disabled = false,
}) => {
  return (
    <Select
      selectedKeys={value ? [value] : []}
      onSelectionChange={(keys) => {
        const selectedValue = Array.from(keys)[0] as string;
        onChange(selectedValue || '');
      }}
      placeholder={placeholder}
      className={className}
      size={size}
      variant={variant}
      disabled={disabled}
    >
      {options.map((option) => (
        <SelectItem key={option.key}>
          {option.label}
        </SelectItem>
      ))}
    </Select>
  );
};

export default FilterSelect;