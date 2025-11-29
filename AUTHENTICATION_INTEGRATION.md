# Frontend-Backend Authentication Integration Guide

## ✅ Completed Integration

The frontend authentication system has been successfully integrated with the backend API.

---

## 🔐 Authentication Flow

### 1. **Sign In Flow**
```
User enters credentials
  ↓
Frontend calls: POST /api/v1/auth/login
  ↓
Backend validates credentials
  ↓
Returns: { user, token, refreshToken }
  ↓
Frontend stores in localStorage
  ↓
Redirect to /dashboard
```

### 2. **Sign Up Flow**
```
User fills registration form
  ↓
Frontend calls: POST /api/v1/auth/register
  ↓
Backend creates user account
  ↓
Returns: { user, token, refreshToken }
  ↓
Frontend stores in localStorage
  ↓
Redirect to /dashboard
```

### 3. **Protected Routes**
```
User accesses /dashboard
  ↓
AuthWrapper checks authentication
  ↓
If authenticated: Show dashboard
If not: Redirect to /auth/signin
```

---

## 📁 Files Modified

### 1. **Authentication Pages**
- `app/auth/signin/page.tsx` - Now uses real API
- `app/auth/signup/page.tsx` - Now uses real API

### 2. **New Files Created**
- `app/contexts/AuthContext.tsx` - React Context for auth state
- `app/components/ProtectedRoute.tsx` - Route protection component

### 3. **Updated Files**
- `app/layout.tsx` - Added AuthProvider
- `app/components/AuthWrapper.tsx` - Uses AuthContext

---

## 🔧 Configuration

### Environment Variables (.env)
```env
NEXT_PUBLIC_MAIN_BACKEND_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_AI_SERVICE_URL=http://localhost:8000/api
NEXT_PUBLIC_WS_URL=ws://localhost:8000/ws
```

### API Endpoints Used
- **Login**: `POST /api/v1/auth/login`
- **Register**: `POST /api/v1/auth/register`
- **Logout**: `POST /api/v1/auth/logout`

---

## 💡 Usage Examples

### Using Auth in Components

```typescript
import { useAuth } from '@/app/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && (
        <p>Welcome, {user?.firstName}!</p>
      )}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes

```typescript
import AuthWrapper from '@/app/components/AuthWrapper';

export default function ProtectedPage() {
  return (
    <AuthWrapper>
      <YourProtectedContent />
    </AuthWrapper>
  );
}
```

### Making Authenticated API Calls

```typescript
import { apiClient } from '@/lib/api';

// The API client automatically includes the auth token
const response = await apiClient.getDashboardStats();
```

---

## 🔑 Token Management

### Storage
- **Auth Token**: Stored in `localStorage` as `fraud_detection_token`
- **Refresh Token**: Stored in `localStorage` as `fraud_detection_refresh_token`
- **User Data**: Stored in `localStorage` as `fraud_detection_user`

### Auto-Injection
The API client automatically:
1. Retrieves the token from localStorage
2. Adds it to request headers: `Authorization: Bearer <token>`
3. Handles token expiration (TODO: implement refresh)

---

## 🧪 Testing the Integration

### 1. Start Backend Services

```bash
# Terminal 1: Main Backend Service
cd main_backend_service
npm run dev

# Terminal 2: AI Service
cd ai_service
uvicorn src.server:app --reload
```

### 2. Start Frontend

```bash
# Terminal 3: Frontend
cd frontend
npm run dev
```

### 3. Test Authentication

1. **Sign Up**
   - Go to: http://localhost:3000/auth/signup
   - Fill in the form
   - Click "Create account"
   - Should redirect to dashboard

2. **Sign In**
   - Go to: http://localhost:3000/auth/signin
   - Enter credentials
   - Click "Sign in"
   - Should redirect to dashboard

3. **Protected Routes**
   - Try accessing: http://localhost:3000/dashboard
   - If not logged in: Redirects to signin
   - If logged in: Shows dashboard

4. **Logout**
   - Click logout button in dashboard
   - Should redirect to signin page
   - Token should be cleared from localStorage

---

## 🐛 Troubleshooting

### Issue: "Network Error" on Login

**Solution:**
1. Check if backend is running: `curl http://localhost:5000/health`
2. Verify CORS is enabled in backend
3. Check browser console for errors

### Issue: "Unauthorized" Error

**Solution:**
1. Check if token is stored: Open DevTools → Application → Local Storage
2. Verify token format in API requests
3. Check token expiration

### Issue: Infinite Redirect Loop

**Solution:**
1. Clear localStorage: `localStorage.clear()`
2. Check AuthWrapper logic
3. Verify backend returns correct user data

### Issue: CORS Errors

**Solution:**
Add to backend (main_backend_service/server.js):
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

---

## 🚀 Next Steps

### Phase 2: Dashboard Integration
- [ ] Fetch real dashboard stats from API
- [ ] Display user information
- [ ] Show real-time transactions
- [ ] Integrate fraud detection alerts

### Phase 3: Transaction Management
- [ ] Transaction list with real data
- [ ] Transaction details modal
- [ ] Transaction filtering
- [ ] Real-time updates via WebSocket

### Phase 4: Advanced Features
- [ ] Token refresh mechanism
- [ ] Remember me functionality
- [ ] Password reset flow
- [ ] Email verification
- [ ] 2FA integration

---

## 📝 API Response Format

### Successful Login Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "user_123",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "user",
      "createdAt": "2025-11-29T10:00:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Invalid credentials",
  "message": "Email or password is incorrect"
}
```

---

## ✅ Integration Checklist

- [x] Sign in page connected to API
- [x] Sign up page connected to API
- [x] Auth context provider created
- [x] Protected route component created
- [x] Token storage implemented
- [x] Auto token injection in API calls
- [x] Logout functionality
- [x] Auth state management
- [ ] Token refresh mechanism
- [ ] Error handling improvements
- [ ] Loading states
- [ ] Success/error notifications

---

## 🎉 Status

**Authentication integration is COMPLETE and FUNCTIONAL!**

Users can now:
- ✅ Register new accounts
- ✅ Sign in with credentials
- ✅ Access protected routes
- ✅ Stay authenticated across page refreshes
- ✅ Logout securely

**Ready for Phase 2: Dashboard Integration**

