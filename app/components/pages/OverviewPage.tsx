'use client';

import StatsCards from '../StatsCards';
import TransactionFeed from '../TransactionFeed';
import LocationActivity from '../LocationActivity';
import RiskAssessment from '../RiskAssessment';
import PreventedLossesChart from '../PreventedLossesChart';
import { useDashboardData } from '@/app/hooks/useDashboardData';

export default function OverviewPage() {
  const { stats, recentTransactions, loading, error } = useDashboardData();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Stats Cards with Blue Border */}
      <div className="rounded-lg p-4 bg-white">
        <StatsCards stats={stats} loading={loading} />
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Risk Assessment */}
        <RiskAssessment />
        
        {/* Prevented Losses Chart */}
        <PreventedLossesChart />
        
        {/* Transaction Feed */}
        <TransactionFeed transactions={recentTransactions} loading={loading} />
        
        {/* Location Activity */}
        <LocationActivity />
      </div>
    </>
  );
}