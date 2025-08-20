"use client";

import React, { useState } from 'react';
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Input,
  Checkbox,
  Card,
  CardBody,
  Divider,
} from '@heroui/react';
import {
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';
import { Transaction, ExportOptions, TransactionFilters } from '@/types';
import { useTranslation } from '@/contexts/LanguageContext';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportTransactionsProps {
  transactions: Transaction[];
  filters?: TransactionFilters;
  onExport?: (options: ExportOptions) => void;
}

export default function ExportTransactions({
  transactions,
  filters,
  onExport,
}: ExportTransactionsProps) {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: 'csv',
    includeFilters: true,
    dateRange: {
      from: '',
      to: '',
    },
  });
  const [isExporting, setIsExporting] = useState(false);

  const formatTransactionForExport = (transaction: Transaction) => {
    return {
      ID: transaction.id,
      [t('date')]: new Date(transaction.date).toLocaleDateString(),
      [t('description')]: transaction.description,
      [t('type')]: t(transaction.type),
      [t('category')]: transaction.category || '-',
      [t('amount')]: transaction.amount,
      [t('method')]: transaction.method,
      [t('status')]: t(transaction.status),
      [t('createdAt')]: new Date(transaction.created_at).toLocaleDateString(),
    };
  };

  const filterTransactionsByDateRange = (transactions: Transaction[]) => {
    if (!exportOptions.dateRange?.from && !exportOptions.dateRange?.to) {
      return transactions;
    }

    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      const fromDate = exportOptions.dateRange?.from ? new Date(exportOptions.dateRange.from) : null;
      const toDate = exportOptions.dateRange?.to ? new Date(exportOptions.dateRange.to) : null;

      if (fromDate && transactionDate < fromDate) return false;
      if (toDate && transactionDate > toDate) return false;
      return true;
    });
  };

  const generateFileName = () => {
    const now = new Date();
    const timestamp = now.toISOString().split('T')[0];
    const extension = exportOptions.format === 'csv' ? 'csv' : 'xlsx';
    return `transactions_${timestamp}.${extension}`;
  };

  const exportToCSV = (data: Record<string, unknown>[]) => {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          // Escape commas and quotes in CSV
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, generateFileName());
  };

  const exportToExcel = (data: Record<string, unknown>[]) => {
    if (data.length === 0) return;

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, t('transactions'));

    // Add some styling
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + "1";
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true },
        fill: { fgColor: { rgb: "EEEEEE" } }
      };
    }

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, generateFileName());
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const filteredTransactions = filterTransactionsByDateRange(transactions);
      const formattedData = filteredTransactions.map(formatTransactionForExport);

      if (exportOptions.format === 'csv') {
        exportToCSV(formattedData);
      } else {
        exportToExcel(formattedData);
      }

      if (onExport) {
        onExport(exportOptions);
      }

      onClose();
    } catch (error) {
      console.error('Error exporting transactions:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleQuickExport = (format: 'csv' | 'excel') => {
    const quickOptions: ExportOptions = {
      format: format === 'csv' ? 'csv' : 'excel',
      includeFilters: false,
    };

    const formattedData = transactions.map(formatTransactionForExport);
    
    if (format === 'csv') {
      exportToCSV(formattedData);
    } else {
      exportToExcel(formattedData);
    }

    if (onExport) {
      onExport(quickOptions);
    }
  };

  const getFiltersSummary = () => {
    if (!filters) return null;
    
    const activeFilters = [];
    if (filters.type && filters.type !== 'all') activeFilters.push(`${t('type')}: ${t(filters.type)}`);
    if (filters.status && filters.status !== 'all') activeFilters.push(`${t('status')}: ${t(filters.status)}`);
    if (filters.category) activeFilters.push(`${t('category')}: ${filters.category}`);
    if (filters.dateFrom) activeFilters.push(`${t('from')}: ${filters.dateFrom}`);
    if (filters.dateTo) activeFilters.push(`${t('to')}: ${filters.dateTo}`);
    if (filters.minAmount) activeFilters.push(`${t('minAmount')}: $${filters.minAmount}`);
    if (filters.maxAmount) activeFilters.push(`${t('maxAmount')}: $${filters.maxAmount}`);
    if (filters.search) activeFilters.push(`${t('search')}: ${filters.search}`);
    
    return activeFilters;
  };

  return (
    <>
      <Dropdown>
        <DropdownTrigger>
          <Button
            color="primary"
            variant="flat"
            startContent={<ArrowDownTrayIcon className="h-4 w-4" />}
          >
            {t('export')}
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label={t('exportOptions')}>
          <DropdownItem
            key="csv"
            startContent={<TableCellsIcon className="h-4 w-4" />}
            onClick={() => handleQuickExport('csv')}
          >
            {t('exportCSV')}
          </DropdownItem>
          <DropdownItem
            key="excel"
            startContent={<DocumentArrowDownIcon className="h-4 w-4" />}
            onClick={() => handleQuickExport('excel')}
          >
            {t('exportExcel')}
          </DropdownItem>
          <DropdownItem
            key="advanced"
            startContent={<ArrowDownTrayIcon className="h-4 w-4" />}
            onClick={onOpen}
          >
            {t('advancedExport')}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-xl font-bold">{t('exportTransactions')}</h2>
                <p className="text-sm text-default-500">
                  {t('configureExportOptions')}
                </p>
              </ModalHeader>
              <ModalBody>
                <div className="space-y-6">
                  {/* Export Format */}
                  <Card>
                    <CardBody>
                      <h3 className="text-lg font-semibold mb-4">{t('exportFormat')}</h3>
                      <Select
                        label={t('format')}
                        placeholder={t('selectFormat')}
                        selectedKeys={[exportOptions.format]}
                        onSelectionChange={(keys) => {
                          const selectedKey = Array.from(keys)[0] as 'csv' | 'excel';
                          setExportOptions(prev => ({ ...prev, format: selectedKey }));
                        }}
                      >
                        <SelectItem key="csv">
                          {t('csvFormat')} (.csv)
                        </SelectItem>
                        <SelectItem key="excel">
                          {t('excelFormat')} (.xlsx)
                        </SelectItem>
                      </Select>
                    </CardBody>
                  </Card>

                  {/* Date Range */}
                  <Card>
                    <CardBody>
                      <h3 className="text-lg font-semibold mb-4">{t('dateRange')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                          type="date"
                          label={t('fromDate')}
                          value={exportOptions.dateRange?.from || ''}
                          onChange={(e) => setExportOptions(prev => ({
                            ...prev,
                            dateRange: { 
                              from: e.target.value,
                              to: prev.dateRange?.to || ''
                            }
                          }))}
                        />
                        <Input
                          type="date"
                          label={t('toDate')}
                          value={exportOptions.dateRange?.to || ''}
                          onChange={(e) => setExportOptions(prev => ({
                            ...prev,
                            dateRange: { 
                              from: prev.dateRange?.from || '',
                              to: e.target.value
                            }
                          }))}
                        />
                      </div>
                    </CardBody>
                  </Card>

                  {/* Current Filters */}
                  {filters && getFiltersSummary()?.length && (
                    <Card>
                      <CardBody>
                        <h3 className="text-lg font-semibold mb-4">{t('currentFilters')}</h3>
                        <div className="space-y-2">
                          {getFiltersSummary()?.map((filter, index) => (
                            <div key={index} className="text-sm text-default-600">
                              • {filter}
                            </div>
                          ))}
                        </div>
                        <Divider className="my-4" />
                        <Checkbox
                          isSelected={exportOptions.includeFilters}
                          onValueChange={(checked) => setExportOptions(prev => ({
                            ...prev,
                            includeFilters: checked
                          }))}
                        >
                          {t('includeCurrentFilters')}
                        </Checkbox>
                      </CardBody>
                    </Card>
                  )}

                  {/* Export Summary */}
                  <Card>
                    <CardBody>
                      <h3 className="text-lg font-semibold mb-4">{t('exportSummary')}</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>{t('totalTransactions')}:</span>
                          <span className="font-semibold">
                            {filterTransactionsByDateRange(transactions).length}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('format')}:</span>
                          <span className="font-semibold">
                            {exportOptions.format === 'csv' ? 'CSV' : 'Excel'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>{t('fileName')}:</span>
                          <span className="font-semibold text-xs">
                            {generateFileName()}
                          </span>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  disabled={isExporting}
                >
                  {t('cancel')}
                </Button>
                <Button
                  color="primary"
                  onPress={handleExport}
                  isLoading={isExporting}
                  startContent={!isExporting && <ArrowDownTrayIcon className="h-4 w-4" />}
                >
                  {t('exportNow')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}