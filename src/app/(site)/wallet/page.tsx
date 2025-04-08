// src/app/(site)/wallet/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Star, Zap, ArrowDown, ArrowUp, Loader } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: string;
  amount: number;
  type: 'DEPOSIT' | 'BOOST' | 'REWARD';
  description: string;
  createdAt: string;
}

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const response = await fetch('/api/wallet');
        if (!response.ok) {
          throw new Error('Failed to fetch wallet data');
        }
        const data = await response.json();
        setBalance(data.balance);
        setTransactions(data.transactions);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch wallet data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  const handleDeposit = async (amount: number) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wallet/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      const data = await response.json();
      setBalance(data.balance);
      setTransactions(prev => [data.transaction, ...prev]);
      toast.success(`Successfully deposited $${amount}`);
    } catch (error) {
      console.error('Error depositing funds:', error);
      setError(error instanceof Error ? error.message : 'Failed to deposit funds');
      toast.error('Failed to deposit funds');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center">
        <Loader className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Cosmic Wallet</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Manage your funds and boost your promotions
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* Balance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Star className="text-yellow-500" size={20} />
            <span>Wallet Balance</span>
          </div>
          <div className="text-2xl font-bold">${balance.toLocaleString()}</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Zap className="text-yellow-500" size={20} />
            <span>Available Boosts</span>
          </div>
          <div className="text-2xl font-bold">{Math.floor(balance / 50)}</div>
        </div>
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-2">
            <Star className="text-purple-500" size={20} />
            <span>Cosmic Points</span>
          </div>
          <div className="text-2xl font-bold">750</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleDeposit(100)}
          disabled={isLoading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <ArrowDown size={18} />
          )}
          <span>Deposit $100</span>
        </button>
        <button
          onClick={() => handleDeposit(500)}
          disabled={isLoading}
          className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader className="animate-spin" size={18} />
          ) : (
            <ArrowDown size={18} />
          )}
          <span>Deposit $500</span>
        </button>
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400 border-b dark:border-neutral-700">
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Description</th>
                <th className="p-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b dark:border-neutral-700">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {transaction.type === 'DEPOSIT' ? (
                        <ArrowDown className="text-green-500" size={16} />
                      ) : (
                        <ArrowUp className="text-red-500" size={16} />
                      )}
                      <span>{transaction.type}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={
                        transaction.amount > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }
                    >
                      {transaction.amount > 0 ? '+' : ''}
                      ${Math.abs(transaction.amount).toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4">{transaction.description}</td>
                  <td className="p-4">
                    {new Date(transaction.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
