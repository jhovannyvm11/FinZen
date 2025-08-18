import React, { useState } from "react";
import {
  Card,
  CardBody,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
} from "@heroui/react";
import { useTransactions } from "@/hooks/useTransactions";
import { useTranslation } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/utils/currency";
import { Transaction } from "@/lib/supabase";
import { useCategories } from "@/hooks/useCategories";
import AddTransactionModal from "../forms/AddTransactionModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";

// SVG Icons
const MoreIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const NetflixLogo = () => (
  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 2L6 14L10 2L14 14" fill="white" />
    </svg>
  </div>
);

const SpotifyLogo = () => (
  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.7 11.5c-.1.2-.4.3-.6.2-1.6-1-3.6-1.2-6-.7-.2.1-.4-.1-.5-.3-.1-.2.1-.4.3-.5 2.6-.6 4.8-.3 6.6.8.2.1.3.3.2.5zm.8-1.8c-.2.3-.5.4-.8.2-1.8-1.1-4.6-1.4-6.8-.8-.3.1-.5-.1-.6-.3-.1-.3.1-.5.3-.6 2.5-.7 5.6-.4 7.7.9.3.2.4.4.2.6zm.1-1.9c-2.2-1.3-5.8-1.4-7.9-.8-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 2.4-.7 6.4-.6 8.9.9.3.2.4.5.2.8-.2.2-.6.3-.9.2z"
        fill="white"
      />
    </svg>
  </div>
);

// Helper function to get initials from description
const getInitials = (description: string): string => {
  return description
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
};

// Helper function to get logo based on description
const getLogo = (description: string): React.ReactNode | null => {
  const lowerDesc = description.toLowerCase();
  if (lowerDesc.includes("netflix")) return <NetflixLogo />;
  if (lowerDesc.includes("spotify")) return <SpotifyLogo />;
  return null;
};

// Helper function to format date
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD format
};

interface TransactionsHistoryProps {
  transactions?: Transaction[];
  loading?: boolean;
  error?: string | null;
  onDelete?: () => void;
  onEdit?: () => void;
}

