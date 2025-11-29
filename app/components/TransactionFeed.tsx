'use client';

import { useState } from 'react';
import { Activity } from 'lucide-react';
import TransactionDetailsPopup from './TransactionDetailsPopup';

interface Transaction {
  _id?: string;
  name?: string;
  amount: number | string;
  location?: string;
  app?: string;
  type: string;
  status: string;
  time?: string;
  createdAt?: string;
  sender?: any;
  receiver?: any;
  description?: string;
}

interface TransactionFeedProps {
  transactions?: any[];
  loading?: boolean;
}

export default function TransactionFeed({ transactions: propTransactions, loading }: TransactionFeedProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const txDate = new Date(date);
    const diffMs = now.getTime() - txDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    return `${Math.floor(diffHours / 24)}d`;
  };

  const formatTransaction = (tx: any): Transaction => {
    const senderName = tx.sender?.firstName 
      ? `${tx.sender.firstName} ${tx.sender.lastName}` 
      : 'Unknown';
    
    return {
      _id: tx._id,
      name: senderName,
      amount: typeof tx.amount === 'number' ? `$${tx.amount.toLocaleString()}` : tx.amount,
      location: tx.location || 'Unknown',
      app: tx.channel || 'via Web App',
      type: tx.type || 'Transfer',
      status: tx.status?.toLowerCase() || 'pending',
      time: tx.createdAt ? formatTimeAgo(tx.createdAt) : 'now',
      ...tx,
    };
  };

  const transactions = propTransactions?.map(formatTransaction) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'flagged':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-6">
        <Activity className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">Real-Time Transaction Feed</h3>
      </div>
      
      {loading ? (
        <div className="text-center py-8 text-gray-500">Loading transactions...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">No transactions found</div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction, index) => (
          <div 
            key={index} 
            onClick={() => {
              setSelectedTransaction(transaction);
              setShowTransactionDetails(true);
            }}
            className="flex cursor-pointer items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {transaction.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900">{transaction.name}</span>
                  <span className="font-bold text-gray-900">{transaction.amount}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{transaction.location}</span>
                  <span>•</span>
                  <span>{transaction.app}</span>
                  <span>•</span>
                  <span>{transaction.type}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                {transaction.status}
              </span>
              <span className="text-sm text-gray-500">{transaction.time}</span>
            </div>
          </div>
          ))}
        </div>
      )}
      
      <TransactionDetailsPopup 
        isOpen={showTransactionDetails}
        onClose={() => setShowTransactionDetails(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}