"use client";

import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { useTranslation } from "@/contexts/LanguageContext";
import { getTranslationWithInterpolation } from "@/utils/i18n";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  itemName?: string;
  isLoading?: boolean;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  itemName,
  isLoading = false,
}) => {
  const { t } = useTranslation();

  const defaultTitle = t("messages.delete.title") || "Confirmar eliminación";
  const defaultMessage = itemName
    ? getTranslationWithInterpolation(
        t,
        "messages.delete.messageWithItem",
        { itemName },
        `¿Estás seguro de eliminar la transacción ${itemName}?`
      )
    : t("messages.delete.title") ||
      "¿Estás seguro de eliminar esta transacción?";

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          {title || defaultTitle}
        </ModalHeader>
        <ModalBody>
          <p className="text-foreground-600">{message || defaultMessage}</p>
        </ModalBody>
        <ModalFooter>
          <Button
            color="default"
            variant="light"
            onPress={onClose}
            disabled={isLoading}
          >
            {t("forms.cancel") || "Cancel"}
          </Button>
          <Button color="danger" onPress={onConfirm} isLoading={isLoading}>
            {t("forms.delete") || "Delete"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmDeleteModal;
