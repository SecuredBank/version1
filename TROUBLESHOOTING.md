# Troubleshooting: Frontend Not Connecting to Backend

## Issue
Frontend is not making requests to the real backend server.

## Quick Fixes

### 1. Restart Next.js Development Server

**IMPORTANT:** Next.js only reads `.env` files on startup. You MUST restart the dev server after changing `.env` files.

```bash
# Stop the current dev server (Ctrl+C)
# Then restart:
cd frontend
npm run dev
```

### 2. Verify Environment Variables Are Loaded

Add this temporary debug code to check if env vars are loaded:

**File:** `frontend/app/dashboard/page.tsx`

```typescript
// Add at the top of the component
useEffect(() => {
  console.log('🔍 Environment Check:');
  console.log('MAIN_BACKEND_URL:', process.env.NEXT_PUBLIC_MAIN_BACKEND_URL);
  console.log('AI_SERVICE_URL:', process.env.NEXT_PUBLIC_AI_SERVICE_URL);
}, []);
```

**Expected Output in Browser Console:**
```
🔍 Environment Check:
MAIN_BACKEND_URL: http://localhost:5000/api/v1
AI_SERVICE_URL: http://localhost:8000/api
```

### 3. Check Network Requests

Open Browser DevTools (F12) → Network Tab:

1. Refresh the dashboard page
2. Look for requests to `localhost:5000`
3. Check the request URL, headers, and response

**What to look for:**
- ✅ Request URL should be: `http://localhost:5000/api/v1/accounts/statistics`
- ✅ Request should have `Authorization: Bearer <token>` header
- ✅ Response should be JSON with data

### 4. Verify Backend is Running

```bash
# Test backend health endpoint
curl http://localhost:5000/health

# Expected response:
{
  "status": "success",
  "message": "Server is running"
}
```

### 5. Check CORS Configuration

The backend must allow requests from `http://localhost:3000`.

**File:** `main_backend_service/server.js`

Ensure CORS is configured:
```javascript
import cors from 'cors';

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### 6. Clear Browser Cache and Storage

```javascript
// Open browser console and run:
localStorage.clear();
sessionStorage.clear();
location.reload();
```

Then login again.

## Detailed Debugging Steps

### Step 1: Check API Client Configuration

Add debug logging to the API client:

**File:** `frontend/lib/api.ts`

```typescript
// In the request method, add:
private async request<T>(
  endpoint: string,
  options: RequestInit = {},
  useAIService = false
): Promise<ApiResponse<T>> {
  try {
    const baseURL = useAIService ? this.aiServiceURL : this.mainBackendURL;
    const url = `${baseURL}${endpoint}`;
    
    // DEBUG: Log the request
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      useAIService,
      baseURL
    });
    
    const response = await fetch(url, config);
    
    // DEBUG: Log the response
    console.log('✅ API Response:', {
      url,
      status: response.status,
      ok: response.ok
    });
    
    // ... rest of the code
  }
}
```

### Step 2: Check Authentication Token

```javascript
// In browser console:
console.log('Token:', localStorage.getItem('fraud_detection_token'));
```

If token is `null` or expired:
1. Logout
2. Login again
3. Check if token is saved

### Step 3: Test API Endpoints Directly

```bash
# Get your token from localStorage (browser console)
TOKEN="your_token_here"

# Test account statistics endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/v1/accounts/statistics

# Test transaction history endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5000/api/v1/transactions/history
```

### Step 4: Check for JavaScript Errors

Open Browser Console (F12) → Console Tab

Look for errors like:
- ❌ `Failed to fetch`
- ❌ `CORS error`
- ❌ `Network error`
- ❌ `401 Unauthorized`
- ❌ `404 Not Found`

## Common Issues and Solutions

### Issue 1: "Failed to fetch" or Network Error

**Cause:** Backend is not running or wrong URL

**Solution:**
```bash
# Check if backend is running
curl http://localhost:5000/health

# If not running, start it:
cd main_backend_service
npm run dev
```

### Issue 2: CORS Error

**Error in Console:**
```
Access to fetch at 'http://localhost:5000/api/v1/...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:** Update backend CORS configuration:

```javascript
// main_backend_service/server.js
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Issue 3: 401 Unauthorized

**Cause:** Token is missing, invalid, or expired

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Logout and login again
3. Check token expiration in backend

### Issue 4: 404 Not Found

**Cause:** API endpoint doesn't exist or wrong URL

**Solution:**
1. Check backend routes in `main_backend_service/src/routes/`
2. Verify endpoint paths match between frontend and backend
3. Check for typos in endpoint URLs

### Issue 5: Environment Variables Not Loading

**Cause:** Next.js not restarted after `.env` changes

**Solution:**
```bash
# MUST restart Next.js dev server
# Stop with Ctrl+C, then:
npm run dev
```

**Note:** Environment variables starting with `NEXT_PUBLIC_` are embedded at build time.

### Issue 6: Data Not Displaying

**Cause:** API returns data but in different format

**Solution:**
1. Check browser Network tab for actual API response
2. Compare response structure with frontend expectations
3. Update data transformation logic if needed

## Verification Checklist

Run through this checklist:

- [ ] Backend is running on port 5000
- [ ] Frontend is running on port 3000
- [ ] `.env` file has correct URLs
- [ ] Next.js dev server was restarted after `.env` changes
- [ ] CORS is configured on backend
- [ ] User is logged in with valid token
- [ ] Token is in localStorage
- [ ] Browser console shows no errors
- [ ] Network tab shows requests to `localhost:5000`
- [ ] API responses are successful (200 status)

## Testing API Connection

Create a test page to verify connection:

**File:** `frontend/app/test-api/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { accountService, transactionService } from '@/lib/api';

export default function TestAPIPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAccountStats = async () => {
    try {
      setError(null);
      const response = await accountService.getStatistics();
      setResult(response);
      console.log('✅ Account Stats:', response);
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Error:', err);
    }
  };

  const testTransactions = async () => {
    try {
      setError(null);
      const response = await transactionService.getAll({}, 1, 10);
      setResult(response);
      console.log('✅ Transactions:', response);
    } catch (err: any) {
      setError(err.message);
      console.error('❌ Error:', err);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Connection Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={testAccountStats}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Test Account Statistics
        </button>
        
        <button
          onClick={testTransactions}
          className="px-4 py-2 bg-green-500 text-white rounded ml-2"
        >
          Test Transactions
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

Visit: `http://localhost:3000/test-api`

## Still Not Working?

If you've tried everything above and it's still not working:

1. **Check Backend Logs**
   - Look at the terminal running the backend
   - Check for errors or request logs

2. **Check Frontend Logs**
   - Browser console (F12)
   - Terminal running Next.js

3. **Verify Ports**
   ```bash
   # Check what's running on port 5000
   netstat -ano | findstr :5000  # Windows
   lsof -i :5000                  # Mac/Linux
   ```

4. **Try Different Browser**
   - Test in incognito/private mode
   - Try a different browser

5. **Check Firewall/Antivirus**
   - Temporarily disable to test
   - Add exceptions for localhost ports

## Need More Help?

Provide these details:
1. Browser console errors (screenshot)
2. Network tab showing failed requests
3. Backend terminal logs
4. Frontend terminal logs
5. Output of environment variable check
