# Dashboard Integration Documentation

## Overview
This document describes the integration of the frontend dashboard with the backend API services. The dashboard now displays real-time data from the main backend service and AI service.

## Architecture

### Data Flow
```
Frontend Dashboard → API Client → Main Backend Service → Database
                                ↓
                           AI Service (Fraud Detection)
```

## Integrated Components

### 1. Overview Page (`app/components/pages/OverviewPage.tsx`)
**Status:** ✅ Integrated

**Features:**
- Real-time statistics display
- Recent transactions feed
- Risk assessment visualization
- Prevented losses chart

**API Endpoints Used:**
- `GET /api/v1/accounts/statistics` - Account statistics
- `GET /api/v1/transactions/history` - Transaction history

**Data Displayed:**
- Total Transactions count
- Fraud Detected count
- Prevented Losses amount
- Detection Rate percentage
- Recent 10 transactions

### 2. Stats Cards (`app/components/StatsCards.tsx`)
**Status:** ✅ Integrated

**Props:**
```typescript
interface StatsCardsProps {
  stats?: {
    totalTransactions: number;
    fraudDetected: number;
    preventedLosses: number;
    detectionRate: number;
  };
  loading?: boolean;
}
```

**Features:**
- Dynamic data loading
- Number formatting (1,234,567)
- Currency formatting ($1,234,567)
- Percentage formatting (99.7%)
- Loading states

### 3. Transaction Feed (`app/components/TransactionFeed.tsx`)
**Status:** ✅ Integrated

**Props:**
```typescript
interface TransactionFeedProps {
  transactions?: any[];
  loading?: boolean;
}
```

**Features:**
- Real-time transaction display
- Time ago formatting (2m, 5h, 3d)
- Status color coding
- Transaction details popup
- Empty state handling

### 4. Transactions Page (`app/components/pages/TransactionsPage.tsx`)
**Status:** ✅ Integrated

**Features:**
- Full transaction list (up to 50 items)
- Fraud score display
- Status mapping (COMPLETED → Approved, BLOCKED → Blocked)
- Risk percentage display
- Error handling
- Loading states

## Custom Hooks

### `useDashboardData` Hook
**Location:** `app/hooks/useDashboardData.ts`

**Purpose:** Centralized data fetching for dashboard statistics and transactions

**Returns:**
```typescript
{
  stats: {
    totalTransactions: number;
    fraudDetected: number;
    preventedLosses: number;
    detectionRate: number;
  };
  recentTransactions: any[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}
```

**Usage:**
```typescript
const { stats, recentTransactions, loading, error, refetch } = useDashboardData();
```

## API Services

### Updated Services (`lib/api.ts`)

#### Account Service
```typescript
export const accountService = {
  getStatistics: () => apiClient.getAccountStatistics(),
  getAccounts: () => apiClient.getUserAccounts(),
};
```

#### Transaction Service
```typescript
export const transactionService = {
  getAll: (filters?, page?, limit?) => apiClient.getTransactions(filters, page, limit),
  getById: (id: string) => apiClient.getTransactionDetails(id),
};
```

## Configuration Updates

### API Endpoints (`lib/config.ts`)
Added new endpoints:
```typescript
ACCOUNTS: {
  LIST: '/accounts',
  STATISTICS: '/accounts/statistics',
  DETAILS: '/accounts/:id',
}
```

Updated transaction endpoint:
```typescript
TRANSACTIONS: {
  LIST: '/transactions/history',  // Changed from '/transactions'
  // ...
}
```

## Data Transformations

### Transaction Status Mapping
```typescript
Backend Status → Frontend Display
COMPLETED      → Approved
PENDING        → Pending
BLOCKED        → Blocked
REJECTED       → Blocked
FLAGGED        → Suspicious
```

### Fraud Score to Risk Display
- Score > 70: Display as "Risk: XX%"
- Score ≤ 50: No risk display
- Used for color coding and alerts

### Time Formatting
```typescript
< 1 minute  → "now"
< 60 mins   → "Xm"
< 24 hours  → "Xh"
≥ 24 hours  → "Xd"
```

## Testing the Integration

### Prerequisites
1. Main Backend Service runn