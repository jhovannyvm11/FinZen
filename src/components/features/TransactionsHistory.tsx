import React from 'react';
import { Card, CardBody } from '@heroui/react';

// SVG Icons
const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 9C8.55228 9 9 8.55228 9 8C9 7.44772 8.55228 7 8 7C7.44772 7 7 7.44772 7 8C7 8.55228 7.44772 9 8 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 4C8.55228 4 9 3.55228 9 3C9 2.44772 8.55228 2 8 2C7.44772 2 7 2.44772 7 3C7 3.55228 7.44772 4 8 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M8 14C8.55228 14 9 13.5523 9 13C9 12.4477 8.55228 12 8 12C7.44772 12 7 12.4477 7 13C7 13.5523 7.44772 14 8 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NetflixLogo = () => (
  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2L6 14L10 2L14 14" fill="white"/>
    </svg>
  </div>
);

const SpotifyLogo = () => (
  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.7 11.5c-.1.2-.4.3-.6.2-1.6-1-3.6-1.2-6-.7-.2.1-.4-.1-.5-.3-.1-.2.1-.4.3-.5 2.6-.6 4.8-.3 6.6.8.2.1.3.3.2.5zm.8-1.8c-.2.3-.5.4-.8.2-1.8-1.1-4.6-1.4-6.8-.8-.3.1-.5-.1-.6-.3-.1-.3.1-.5.3-.6 2.5-.7 5.6-.4 7.7.9.3.2.4.4.2.6zm.1-1.9c-2.2-1.3-5.8-1.4-7.9-.8-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 2.4-.7 6.4-.6 8.9.9.3.2.4.5.2.8-.2.2-.6.3-.9.2z" fill="white"/>
    </svg>
  </div>
);

interface Transaction {
  id: string;
  description: string;
  method: string;
  date: string;
  amount: number;
  logo?: React.ReactNode;
  initials?: string;
}

const transactions: Transaction[] = [
  {
    id: '1',
    description: 'Orlando Rodrigues',
    method: 'Bank account',
    date: '2024/04/01',
    amount: 750.00,
    initials: 'OR'
  },
  {
    id: '2',
    description: 'Netflix',
    method: 'Credit card',
    date: '2024/03/29',
    amount: -9.90,
    logo: <NetflixLogo />
  },
  {
    id: '3',
    description: 'Spotify',
    method: 'Credit card',
    date: '2024/03/29',
    amount: -19.90,
    logo: <SpotifyLogo />
  },
  {
    id: '4',
    description: 'Carl Andrew',
    method: 'Bank account',
    date: '2024/03/27',
    amount: 400.00,
    initials: 'CA'
  },
  {
    id: '5',
    description: 'Maria Silva',
    method: 'Bank account',
    date: '2024/03/25',
    amount: -150.00,
    initials: 'MS'
  }
];

const TransactionsHistory: React.FC = () => {
  return (
    <Card className="w-full">
      <CardBody className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-1">
            Last transactions
          </h3>
          <p className="text-sm text-foreground-500">
            Check your last transactions
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-divider">
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground-500">
                  Description
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground-500">
                  Method
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground-500">
                  Date
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-foreground-500">
                  Amount
                </th>
                <th className="w-12 py-3 px-4"></th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b border-divider last:border-b-0">
                  {/* Description Column */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      {transaction.logo ? (
                        transaction.logo
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-default-100 border border-divider flex items-center justify-center">
                          <span className="text-xs font-medium text-foreground-600">
                            {transaction.initials}
                          </span>
                        </div>
                      )}
                      <span className="text-sm font-medium text-foreground">
                        {transaction.description}
                      </span>
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
                      {transaction.date}
                    </span>
                  </td>

                  {/* Amount Column */}
                  <td className="py-4 px-4">
                    <span 
                      className={`text-sm font-medium ${
                        transaction.amount > 0 
                          ? 'text-success' 
                          : 'text-foreground'
                      }`}
                    >
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </span>
                  </td>

                  {/* Actions Column */}
                  <td className="py-4 px-4">
                    <button className="text-foreground-400 hover:text-foreground-600 transition-colors">
                      <MoreIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
};

export default TransactionsHistory;