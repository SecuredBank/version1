'use client';

import { useState, useEffect } from 'react';
import { transactionService, accountService } from '@/lib/api';

export interface DashboardData {
  stats: {
    totalTransactions: number;
    fraudDetected: number;
    preventedLosses: number;
    detectionRate: number;
  };
  recentTransactions: any[];
  loading: boolean;
  error: string | null;
}

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>({
    stats: {
      totalTransactions: 0,
      fraudDetected: 0,
      preventedLosses: 0,
      detectionRate: 0,
    },
    recentTransactions: [],
    loading: true,
    error: null,
  });

  const fetchDashboardData = async () => {
    try {
      setData(prev => ({ ...prev, loading: true, error: null }));

      // Fetch account statistics and transactions in parallel
      const [statsResponse, transactionsResponse] = await Promise.all([
        accountService.getStatistics(),
        transactionService.getAll({}, 1, 10),
      ]);

      if (statsResponse.success && transactionsResponse.success) {
        const stats = statsResponse.data.statistics;
        const transactions = transactionsResponse.data;

        // Calculate fraud statistics from transactions
        const fraudulentTxs = transactions.filter(
          (tx: any) => tx.fraudScore && tx.fraudScore > 70
        );
        const blockedTxs = transactions.filter(
          (tx: any) => tx.status === 'BLOCKED' || tx.status === 'REJECTED'
        );
        
        const totalAmount = transactions.reduce(
          (sum: number, tx: any) => sum + (tx.amount || 0),
          0
        );
        const preventedAmount = blockedTxs.reduce(
          (sum: number, tx: any) => sum + (tx.amount || 0),
          0
        );

        setData({
          stats: {
            totalTransactions: stats.totalTransactions || transactions.length,
            fraudDetected: fraudulentTxs.length,
            preventedLosses: preventedAmount,
            detectionRate: transactions.length > 0 
              ? ((fraudulentTxs.length / transactions.length) * 100)
              : 99.7,
          },
          recentTransactions: transactions.slice(0, 10),
          loading: false,
          error: null,
        });
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setData(prev => ({
        ...prev,
        loading: false,
        error: error.message || 'Failed to fetch dashboard data',
      }));
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { ...data, refetch: fetchDashboardData };
}
