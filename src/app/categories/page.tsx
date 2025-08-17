"use client";

import React from 'react';
import CategoryManager from '@/components/features/CategoryManager';

const CategoriesPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Gestión de Categorías
        </h1>
        <p className="text-foreground-600">
          Administra las categorías de tus transacciones y personaliza sus colores.
        </p>
      </div>
      
      <CategoryManager />
    </div>
  );
};

export default CategoriesPage;