const TransactionsHistory: React.FC<TransactionsHistoryProps> = ({
  transactions: propTransactions,
  loading: propLoading,
  error: propError,
  onDelete,
  onEdit,
}) => {
  const { t } = useTranslation();
  const {
    transactions: hookTransactions,
    loading: hookLoading,
    error: hookError,
    deleteTransaction,
  } = useTransactions();
  const { categories } = useCategories();

  const [modalType, setModalType] = useState<"income" | "expense" | "transfer">(
    "expense"
  );
  const [modalMode, setModalMode] = useState<"create" | "edit" | "view">(
    "create"
  );
  const [isModalTransactionOpen, setIsModalTransactionOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [openPopoverId, setOpenPopoverId] = useState<string | null>(null);

  // Funciones para manejar las acciones del popover
  const handleEdit = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalMode("edit");
    setIsModalTransactionOpen(true);
    setOpenPopoverId(null); // Cerrar popover
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
    setOpenPopoverId(null); // Cerrar popover
  };

  const handleConfirmDelete = async () => {
    if (!selectedTransaction) return;

    setIsDeleting(true);
    try {
      await deleteTransaction(selectedTransaction.id);
      setIsDeleteModalOpen(false);
      onDelete?.();
      setSelectedTransaction(null);
    } catch (error) {
      console.error("Error deleting transaction:", error);
      // TODO: Show error toast/notification to user
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewContent = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalType(transaction.type);
    setModalMode("view");
    setIsModalTransactionOpen(true);
    setOpenPopoverId(null); // Cerrar popover
  };

  const refreshDataDashboard = () => {
    onEdit?.();
  };

  const getMessageConfirmDelete = (itemName: string) => {
    return (
      t(`messages.delete.message ${itemName}`) ||
      `Estas seguro de eliminar la transacción ${itemName}?`
    );
  };

  const getNameCategoryById = (id: string): string => {
    const category = categories?.find((category) => category.id === id);
    return category?.name || "Unknown";
  };

  // Use prop values if provided, otherwise use hook values
  const transactions = propTransactions ?? hookTransactions;
  const loading = propLoading ?? hookLoading;
  const error = propError ?? hookError;

  if (loading) {
    return (
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="flex items-center justify-center h-64">
            <Spinner size="lg" />
          </div>
        </CardBody>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardBody className="p-6">
          <div className="text-center text-danger">
            <p>Error loading transactions: {error}</p>
          </div>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardBody className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            {t("transactions.recentTransactions")}
          </h3>
          <p className="text-sm text-foreground-500">
            {t("transactions.checkLastTransactions")}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-divider">
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground-500">
                  {t("transactions.description")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground-500">
                  {t("transactions.method")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground-500">
                  {t("transactions.date")}
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground-500">
                  {t("transactions.amount")}
                </th>
                <th className="w-12 py-3 px-4"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-foreground-500"
                  >
                    {t("transactions.noTransactions")}
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => {
                  const logo = getLogo(transaction.description);
                  const initials = logo
                    ? null
                    : getInitials(transaction.description);
                  const amount = Number(transaction.amount);
                  const category = getNameCategoryById(
                    transaction.category || ""
                  );

                  return (
                    <tr
                      key={transaction.id}
                      className="border-b border-divider last:border-b-0"
                    >
                      {/* Description Column */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          {logo ? (
                            logo
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-default-100 border border-divider flex items-center justify-center">
                              <span className="text-xs font-medium text-foreground-600">
                                {initials}
                              </span>
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">
                              {transaction.description}
                            </span>
                            {category && (
                              <span className="text-xs text-foreground-400">
                                {category}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Method Column */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-foreground-500">
                          {transaction.method}
                        </span>
                      </td>

                      {/* Date Column */}
                      <td className="py-4 px-4">
                        <span className="text-sm text-foreground-500">
                          {formatDate(transaction.date)}
                        </span>
                      </td>

                      {/* Amount Column */}
                      <td className="py-4 px-4">
                        <span
                          className={`text-sm font-medium ${
                            transaction.type === "income"
                              ? "text-success"
                              : transaction.type === "expense"
                              ? "text-danger"
                              : "text-warning"
                          }`}
                        >
                          {transaction.type === "income"
                            ? "+"
                            : transaction.type === "expense"
                            ? "-"
                            : ""}
                          {formatCurrency(Math.abs(amount))}
                        </span>
                      </td>

                      {/* Actions Column */}
                      <td className="py-4 px-4">
                        <Popover
                          backdrop="opaque"
                          placement="bottom-end"
                          isOpen={openPopoverId === transaction.id}
                          onOpenChange={(open) => {
                            setOpenPopoverId(open ? transaction.id : null);
                          }}
                        >
                          <PopoverTrigger>
                            <Button
                              isIconOnly
                              variant="light"
                              size="sm"
                              className="text-foreground-400 hover:text-foreground-600 transition-colors"
                            >
                              <MoreIcon />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="p-1">
                            <div className="flex flex-col gap-1">
                              <Button
                                variant="light"
                                size="sm"
                                className="justify-start"
                                onPress={() => handleEdit(transaction)}
                              >
                                {t("transactions.options.edit") || "Editar"}
                              </Button>
                              <Button
                                variant="light"
                                size="sm"
                                className="justify-start text-danger"
                                onPress={() => handleDelete(transaction)}
                              >
                                {t("transactions.options.delete") || "Eliminar"}
                              </Button>
                              <Button
                                variant="light"
                                size="sm"
                                className="justify-start"
                                onPress={() => handleViewContent(transaction)}
                              >
                                {t("transactions.options.viewContent") ||
                                  "Ver Contenido"}
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Unified Transaction Modal */}
        <AddTransactionModal
          isOpen={isModalTransactionOpen}
          onClose={(edit) => {
            setIsModalTransactionOpen(false);
            setSelectedTransaction(null);
            if (edit) {
              refreshDataDashboard();
            }
          }}
          defaultType={modalType}
          mode={modalMode}
          transaction={selectedTransaction}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => {
            setIsDeleteModalOpen(false);
            setSelectedTransaction(null);
          }}
          onConfirm={handleConfirmDelete}
          title={t("messages.delete.title") || "Delete Transaction"}
          message={getMessageConfirmDelete(
            selectedTransaction?.description || ""
          )}
          itemName={selectedTransaction?.description || ""}
          isLoading={isDeleting}
        />
      </CardBody>
    </Card>
  );
};

export default TransactionsHistory;
