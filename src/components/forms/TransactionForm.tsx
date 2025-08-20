"use client";

import React, { useState, useEffect } from 'react';
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
  Card,
  CardBody,
  Divider,
} from '@heroui/react';
import { Transaction, TransactionInsert } from '@/lib/supabase';
import { useTranslation } from '@/contexts/LanguageContext';
import { useCategories } from '@/hooks/useCategories';

interface TransactionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (transaction: TransactionInsert) => Promise<void>;
  transaction?: Transaction | null;
  mode: 'create' | 'edit';
}

interface FormData {
  type: 'income' | 'expense' | 'transfer';
  description: string;
  amount: string;
  category: string;
  method: string;
  date: string;
  status: 'pending' | 'completed' | 'cancelled';
}

interface FormErrors {
  description?: string;
  amount?: string;
  category?: string;
  method?: string;
  date?: string;
}

export default function TransactionForm({
  isOpen,
  onClose,
  onSubmit,
  transaction,
  mode,
}: TransactionFormProps) {
  const { t } = useTranslation();
  const { categories } = useCategories();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    type: 'expense',
    description: '',
    amount: '',
    category: '',
    method: 'Credit card',
    date: new Date().toISOString().split('T')[0],
    status: 'completed',
  });

  // Reset form when modal opens/closes or transaction changes
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && transaction) {
        setFormData({
          type: transaction.type,
          description: transaction.description,
          amount: Math.abs(transaction.amount).toString(),
          category: transaction.category || '',
          method: transaction.method,
          date: transaction.date,
          status: transaction.status,
        });
      } else {
        setFormData({
          type: 'expense',
          description: '',
          amount: '',
          category: '',
          method: 'Credit card',
          date: new Date().toISOString().split('T')[0],
          status: 'completed',
        });
      }
      setErrors({});
    }
  }, [isOpen, mode, transaction]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.description.trim()) {
      newErrors.description = t('descriptionRequired');
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = t('validAmountRequired');
    }

    if (!formData.category.trim()) {
      newErrors.category = t('categoryRequired');
    }

    if (!formData.method.trim()) {
      newErrors.method = t('methodRequired');
    }

    if (!formData.date) {
      newErrors.date = t('dateRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const amount = parseFloat(formData.amount);
      const transactionData: TransactionInsert = {
        type: formData.type,
        description: formData.description.trim(),
        amount: formData.type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        category: formData.category.trim(),
        method: formData.method.trim(),
        date: formData.date,
        status: formData.status,
      };

      await onSubmit(transactionData);
      onClose();
    } catch (error) {
      console.error('Error submitting transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const transactionTypes = [
    { key: 'income', label: t('income'), color: 'success' },
    { key: 'expense', label: t('expense'), color: 'danger' },
    { key: 'transfer', label: t('transfer'), color: 'primary' },
  ];

  const statusOptions = [
    { key: 'completed', label: t('completed') },
    { key: 'pending', label: t('pending') },
    { key: 'cancelled', label: t('cancelled') },
  ];

  const paymentMethods = [
    'Credit card',
    'Debit card',
    'Bank account',
    'Cash',
    'PayPal',
    'Transfer',
    'Check',
  ];

  const filteredCategories = categories.filter(
    cat => cat.type === formData.type || cat.type === 'both'
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
      classNames={{
        base: "max-h-[90vh]",
        body: "py-6",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl font-bold">
                {mode === 'create' ? t('addTransaction') : t('editTransaction')}
              </h2>
              <p className="text-sm text-default-500">
                {mode === 'create' 
                  ? t('fillTransactionDetails') 
                  : t('updateTransactionDetails')
                }
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="space-y-6">
                {/* Transaction Type */}
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">{t('transactionType')}</h3>
                    <Select
                      label={t('type')}
                      placeholder={t('selectType')}
                      selectedKeys={[formData.type]}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        handleInputChange('type', selectedKey);
                      }}
                      isRequired
                    >
                      {transactionTypes.map((type) => (
                        <SelectItem key={type.key}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </CardBody>
                </Card>

                {/* Basic Information */}
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">{t('basicInformation')}</h3>
                    <div className="space-y-4">
                      <Input
                        label={t('description')}
                        placeholder={t('enterDescription')}
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        isInvalid={!!errors.description}
                        errorMessage={errors.description}
                        isRequired
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          type="number"
                          label={t('amount')}
                          placeholder="0.00"
                          value={formData.amount}
                          onChange={(e) => handleInputChange('amount', e.target.value)}
                          startContent={
                            <div className="pointer-events-none flex items-center">
                              <span className="text-default-400 text-small">$</span>
                            </div>
                          }
                          isInvalid={!!errors.amount}
                          errorMessage={errors.amount}
                          isRequired
                        />

                        <Input
                          type="date"
                          label={t('date')}
                          value={formData.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          isInvalid={!!errors.date}
                          errorMessage={errors.date}
                          isRequired
                        />
                      </div>
                    </div>
                  </CardBody>
                </Card>

                {/* Category and Method */}
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">{t('categoryAndMethod')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Select
                        label={t('category')}
                        placeholder={t('selectCategory')}
                        selectedKeys={formData.category ? [formData.category] : []}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          handleInputChange('category', selectedKey || '');
                        }}
                        isInvalid={!!errors.category}
                        errorMessage={errors.category}
                        isRequired
                      >
                        {filteredCategories.map((category) => (
                          <SelectItem key={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </Select>

                      <Select
                        label={t('paymentMethod')}
                        placeholder={t('selectMethod')}
                        selectedKeys={[formData.method]}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as string;
                          handleInputChange('method', selectedKey);
                        }}
                        isInvalid={!!errors.method}
                        errorMessage={errors.method}
                        isRequired
                      >
                        {paymentMethods.map((method) => (
                          <SelectItem key={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                  </CardBody>
                </Card>

                {/* Status */}
                <Card>
                  <CardBody>
                    <h3 className="text-lg font-semibold mb-4">{t('status')}</h3>
                    <Select
                      label={t('transactionStatus')}
                      placeholder={t('selectStatus')}
                      selectedKeys={[formData.status]}
                      onSelectionChange={(keys) => {
                        const selectedKey = Array.from(keys)[0] as string;
                        handleInputChange('status', selectedKey);
                      }}
                      isRequired
                    >
                      {statusOptions.map((status) => (
                        <SelectItem key={status.key}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </Select>
                  </CardBody>
                </Card>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="default"
                variant="light"
                onPress={onClose}
                disabled={loading}
              >
                {t('cancel')}
              </Button>
              <Button
                color="primary"
                onPress={handleSubmit}
                isLoading={loading}
              >
                {mode === 'create' ? t('addTransaction') : t('updateTransaction')}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
}