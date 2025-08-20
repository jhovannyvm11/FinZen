"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Chip,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@heroui/react";
import {
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Transaction, PaginationOptions } from "@/types";
import { Category } from "@/lib/supabase";
import { useTranslation } from "@/contexts/LanguageContext";
import { formatCurrency } from "@/utils/currency";

interface TransactionsTableProps {
  transactions: Transaction[];
  pagination: PaginationOptions;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  categories: Category[];
}

interface EditingTransaction {
  id: string;
  field: keyof Transaction;
  value: string;
}

export default function TransactionsTable({
  transactions,
  pagination,
  onPageChange,
  onPageSizeChange,
  onEdit,
  onDelete,
  loading = false,
  categories,
}: TransactionsTableProps) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingTransaction, setEditingTransaction] =
    useState<EditingTransaction | null>(null);

  const statusColorMap = {
    completed: "success",
    pending: "warning",
    cancelled: "danger",
  } as const;

  const typeColorMap = {
    income: "success",
    expense: "danger",
    transfer: "primary",
  } as const;

  const columns = [
    { key: "date", label: t("date"), sortable: true },
    { key: "description", label: t("description"), sortable: true },
    { key: "type", label: t("type"), sortable: true },
    { key: "category", label: t("category"), sortable: true },
    { key: "amount", label: t("amount"), sortable: true },
    { key: "method", label: t("method"), sortable: true },
    { key: "status", label: t("status"), sortable: true },
    { key: "actions", label: t("actions"), sortable: false },
  ];

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    onOpen();
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
      onClose();
    }
  };

  const handleEditStart = (
    transaction: Transaction,
    field: keyof Transaction
  ) => {
    setEditingTransaction({
      id: transaction.id,
      field,
      value: String(transaction[field] || ""),
    });
  };

  const handleEditSave = () => {
    if (editingTransaction) {
      const transaction = transactions.find(
        (t) => t.id === editingTransaction.id
      );
      if (transaction) {
        const updatedTransaction = {
          ...transaction,
          [editingTransaction.field]: editingTransaction.value,
        };
        onEdit(updatedTransaction);
      }
      setEditingTransaction(null);
    }
  };

  const handleEditCancel = () => {
    setEditingTransaction(null);
  };

  const getCategoryName = (categoryId: string | undefined): string => {
    if (!categoryId) return "-";
    const category = categories.find((cat) => cat.id === categoryId);
    return category?.name || categoryId;
  };

  const renderCell = (transaction: Transaction, columnKey: string) => {
    const isEditing =
      editingTransaction?.id === transaction.id &&
      editingTransaction?.field === columnKey;

    switch (columnKey) {
      case "date":
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Input
                type="date"
                size="sm"
                value={editingTransaction.value}
                onChange={(e) =>
                  setEditingTransaction((prev) =>
                    prev ? { ...prev, value: e.target.value } : null
                  )
                }
                className="min-w-[140px]"
              />
              <Button
                size="sm"
                isIconOnly
                color="success"
                onClick={handleEditSave}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                isIconOnly
                color="danger"
                variant="light"
                onClick={handleEditCancel}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <span>{new Date(transaction.date).toLocaleDateString()}</span>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onClick={() => handleEditStart(transaction, "date")}
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          </div>
        );

      case "description":
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Input
                size="sm"
                value={editingTransaction.value}
                onChange={(e) =>
                  setEditingTransaction((prev) =>
                    prev ? { ...prev, value: e.target.value } : null
                  )
                }
                className="min-w-[200px]"
              />
              <Button
                size="sm"
                isIconOnly
                color="success"
                onClick={handleEditSave}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                isIconOnly
                color="danger"
                variant="light"
                onClick={handleEditCancel}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <span className="truncate max-w-[200px]">
              {transaction.description}
            </span>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onClick={() => handleEditStart(transaction, "description")}
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          </div>
        );

      case "type":
        return (
          <Chip color={typeColorMap[transaction.type]} variant="flat" size="sm">
            {t('transactions.types.' + transaction.type)}
          </Chip>
        );

      case "category":
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Input
                size="sm"
                value={editingTransaction.value}
                onChange={(e) =>
                  setEditingTransaction((prev) =>
                    prev ? { ...prev, value: e.target.value } : null
                  )
                }
                className="min-w-[120px]"
              />
              <Button
                size="sm"
                isIconOnly
                color="success"
                onClick={handleEditSave}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                isIconOnly
                color="danger"
                variant="light"
                onClick={handleEditCancel}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <span>{getCategoryName(transaction.category)}</span>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onClick={() => handleEditStart(transaction, "category")}
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          </div>
        );

      case "amount":
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                size="sm"
                value={editingTransaction.value}
                onChange={(e) =>
                  setEditingTransaction((prev) =>
                    prev ? { ...prev, value: e.target.value } : null
                  )
                }
                className="min-w-[120px]"
                startContent="$"
              />
              <Button
                size="sm"
                isIconOnly
                color="success"
                onClick={handleEditSave}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                isIconOnly
                color="danger"
                variant="light"
                onClick={handleEditCancel}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <span
              className={`font-semibold ${
                transaction.type === "income"
                  ? "text-success"
                  : transaction.type === "expense"
                  ? "text-danger"
                  : "text-primary"
              }`}
            >
              {transaction.type === "expense" && transaction.amount > 0
                ? "-"
                : ""}
              {formatCurrency(Math.abs(transaction.amount))}
            </span>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onClick={() => handleEditStart(transaction, "amount")}
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          </div>
        );

      case "method":
        if (isEditing) {
          return (
            <div className="flex items-center gap-2">
              <Input
                size="sm"
                value={editingTransaction.value}
                onChange={(e) =>
                  setEditingTransaction((prev) =>
                    prev ? { ...prev, value: e.target.value } : null
                  )
                }
                className="min-w-[120px]"
              />
              <Button
                size="sm"
                isIconOnly
                color="success"
                onClick={handleEditSave}
              >
                <CheckIcon className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                isIconOnly
                color="danger"
                variant="light"
                onClick={handleEditCancel}
              >
                <XMarkIcon className="h-4 w-4" />
              </Button>
            </div>
          );
        }
        return (
          <div className="flex items-center gap-2">
            <span>{transaction.method}</span>
            <Button
              size="sm"
              isIconOnly
              variant="light"
              onClick={() => handleEditStart(transaction, "method")}
            >
              <PencilIcon className="h-3 w-3" />
            </Button>
          </div>
        );

      case "status":
        return (
          <Chip
            color={statusColorMap[transaction.status]}
            variant="flat"
            size="sm"
          >
            {t(transaction.status || "pending")}
          </Chip>
        );

      case "actions":
        return (
          <div className="flex items-center gap-2">
            <Tooltip content={t("edit")}>
              <Button
                size="sm"
                isIconOnly
                variant="light"
                onClick={() => onEdit(transaction)}
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
            <Tooltip content={t("delete")} color="danger">
              <Button
                size="sm"
                isIconOnly
                color="danger"
                variant="light"
                onClick={() => handleDeleteClick(transaction.id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </Tooltip>
          </div>
        );

      default:
        return String(transaction[columnKey as keyof Transaction] || "-");
    }
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <>
      <div className="space-y-4">
        <Table
          aria-label={t("transactionsTable")}
          isStriped
          removeWrapper
          classNames={{
            th: "bg-default-100 text-default-700",
            td: "py-3",
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} allowsSorting={column.sortable}>
                {t('transactions.table.' + column.label)}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={transactions}
            isLoading={loading}
            emptyContent={t("transactions.table.noTransactionsFound")}
          >
            {(transaction) => (
              <TableRow key={transaction.id}>
                {(columnKey) => (
                  <TableCell>
                    {renderCell(transaction, String(columnKey))}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              total={totalPages}
              page={pagination.page}
              onChange={onPageChange}
              showControls
              showShadow
              color="primary"
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {t("confirmDelete")}
              </ModalHeader>
              <ModalBody>
                <p>{t("deleteTransactionConfirmation")}</p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  {t("cancel")}
                </Button>
                <Button color="danger" onPress={handleDeleteConfirm}>
                  {t("delete")}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
