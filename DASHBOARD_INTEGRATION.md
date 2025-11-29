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
1. Main Backend Service running on `http://localhost:5000`
2. AI Service running on `http://localhost:8000`
3. Frontend running on `http://localhost:3000`
4. Valid authentication token in localStorage

### Test Steps

#### 1. Test Dashboard Statistics
```bash
# Navigate to dashboard
http://localhost:3000/dashboard

# Expected: Stats cards show real numbers
# - Total Transactions: Actual count from DB
# - Fraud Detected: Count of high-risk transactions
# - Prevented Losses: Sum of blocked transaction amounts
# - Detection Rate: Calculated percentage
```

#### 2. Test Transaction Feed
```bash
# Check Overview page transaction feed
# Expected: Shows last 10 transactions with:
# - Sender name
# - Amount formatted as currency
# - Time ago format
# - Status badge (color-coded)
```

#### 3. Test Transactions Page
```bash
# Navigate to Transactions tab
http://localhost:3000/dashboard (click Transactions)

# Expected: Full list of transactions with:
# - All transaction details
# - Fraud scores for suspicious transactions
# - Proper status mapping
# - Click to view details popup
```

#### 4. Test Error Handling
```bash
# Stop backend service
# Expected: Error message displayed
# - "Error loading dashboard: [error message]"
# - No app crash
# - Graceful degradation
```

#### 5. Test Loading States
```bash
# Refresh page with network throttling
# Expected: Loading indicators show
# - "Loading transactions..."
# - "..." in stat cards
```

## API Response Examples

### Account Statistics Response
```json
{
  "success": true,
  "data": {
    "statistics": {
      "totalTransactions": 2847592,
      "totalAccounts": 15234,
      "activeAccounts": 14890,
      "totalBalance": 125000000
    }
  }
}
```

### Transaction History Response
```json
{
  "success": true,
  "data": [
    {
      "_id": "tx_123",
      "sender": {
        "firstName": "John",
        "lastName": "Doe"
      },
      "receiver": {
        "firstName": "Jane",
        "lastName": "Smith"
      },
      "amount": 25000,
      "type": "TRANSFER",
      "status": "COMPLETED",
      "fraudScore": 15,
      "location": "Kigali, Rwanda",
      "channel": "via Mobile App",
      "createdAt": "2024-11-29T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

## Error Handling

### Network Errors
```typescript
try {
  const response = await transactionService.getAll();
} catch (error) {
  // Display user-friendly error message
  setError(error.message || 'Failed to fetch data');
}
```

### Authentication Errors
- 401 Unauthorized: Redirect to login
- 403 Forbidden: Show access denied message

### Data Validation
- Empty arrays: Show "No transactions found"
- Missing fields: Use fallback values (e.g., "Unknown")

## Performance Optimizations

### Parallel Data Fetching
```typescript
const [statsResponse, transactionsResponse] = await Promise.all([
  accountService.getStatistics(),
  transactionService.getAll({}, 1, 10),
]);
```

### Pagination
- Overview: Fetch only 10 recent transactions
- Transactions Page: Fetch 50 transactions
- Future: Implement infinite scroll or pagination

### Caching
- Consider implementing React Query or SWR for:
  - Automatic refetching
  - Cache management
  - Optimistic updates

## Future Enhancements

### Phase 3: Real-time Updates
- [ ] WebSocket integration for live transaction updates
- [ ] Real-time fraud alerts
- [ ] Live statistics updates

### Phase 4: Advanced Features
- [ ] Transaction filtering and search
- [ ] Date range selection
- [ ] Export to CSV/PDF
- [ ] Advanced analytics charts
- [ ] Fraud pattern visualization

### Phase 5: Alerts Integration
- [ ] Connect AlertsPage to backend alerts API
- [ ] Real-time alert notifications
- [ ] Alert management (investigate, dismiss)
- [ ] Alert history and trends

## Troubleshooting

### Issue: Stats showing 0 or incorrect values
**Solution:** 
- Check backend API response format
- Verify authentication token is valid
- Check browser console for API errors

### Issue: Transactions not loading
**Solution:**
- Verify backend service is running
- Check API endpoint configuration in `lib/config.ts`
- Verify user has transactions in database

### Issue: "Failed to fetch" errors
**Solution:**
- Check CORS configuration on backend
- Verify API URLs in `.env` file
- Check network tab in browser DevTools

## Related Files

### Frontend
- `app/hooks/useDashboardData.ts` - Dashboard data hook
- `app/components/StatsCards.tsx` - Statistics display
- `app/components/TransactionFeed.tsx` - Transaction feed
- `app/components/pages/OverviewPage.tsx` - Overview page
- `app/components/pages/TransactionsPage.tsx` - Transactions page
- `lib/api.ts` - API client and services
- `lib/config.ts` - API configuration

### Backend
- `main_backend_service/src/routes/transaction.routes.js`
- `main_backend_service/src/routes/account.routes.js`
- `main_backend_service/src/controllers/transaction.controllers.js`
- `main_backend_service/src/controllers/account.controllers.js`

## Summary

The dashboard is now fully integrated with the backend API, displaying real transaction data, statistics, and fraud detection information. All components handle loading states, errors, and empty states gracefully. The integration follows best practices for data fetching, error handling, and user experience.
