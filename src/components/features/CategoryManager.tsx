"use client";

import React, { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Chip,
  Spinner,
} from "@heroui/react";
import { useCategories } from "@/hooks/useCategories";
import { Category } from "@/lib/supabase";
import {
  SearchInput,
  FilterSelect,
  IconSelector,
  CategoryIcon,
  ICON_OPTIONS,
} from "@/components/ui";
import type { IconKey } from "@/components/ui/CategoryIcons";

// Predefined colors for categories
const PREDEFINED_COLORS = [
  "#17B26A", // Green
  "#F04438", // Red
  "#0BA5EC", // Blue
  "#4E5BA6", // Purple
  "#9E77ED", // Violet
  "#F79009", // Orange
  "#6172F3", // Indigo
  "#DD2590", // Pink
  "#667085", // Gray
  "#12B76A", // Emerald
  "#F97316", // Orange-500
  "#8B5CF6", // Violet-500
];

interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
  type: "income" | "expense" | "both";
}

const CategoryManager: React.FC = () => {
  const {
    categories,
    loading,
    error,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [formData, setFormData] = useState<CategoryFormData>({
    name: "",
    color: PREDEFINED_COLORS[0],
    icon: "shopping",
    type: "expense",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        color: category.color,
        icon: category.icon,
        type: category.type,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        color: PREDEFINED_COLORS[0],
        icon: "shopping",
        type: "expense",
      });
    }
    onOpen();
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, formData);
      } else {
        await createCategory(formData);
      }
      onClose();
    } catch (err) {
      console.error("Error saving category:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter categories based on search term and type
  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || category.type === typeFilter;
    return matchesSearch && matchesType;
  });

  // Filter options for type
  const typeFilterOptions = [
    { key: "", label: "Todos los tipos" },
    { key: "income", label: "Ingresos" },
    { key: "expense", label: "Gastos" },
  ];

  const handleDelete = async (categoryId: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta categoría?")) {
      await deleteCategory(categoryId);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "success";
      case "expense":
        return "danger";
      case "both":
        return "primary";
      default:
        return "default";
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="flex justify-center items-center py-8">
          <Spinner size="lg" />
          <span className="ml-2">Cargando categorías...</span>
        </CardBody>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-col gap-6">
          <div className="flex justify-between items-center w-full">
            <h3 className="text-lg font-semibold">Categorías</h3>
            <Button color="primary" onPress={() => handleOpenModal()}>
              Nueva Categoría
            </Button>
          </div>
          <div className="flex gap-4 w-full">
            <SearchInput
              placeholder="Buscar categorías..."
              value={searchTerm}
              onChange={setSearchTerm}
              className="flex-1 max-w-md"
            />
            <FilterSelect
              placeholder="Filtrar por tipo"
              value={typeFilter}
              onChange={setTypeFilter}
              options={typeFilterOptions}
              className="w-48"
            />
          </div>
        </CardHeader>
        <CardBody>
          {error && (
            <div className="bg-danger-50 border border-danger-200 text-danger-800 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card
                key={category.id}
                className="border border-default-200 hover:border-default-300 transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-content1/50 backdrop-blur-sm"
              >
                <CardBody className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm ring-2 ring-white/20"
                        style={{ backgroundColor: category.color }}
                      >
                        <CategoryIcon
                          iconKey={category.icon as IconKey}
                          className="w-5 h-5"
                          color="white"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {category.name}
                        </h4>
                        <p className="text-xs text-foreground-400">
                          {ICON_OPTIONS.find(
                            (opt) => opt.value === category.icon
                          )?.label || category.icon}
                        </p>
                      </div>
                    </div>
                    <Chip
                      size="sm"
                      color={
                        getTypeColor(category.type) as
                          | "success"
                          | "danger"
                          | "primary"
                          | "default"
                      }
                      variant="flat"
                    >
                      {category.type}
                    </Chip>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="flat"
                      color="primary"
                      className="flex-1 font-medium"
                      onPress={() => handleOpenModal(category)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      className="flex-1 font-medium"
                      onPress={() => handleDelete(category.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>

          {filteredCategories.length === 0 && categories.length > 0 && (
            <div className="text-center py-8 text-foreground-500">
              No se encontraron categorías que coincidan con la búsqueda.
            </div>
          )}

          {categories.length === 0 && (
            <div className="text-center py-8 text-foreground-500">
              No hay categorías disponibles. Crea una nueva categoría para
              comenzar.
            </div>
          )}
        </CardBody>
      </Card>

      {/* Modal for creating/editing categories */}
      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalContent>
          <ModalHeader>
            {editingCategory ? "Editar Categoría" : "Nueva Categoría"}
          </ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <Input
                label="Nombre"
                placeholder="Ej: Comida, Transporte, etc."
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                isRequired
              />

              <Select
                label="Tipo"
                selectedKeys={[formData.type]}
                onSelectionChange={(keys) => {
                  const type = Array.from(keys)[0] as
                    | "income"
                    | "expense"
                    | "both";
                  setFormData({ ...formData, type });
                }}
              >
                <SelectItem key="expense">Gasto</SelectItem>
                <SelectItem key="income">Ingreso</SelectItem>
                <SelectItem key="both">Ambos</SelectItem>
              </Select>

              <div>
                <label className="block text-sm font-medium mb-2">Icono</label>
                <IconSelector
                  selectedIcon={formData.icon}
                  onIconSelect={(iconKey) =>
                    setFormData({ ...formData, icon: iconKey })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Color</label>
                <div className="grid grid-cols-6 gap-2">
                  {PREDEFINED_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`w-8 h-8 rounded-full border-2 ${
                        formData.color === color
                          ? "border-foreground"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => setFormData({ ...formData, color })}
                    />
                  ))}
                </div>
                <Input
                  className="mt-2"
                  label="Color personalizado"
                  placeholder="#000000"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="flat" onPress={onClose}>
              Cancelar
            </Button>
            <Button
              color="primary"
              onPress={handleSubmit}
              isLoading={isSubmitting}
              isDisabled={!formData.name.trim()}
            >
              {editingCategory ? "Actualizar" : "Crear"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CategoryManager;
