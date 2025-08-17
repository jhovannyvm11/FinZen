"use client";

import React, { useState } from "react";
import { Card, CardBody, Button, Chip } from "@heroui/react";
import { CategoryIcon } from "./CategoryIcons";
import type { IconKey } from "./CategoryIcons";
import { Category } from "@/lib/supabase";

export interface SelectableItem {
  id: string;
  name: string;
  category?: Category;
  [key: string]: unknown;
}

interface CategorySelectorProps {
  items: SelectableItem[];
  selectedItemId?: string;
  onItemSelect: (item: SelectableItem) => void;
  className?: string;
  title?: string;
  emptyMessage?: string;
  showCategoryInfo?: boolean;
  multiSelect?: boolean;
  selectedItemIds?: string[];
  onMultiSelect?: (items: SelectableItem[]) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  items,
  selectedItemId,
  onItemSelect,
  className = "",
  title = "Seleccionar elemento",
  emptyMessage = "No hay elementos disponibles",
  showCategoryInfo = true,
  multiSelect = false,
  selectedItemIds = [],
  onMultiSelect,
}) => {
  const [hoveredItemId, setHoveredItemId] = useState<string | null>(null);

  const handleItemClick = (item: SelectableItem) => {
    if (multiSelect && onMultiSelect) {
      const isSelected = selectedItemIds.includes(item.id);
      let newSelectedItems: SelectableItem[];
      
      if (isSelected) {
        // Remove from selection
        newSelectedItems = items.filter(i => 
          selectedItemIds.includes(i.id) && i.id !== item.id
        );
      } else {
        // Add to selection
        newSelectedItems = [
          ...items.filter(i => selectedItemIds.includes(i.id)),
          item
        ];
      }
      
      onMultiSelect(newSelectedItems);
    } else {
      onItemSelect(item);
    }
  };

  const isItemSelected = (itemId: string) => {
    if (multiSelect) {
      return selectedItemIds.includes(itemId);
    }
    return selectedItemId === itemId;
  };

  const getItemBackgroundColor = (item: SelectableItem, isSelected: boolean, isHovered: boolean) => {
    if (!item.category?.color) {
      return isSelected 
        ? "bg-primary-100 border-primary-300" 
        : isHovered 
        ? "bg-default-100 border-default-300" 
        : "bg-white border-default-200";
    }

    const color = item.category.color;
    
    if (isSelected) {
      return {
        backgroundColor: `${color}20`, // 20% opacity
        borderColor: color,
        borderWidth: '2px'
      };
    }
    
    if (isHovered) {
      return {
        backgroundColor: `${color}10`, // 10% opacity
        borderColor: `${color}80`, // 80% opacity
        borderWidth: '1px'
      };
    }
    
    return {
      backgroundColor: 'white',
      borderColor: '#e4e4e7', // default border color
      borderWidth: '1px'
    };
  };

  const getTextColor = (item: SelectableItem, isSelected: boolean) => {
    if (!item.category?.color || !isSelected) {
      return isSelected ? "text-primary-700" : "text-default-700";
    }
    
    // Use a darker version of the category color for text when selected
    return { color: item.category.color };
  };

  if (items.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardBody className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-default-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2m0 0V9a2 2 0 012-2h2m0 0V6a2 2 0 012-2h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9a2 2 0 012 2v2m0 0v2a2 2 0 01-2 2h-2m0 0H9a2 2 0 01-2-2v-2m0 0H6a2 2 0 01-2-2V9a2 2 0 012-2h1m0 0V6a2 2 0 012-2h4.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V9a2 2 0 012 2v2" />
            </svg>
          </div>
          <p className="text-default-500 font-medium">{emptyMessage}</p>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardBody className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-default-700 mb-2">{title}</h3>
          {multiSelect && (
            <p className="text-sm text-default-500">
              {selectedItemIds.length} elemento{selectedItemIds.length !== 1 ? 's' : ''} seleccionado{selectedItemIds.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => {
            const isSelected = isItemSelected(item.id);
            const isHovered = hoveredItemId === item.id;
            const backgroundStyle = getItemBackgroundColor(item, isSelected, isHovered);
            const textStyle = getTextColor(item, isSelected);

            return (
              <Button
                key={item.id}
                variant="flat"
                className={`
                  h-auto p-4 justify-start transition-all duration-300 hover:scale-105 hover:shadow-lg
                  ${typeof backgroundStyle === 'string' ? backgroundStyle : ''}
                `}
                style={typeof backgroundStyle === 'object' ? backgroundStyle : {}}
                onPress={() => handleItemClick(item)}
                onMouseEnter={() => setHoveredItemId(item.id)}
                onMouseLeave={() => setHoveredItemId(null)}
              >
                <div className="flex items-center gap-3 w-full">
                  {/* Category Icon */}
                  {item.category && (
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ring-1 ring-white/20"
                      style={{ backgroundColor: item.category.color }}
                    >
                      <CategoryIcon
                        iconKey={item.category.icon as IconKey}
                        className="w-5 h-5"
                        color="white"
                      />
                    </div>
                  )}

                  {/* Item Info */}
                  <div className="flex-1 text-left">
                    <h4 
                      className="font-semibold text-sm mb-1"
                      style={typeof textStyle === 'object' ? textStyle : {}}
                    >
                      {item.name}
                    </h4>
                    
                    {showCategoryInfo && item.category && (
                      <div className="flex items-center gap-2">
                        <Chip
                          size="sm"
                          variant="flat"
                          className="text-xs"
                          style={{
                            backgroundColor: `${item.category.color}20`,
                            color: item.category.color
                          }}
                        >
                          {item.category.name}
                        </Chip>
                      </div>
                    )}
                  </div>

                  {/* Selection Indicator */}
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: item.category?.color || '#0070f3' }}
                      >
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {/* Multi-select actions */}
        {multiSelect && selectedItemIds.length > 0 && (
          <div className="mt-6 pt-4 border-t border-default-200">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="flat"
                color="danger"
                onPress={() => onMultiSelect && onMultiSelect([])}
              >
                Limpiar selección
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                onPress={() => onMultiSelect && onMultiSelect(items)}
              >
                Seleccionar todo
              </Button>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default CategorySelector;