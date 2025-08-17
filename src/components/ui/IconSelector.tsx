"use client";

import React, { useState } from "react";
import { Input, Button, Card, CardBody, Chip } from "@heroui/react";
import { ICON_OPTIONS, IconKey, CategoryIcon } from "./CategoryIcons";

interface IconSelectorProps {
  selectedIcon: string;
  onIconSelect: (iconKey: IconKey) => void;
  className?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  selectedIcon,
  onIconSelect,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // Filtrar iconos basado en el término de búsqueda
  const filteredIcons = ICON_OPTIONS.filter(
    (option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Obtener el label del icono seleccionado
  const selectedIconLabel =
    ICON_OPTIONS.find((option) => option.value === selectedIcon)?.shortLabel ||
    selectedIcon;

  return (
    <div className={`w-full ${className}`}>
      {/* Header con icono seleccionado */}
      <Card className="mb-4">
        <CardBody className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-default-700">
                  Icono:
                </span>
                <Chip
                  startContent={
                    <CategoryIcon
                      iconKey={selectedIcon as IconKey}
                      className="w-4 h-4"
                    />
                  }
                  variant="flat"
                  color="primary"
                  size="sm"
                >
                  {selectedIconLabel}
                </Chip>
              </div>
            </div>
            <Button
              size="sm"
              variant={isExpanded ? "solid" : "flat"}
              color={isExpanded ? "danger" : "primary"}
              onPress={() => setIsExpanded(!isExpanded)}
              className="min-w-20"
            >
              {isExpanded ? "Cerrar" : "Cambiar"}
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Panel expandible con cuadrícula de iconos */}
      {isExpanded && (
        <Card className="border border-default-200 shadow-lg">
          <CardBody className="p-6">
            {/* Barra de búsqueda */}
            <div className="mb-6">
              <Input
                placeholder="Buscar iconos por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="md"
                variant="bordered"
                startContent={
                  <svg
                    className="w-5 h-5 text-default-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                }
                classNames={{
                  input: "text-sm",
                  inputWrapper: "bg-default-50",
                }}
              />
            </div>

            {/* Contador de resultados */}
            <div className="mb-4">
              <p className="text-sm text-default-500">
                {filteredIcons.length} icono
                {filteredIcons.length !== 1 ? "s" : ""} disponible
                {filteredIcons.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Cuadrícula de iconos */}
            <div className="grid grid-cols-4 gap-4 max-h-80 overflow-y-auto p-2 rounded-lg bg-default-50/50">
              {filteredIcons.map((option) => (
                <div
                  key={option.value}
                  className="flex flex-col items-center group"
                >
                  <button
                    type="button"
                    className={`
                      relative flex items-center justify-center p-4 rounded-2xl border-2 transition-all duration-300
                      hover:scale-105 hover:shadow-xl hover:-translate-y-1
                      w-16 h-16 
                      ${
                        selectedIcon === option.value
                          ? "border-primary-500 text-primary-600 shadow-lg scale-105 ring-2 ring-primary-200"
                          : "border-default-200 bg-white text-default-600 hover:border-primary-300  group-hover:text-primary-600"
                      }
                    `}
                    onClick={() => {
                      onIconSelect(option.value);
                      setIsExpanded(false);
                    }}
                  >
                    <CategoryIcon
                      iconKey={option.value}
                      className={`w-8 h-8 transition-transform duration-300 group-hover:scale-110 ${
                        selectedIcon === option.value ? "scale-110" : ""
                      }`}
                    />

                    {/* Indicador de selección */}
                    {selectedIcon === option.value && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary-500 rounded-full flex items-center justify-center">
                        <svg
                          width="30"
                          height="30"
                          className="w-3.5 h-3.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    )}
                  </button>

                  {/* Etiqueta del icono */}
                  <span
                    className={`mt-2 text-xs text-center leading-tight transition-colors duration-200 ${
                      selectedIcon === option.value
                        ? "text-primary-600 font-medium"
                        : "text-default-500 group-hover:text-primary-600"
                    }`}
                  >
                    {option.shortLabel || option.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Mensaje cuando no hay resultados */}
            {filteredIcons.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-default-100 rounded-full flex items-center justify-center">
                  <svg
                    width={30}
                    height={30}
                    className="w-8 h-8 text-default-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
                    />
                  </svg>
                </div>
                <p className="text-default-500 font-medium">
                  No se encontraron iconos
                </p>
                <p className="text-default-400 text-sm mt-1">
                  Intenta con otros términos de búsqueda
                </p>
              </div>
            )}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default IconSelector;
