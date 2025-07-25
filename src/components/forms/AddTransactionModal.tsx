"use client";

import React, { useState } from 'react';
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
  useDisclosure
} from '@heroui/react';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionInsert } from '@/lib/supabase';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: 'income' | 'expense' | 'transfer';
}

const transactionTypes = [
  { key: 'income', label: 'Income' },
  { key: 'expense', label: 'Expense' },
  { key: 'transfer', label: 'Transfer' }
];

const paymentMethods = [
  { key: 'bank_account', label: 'Bank Account' },
  { key: 'credit_card', label: 'Credit Card' },
  { key: 'debit_card', label: 'Debit Card' },
  { key: 'cash', label: 'Cash' },
  { key: 'paypal', label: 'PayPal' },
  { key: 'other', label: 'Other' }
];

const categories = [
  { key: 'salary', label: 'Salary' },
  { key: 'freelance', label: 'Freelance' },
  { key: 'bonus', label: 'Bonus' },
  { key: 'food', label: 'Food' },
  { key: 'transportation', label: 'Transportation' },
  { key: 'entertainment', label: 'Entertainment' },
  { key: 'utilities', label: 'Utilities' },
  { key: 'shopping', label: 'Shopping' },
  { key: 'healthcare', label: 'Healthcare' },
  { key: 'education', label: 'Education' },
  { key: 'transfer', label: 'Transfer' },
  { key: 'other', label: 'Other' }
];

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense'
}) => {
  const { createTransaction } = useTransactions();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<TransactionInsert>({
    type: defaultType,
    description: '',
    amount: 0,
    category: '',
    method: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure amount is negative for expenses
      const amount = formData.type === 'expense' 
        ? -Math.abs(formData.amount)
        : Math.abs(formData.amount);

      await createTransaction({
        ...formData,
        amount
      });

      // Reset form
      setFormData({
        type: defaultType,
        description: '',
        amount: 0,
        category: '',
        method: '',
        date: new Date().toISOString().split('T')[0]
      });

      onClose();
    } catch (error) {
      console.error('Error creating transaction:', error);
      // Show more detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      } else {
        console.error('Unknown error type:', typeof error, error);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof TransactionInsert, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader className="flex flex-col gap-1">
            Add New Transaction
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Transaction Type */}
              <Select
                label="Type"
                placeholder="Select transaction type"
                selectedKeys={[formData.type]}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as 'income' | 'expense' | 'transfer';
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

              {/* Amount */}
              <Input
                type="number"
                label="Amount"
                placeholder="0.00"
                value={formData.amount.toString()}
                onChange={(e) => handleInputChange('amount', parseFloat(e.target.value) || 0)}
                startContent={
                  <div className="pointer-events-none flex items-center">
                    <span className="text-default-400 text-small">$</span>
                  </div>
                }
                isRequired
              />
            </div>

            {/* Description */}
            <Textarea
              label="Description"
              placeholder="Enter transaction description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              isRequired
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category */}
              <Select
                label="Category"
                placeholder="Select category"
                selectedKeys={formData.category ? [formData.category] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('category', selectedKey);
                }}
              >
                {categories.map((category) => (
                  <SelectItem key={category.key}>
                    {category.label}
                  </SelectItem>
                ))}
              </Select>

              {/* Payment Method */}
              <Select
                label="Payment Method"
                placeholder="Select payment method"
                selectedKeys={formData.method ? [formData.method] : []}
                onSelectionChange={(keys) => {
                  const selectedKey = Array.from(keys)[0] as string;
                  handleInputChange('method', selectedKey);
                }}
                isRequired
              >
                {paymentMethods.map((method) => (
                  <SelectItem key={method.key}>
                    {method.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            {/* Date */}
            <Input
              type="date"
              label="Date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              isRequired
            />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={onClose}>
              Cancel
            </Button>
            <Button 
              color="primary" 
              type="submit" 
              isLoading={loading}
              disabled={!formData.description || !formData.method || formData.amount <= 0}
            >
              Add Transaction
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default AddTransactionModal;