"use client";

import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
} from "@heroui/react";
import { useTransactions } from "@/hooks/useTransactions";
import { Transaction, TransactionInsert } from "@/lib/supabase";
import { useCategories } from "@/hooks/useCategories";
import { useTranslation } from "@/contexts/LanguageContext";

type ModalMode = "create" | "edit" | "view";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: (edit?: boolean) => void;
  defaultType?: "income" | "expense" | "transfer";
  mode?: ModalMode;
  transaction?: Transaction | null;
}

const transactionTypes = [
  { key: "income", label: "Income" },
  { key: "expense", label: "Expense" },
  { key: "transfer", label: "Transfer" },
];

const paymentMethods = [
  { key: "bank_account", label: "Bank Account" },
  { key: "credit_card", label: "Credit Card" },
  { key: "debit_card", label: "Debit Card" },
  { key: "cash", label: "Cash" },
  { key: "paypal", label: "PayPal" },
  { key: "other", label: "Other" },
];

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = "expense",
  mode = "create",
  transaction = null,
}) => {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const { createTransaction, updateTransaction } = useTransactions();
  const [loading, setLoading] = useState(false);
  const isReadOnly = mode === "view";
  const [formData, setFormData] = useState<TransactionInsert>({
    type: defaultType,
    description: "",
    amount: 0,
    category: "",
    method: "",
    date: new Date().toISOString().split("T")[0],
  });

  // Update form data when defaultType or transaction changes
  useEffect(() => {
    if (mode === "edit" && transaction) {
      setFormData({
        type: transaction.type,
        description: transaction.description,
        amount: Math.abs(Number(transaction.amount)), // Always show positive amount in form
        category: transaction.category || "",
        method: transaction.method,
        date: transaction.date,
      });
    } else if (mode === "view" && transaction) {
      setFormData({
        type: transaction.type,
        description: transaction.description,
        amount: Math.abs(Number(transaction.amount)),
        category: transaction.category || "",
        method: transaction.method,
        date: transaction.date,
      });
    } else {
      setFormData((prev) => ({
        ...prev,
        type: defaultType,
      }));
    }
  }, [defaultType, mode, transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly) return;

    setLoading(true);

    try {
      // Ensure amount is negative for expenses
      const amount =
        formData.type === "expense"
          ? -Math.abs(formData.amount)
          : Math.abs(formData.amount);

      if (mode === "edit" && transaction) {
        await updateTransaction(transaction.id, {
          ...formData,
          amount,
        });
      } else {
        await createTransaction({
          ...formData,
          amount,
        });
      }

      // Reset form only for create mode
      if (mode === "create") {
        setFormData({
          type: defaultType,
          description: "",
          amount: 0,
          category: "",
          method: "",
          date: new Date().toISOString().split("T")[0],
        });
      }

      onClose(true);
    } catch (error) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} transaction:`,
        error
      );
      // Show more detailed error information
      if (error instanceof Error) {
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      } else {
        console.error("Unknown error type:", typeof error, error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    field: keyof TransactionInsert,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getModalTitle = () => {
    switch (mode) {
      case "edit":
        return t("transactions.editTransaction") || "Edit Transaction";
      case "view":
        return t("transactions.viewTransaction") || "View Transaction";
      default:
        return t("transactions.addTransaction") || "Add New Transaction";
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case "edit":
        return t("forms.save") || "Save Changes";
      default:
        return t("forms.add") || "Add Transaction";
    }
  };

  const onCloseModal = () => {
    onClose(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onCloseModal} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            {getModalTitle()}
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transaction Type */}
              <Select
                label={t("forms.type") || "Type"}
                placeholder={
                  t("forms.typePlaceholder") || "Select transaction type"
                }
                selectedKeys={[formData.type]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as
                    | "income"
                    | "expense"
                    | "transfer";
                  handleInputChange("type", selectedKey);
                }}
                isRequired
                isDisabled={isReadOnly}
              >
                {transactionTypes.map((type) => (
                  <SelectItem key={type.key}>{type.label}</SelectItem>
                ))}
              </Select>

              {/* Amount */}
              <Input
                type="number"
                label={t("forms.amount") || "Amount"}
                placeholder="0.00"
                value={formData.amount.toString()}
                onChange={(e) =>
                  handleInputChange("amount", parseFloat(e.target.value) || 0)
                }
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                isRequired
                isReadOnly={isReadOnly}
              />
            </div>

            {/* Description */}
            <Textarea
              label={t("forms.description") || "Description"}
              placeholder={
                t("forms.descriptionPlaceholder") ||
                "Enter transaction description"
              }
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              isRequired
              isReadOnly={isReadOnly}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <Select
                label={t("forms.category") || "Category"}
                placeholder={
                  t("forms.categoryPlaceholder") || "Select category"
                }
                selectedKeys={formData.category ? [formData.category] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange("category", selectedKey);
                }}
                isDisabled={isReadOnly}
              >
                {categories.map((category) => (
                  <SelectItem key={category.id}>{category.name}</SelectItem>
                ))}
              </Select>

              {/* Payment Method */}
              <Select
                label={t("forms.paymentMethod") || "Payment Method"}
                placeholder={
                  t("forms.paymentMethodPlaceholder") || "Select payment method"
                }
                selectedKeys={formData.method ? [formData.method] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange("method", selectedKey);
                }}
                isRequired
                isDisabled={isReadOnly}
              >
                {paymentMethods.map((method) => (
                  <SelectItem key={method.key}>{method.label}</SelectItem>
                ))}
              </Select>
            </div>

            {/* Date */}
            <Input
              type="date"
              label={t("forms.date") || "Date"}
              value={formData.date}
              onChange={(e) => handleInputChange("date", e.target.value)}
              isRequired
              isReadOnly={isReadOnly}
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onCloseModal}>
              Cancel
            </Button>
            {!isReadOnly && (
              <Button
                color="primary"
                type="submit"
                isLoading={loading}
                disabled={
                  !formData.description ||
                  !formData.method ||
                  formData.amount <= 0
                }
              >
                {getSubmitButtonText()}
              </Button>
            )}
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddTransactionModal;
