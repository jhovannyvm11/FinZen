"use client";

import React from "react";

// Interfaz para propiedades de iconos SVG
export interface SVGIconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  color?: string;
  strokeWidth?: string | number;
}

// Función para crear iconos SVG parametrizables
const createSVGIcon = (
  pathContent: React.ReactNode,
  { width = 24, height = 24, className, color = "currentColor", strokeWidth = 2 }: SVGIconProps = {}
) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    className={className}
  >
    {pathContent}
  </svg>
);

// Definiciones de paths para cada icono
const iconPaths: Record<string, React.ReactNode> = {
  groceries: <path d="M3 3h2l.4 2M7 13h10l4-8H5.4m1.6 8L6 5H2m5 8v6a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6m-10 0h10" />,
  "credit-card": (
    <>
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </>
  ),
  transportation: (
    <>
      <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
      <path d="M5 17h-2v-6l2-5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6m-6 -6h15m-6 0v-5" />
    </>
  ),
  shopping: <path d="M19 7h-3V6a4 4 0 0 0-8 0v1H5a1 1 0 0 0-1 1v11a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V8a1 1 0 0 0-1-1zM10 6a2 2 0 0 1 4 0v1h-4V6zm8 15a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V9h2v1a1 1 0 0 0 2 0V9h4v1a1 1 0 0 0 2 0V9h2v12z" />,
  house: (
    <>
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </>
  ),
  health: <path d="M22 12h-4l-3 9L9 3l-3 9H2" />,
  education: (
    <>
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </>
  ),
  travel: (
    <>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="7.5,4.21 12,6.81 16.5,4.21" />
      <polyline points="7.5,19.79 7.5,14.6 3,12" />
      <polyline points="21,12 16.5,14.6 16.5,19.79" />
      <polyline points="12,22.81 12,17" />
    </>
  ),
  income: (
    <>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  freelance: (
    <>
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </>
  ),
  bonus: <polygon points="12,2 15.09,8.26 22,9 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9 8.91,8.26" />,
  restaurant: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </>
  ),
  entertainment: (
    <>
      <polygon points="23,7 16,12 23,17" />
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
    </>
  ),
  utilities: <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  gym: (
    <>
      <path d="M6.5 6.5h11" />
      <path d="M6.5 17.5h11" />
      <path d="M6.5 12h11" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  pets: (
    <>
      <circle cx="11.5" cy="8.5" r="2.5" />
      <path d="M11.5 15.5c-4 0-7 2-7 5h14c0-3-3-5-7-5z" />
      <path d="M15.5 8.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
    </>
  ),
  gifts: (
    <>
      <polyline points="20,12 20,22 4,22 4,12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </>
  ),
};

// Función para crear iconos parametrizables
export const createCategoryIcons = (props?: SVGIconProps): Record<string, React.ReactNode> => {
  const icons: Record<string, React.ReactNode> = {};
  
  Object.entries(iconPaths).forEach(([key, pathContent]) => {
    icons[key] = createSVGIcon(pathContent, props);
  });
  
  return icons;
};

// Iconos con valores por defecto para compatibilidad
export const CategoryIcons: Record<string, React.ReactNode> = createCategoryIcons({ width: 24, height: 24 });

export type IconKey = keyof typeof CategoryIcons;

// Interfaz para opciones de iconos
export interface IconOption {
  value: IconKey;
  label: string;
  shortLabel: string;
  icon: React.ReactNode;
}

// Opciones de iconos para selectores
export const ICON_OPTIONS = [
  {
    value: "groceries" as IconKey,
    label: "Comestibles",
    shortLabel: "Comida",
    icon: CategoryIcons.groceries,
  },
  {
    value: "credit-card" as IconKey,
    label: "Tarjeta de Crédito",
    shortLabel: "Tarjeta",
    icon: CategoryIcons["credit-card"],
  },
  {
    value: "transportation" as IconKey,
    label: "Transporte",
    shortLabel: "Transporte",
    icon: CategoryIcons.transportation,
  },
  {
    value: "shopping" as IconKey,
    label: "Compras",
    shortLabel: "Compras",
    icon: CategoryIcons.shopping,
  },
  {
    value: "house" as IconKey,
    label: "Casa/Facturas",
    shortLabel: "Casa",
    icon: CategoryIcons.house,
  },
  {
    value: "health" as IconKey,
    label: "Salud",
    shortLabel: "Salud",
    icon: CategoryIcons.health,
  },
  {
    value: "education" as IconKey,
    label: "Educación",
    shortLabel: "Educación",
    icon: CategoryIcons.education,
  },
  {
    value: "travel" as IconKey,
    label: "Viajes",
    shortLabel: "Viajes",
    icon: CategoryIcons.travel,
  },
  {
    value: "income" as IconKey,
    label: "Ingresos",
    shortLabel: "Ingresos",
    icon: CategoryIcons.income,
  },
  {
    value: "freelance" as IconKey,
    label: "Freelance",
    shortLabel: "Freelance",
    icon: CategoryIcons.freelance,
  },
  {
    value: "bonus" as IconKey,
    label: "Bonificación",
    shortLabel: "Bonus",
    icon: CategoryIcons.bonus,
  },
  {
    value: "restaurant" as IconKey,
    label: "Restaurante",
    shortLabel: "Comida",
    icon: CategoryIcons.restaurant,
  },
  {
    value: "entertainment" as IconKey,
    label: "Entretenimiento",
    shortLabel: "Diversión",
    icon: CategoryIcons.entertainment,
  },
  {
    value: "utilities" as IconKey,
    label: "Servicios Públicos",
    shortLabel: "Servicios",
    icon: CategoryIcons.utilities,
  },
  {
    value: "gym" as IconKey,
    label: "Gimnasio",
    shortLabel: "Gimnasio",
    icon: CategoryIcons.gym,
  },
  {
    value: "pets" as IconKey,
    label: "Mascotas",
    shortLabel: "Mascotas",
    icon: CategoryIcons.pets,
  },
  {
    value: "gifts" as IconKey,
    label: "Regalos",
    shortLabel: "Regalos",
    icon: CategoryIcons.gifts,
  },
];

// Interfaz para propiedades del componente CategoryIcon
interface CategoryIconProps {
  iconKey: IconKey;
  className?: string;
  color?: string;
  width?: string | number;
  height?: string | number;
  strokeWidth?: string | number;
}

// Componente CategoryIcon mejorado con propiedades parametrizables
export const CategoryIcon: React.FC<CategoryIconProps> = ({
  iconKey,
  className = "w-5 h-5",
  color = "currentColor",
  width,
  height,
  strokeWidth,
}) => {
  const pathContent = iconPaths[iconKey];
  
  if (!pathContent) {
    return createSVGIcon(iconPaths.shopping, { className, color, width, height, strokeWidth });
  }

  return createSVGIcon(pathContent, {
    className,
    color,
    width,
    height,
    strokeWidth,
  });
};

// Función helper para obtener iconos
export const getCategoryIcon = (iconKey: string): React.ReactNode => {
  return CategoryIcons[iconKey as IconKey] || null;
};

// Función para crear un icono específico con propiedades personalizadas
export const createCustomIcon = (iconKey: IconKey, props?: SVGIconProps): React.ReactNode => {
  const pathContent = iconPaths[iconKey];
  return pathContent ? createSVGIcon(pathContent, props) : null;
};
