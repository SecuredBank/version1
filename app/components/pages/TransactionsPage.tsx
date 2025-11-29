'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import TransactionDetailsPopup from '../TransactionDetailsPopup';
import { transactionService } from '@/lib/api';

interface Transaction {
  _id?: string;
  name: string;
  amount: string;
  location: string;
  app: string;
  type: string;
  status: string;
  time: string;
  risk?: string | null;
  fraudScore?: number;
}

export default function TransactionsPage() {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showTransactionDetails, setShowTransactionDetails] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionService.getAll({}, 1, 50);
      
      if (response.success) {
        const formattedTxs = response.data.map((tx: any) => {
          const senderName = tx.sender?.firstName 
            ? `${tx.sender.firstName} ${tx.sender.lastName}` 
            : 'Unknown User';
          
          const formatTimeAgo = (date: string) => {
            const now = new Date();
            const txDate = new Date(date);
            const diffMs = now.getTime() - txDate.getTime();
            const diffMins = Math.floor(diffMs / 60000);
            
            if (diffMins < 1) return 'now';
            if (diffMins < 60) return `${diffMins} min ago`;
            const diffHours = Math.floor(diffMins / 60);
            if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
            return `${Math.floor(diffHours / 24)} day${Math.floor(diffHours / 24) > 1 ? 's' : ''} ago`;
          };

          const mapStatus = (status: string) => {
            const statusMap: { [key: string]: string } = {
              'COMPLETED': 'Approved',
              'PENDING': 'Pending',
              'BLOCKED': 'Blocked',
              'REJECTED': 'Blocked',
              'FLAGGED': 'Suspicious',
            };
            return statusMap[status] || 'Suspicious';
          };

          return {
            _id: tx._id,
            name: senderName,
            amount: `$${tx.amount?.toLocaleString() || '0'}`,
            location: tx.location || 'Unknown',
            app: tx.channel || 'via Web App',
            type: tx.type || 'Transfer',
            status: mapStatus(tx.status),
            time: tx.createdAt ? formatTimeAgo(tx.createdAt) : 'now',
            risk: tx.fraudScore && tx.fraudScore > 50 ? `${tx.fraudScore}%` : null,
            fraudScore: tx.fraudScore,
          };
        });
        
        setTransactions(formattedTxs);
      }
    } catch (err: any) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Suspicious':
        return 'bg-yellow-100 text-yellow-800';
      case 'Blocked':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-green-500" />
          <h1 className="text-2xl font-semibold text-gray-900">Real-Time Transaction Feed</h1>
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading transactions...</div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
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
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                  {transaction.status}
                </span>
                <span className="text-sm text-gray-500">{transaction.time}</span>
                {transaction.risk && (
                  <span className="text-sm font-medium text-red-600">
                    Risk: {transaction.risk}
                  </span>
                )}
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
      
      <TransactionDetailsPopup 
        isOpen={showTransactionDetails}
        onClose={() => setShowTransactionDetails(false)}
        transaction={selectedTransaction}
      />
    </div>
  );
}