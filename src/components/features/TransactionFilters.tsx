"use client";

import React from 'react';
import {
  Card,
  CardBody,
  Input,
  Select,
  SelectItem,
  Button,
  DatePicker,
  Chip,
} from '@heroui/react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { TransactionFilters as ITransactionFilters } from '@/types';
import { Category } from '@/lib/supabase';
import { useTranslation } from '@/contexts/LanguageContext';

interface TransactionFiltersProps {
  filters: ITransactionFilters;
  onFiltersChange: (filters: ITransactionFilters) => void;
  onClearFilters: () => void;
  categories: Category[];
}

export default function TransactionFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  categories,
}: TransactionFiltersProps) {
  const { t } = useTranslation();

  const handleFilterChange = (key: keyof ITransactionFilters, value: string | number | undefined) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(
      (value) => value !== undefined && value !== '' && value !== 'all'
    ).length;
  };

  const transactionTypes = [
    { key: 'all', label: t('general.all') },
    { key: 'income', label: t('general.income') },
    { key: 'expense', label: t('general.expense') },
    { key: 'transfer', label: t('general.transfer') },
  ];

  const statusOptions = [
    { key: 'all', label: t('general.all') },
    { key: 'pending', label: t('status.pending') },
    { key: 'completed', label: t('status.completed') },
    { key: 'cancelled', label: t('status.cancelled') },
  ];

  const categoryItems = [
    { key: 'all', label: t('filters.allCategories') },
    ...categories.map((category) => ({ key: category.name, label: category.name })),
  ];

  return (
    <Card className="mb-6">
      <CardBody className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-default-500" />
            <h3 className="text-lg font-semibold">{t('filters.title')}</h3>
            {getActiveFiltersCount() > 0 && (
              <Chip size="sm" color="primary" variant="flat">
                {getActiveFiltersCount()}
              </Chip>
            )}
          </div>
          {getActiveFiltersCount() > 0 && (
            <Button
              size="sm"
              variant="light"
              color="danger"
              startContent={<XMarkIcon className="h-4 w-4" />}
              onClick={onClearFilters}
            >
              {t('filters.clearFilters')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <Input
            placeholder={t('filters.searchTransactions')}
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            startContent={<MagnifyingGlassIcon className="h-4 w-4 text-default-400" />}
            isClearable
            onClear={() => handleFilterChange('search', '')}
          />

          {/* Tipo de transacción */}
          <Select
            placeholder={t('filters.selectType')}
            selectedKeys={filters.type ? [filters.type] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleFilterChange('type', selectedKey);
            }}
          >
            {transactionTypes.map((type) => (
              <SelectItem key={type.key}>
                {type.label}
              </SelectItem>
            ))}
          </Select>

          {/* Estado */}
          <Select
            placeholder={t('filters.selectStatus')}
            selectedKeys={filters.status ? [filters.status] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleFilterChange('status', selectedKey);
            }}
          >
            {statusOptions.map((status) => (
              <SelectItem key={status.key}>
                {status.label}
              </SelectItem>
            ))}
          </Select>

          {/* Categoría */}
          <Select
            placeholder={t('filters.selectCategory')}
            selectedKeys={filters.category ? [filters.category] : []}
            onSelectionChange={(keys) => {
              const selectedKey = Array.from(keys)[0] as string;
              handleFilterChange('category', selectedKey);
            }}
            items={categoryItems}
          >
            {(item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            )}
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Fecha desde */}
          <Input
            type="date"
            label={t('filters.dateFrom')}
            value={filters.dateFrom || ''}
            onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
          />

          {/* Fecha hasta */}
          <Input
            type="date"
            label={t('filters.dateTo')}
            value={filters.dateTo || ''}
            onChange={(e) => handleFilterChange('dateTo', e.target.value)}
          />

          {/* Monto mínimo */}
          <Input
            type="number"
            label={t('filters.minAmount')}
            placeholder="0.00"
            value={filters.minAmount?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              handleFilterChange('minAmount', value);
            }}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">{t('general.currencySymbol')}</span>
              </div>
            }
          />

          {/* Monto máximo */}
          <Input
            type="number"
            label={t('filters.maxAmount')}
            placeholder="0.00"
            value={filters.maxAmount?.toString() || ''}
            onChange={(e) => {
              const value = e.target.value ? parseFloat(e.target.value) : undefined;
              handleFilterChange('maxAmount', value);
            }}
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">{t('general.currencySymbol')}</span>
              </div>
            }
          />
        </div>
      </CardBody>
    </Card>
  );
}