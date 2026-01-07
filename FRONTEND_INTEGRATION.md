# Frontend Integration with Django Backend

## ✅ Completed

### 1. API Service Layer (`src/lib/api.ts`)
- Created comprehensive API service layer connecting to Django backend
- Handles JWT authentication (login, register, token refresh)
- Interview endpoints (list, get, conversation token, analyze)
- Subscription endpoints (current, create, cancel, usage)
- Automatic token refresh on 401 errors
- Token management in localStorage

### 2. Voice Integration Updates
- **`RealtimeVoiceInterface`**: Updated to use Django backend's `/api/v1/voice/conversation_token/` endpoint
- Passes `interviewType` to backend for proper interview creation
- Stores `interview_id` for later analysis
- Removed Supabase dependency

### 3. Result Page Updates
- **`ResultPage`**: Updated to use Django backend's `/api/v1/interviews/{id}/analyze/` endpoint
- Receives `interviewId` from ChatPage navigation state
- Maps Django response format to frontend display format
- Handles visa approval/decline results

### 4. Chat Page Updates
- **`ChatPage`**: Now uses `RealtimeVoiceInterface` instead of `VoiceInterface`
- Passes `interviewType` and `agentId` correctly
- Stores `interviewId` when conversation starts
- Passes `interviewId` to ResultPage for analysis

## 🔄 Next Steps

### 1. Environment Variables
Create `.env` file in `dream-achiever-ai/`:
```env
VITE_API_BASE_URL=https://visa.up.railway.app/api
```

### 2. Authentication Pages (Required)
Create these pages:
- **Login Page** (`src/pages/Login.tsx`)
  - Use `authAPI.login(email, password)`
  - Redirect to home after successful login
  - Handle email verification errors

- **Register Page** (`src/pages/Register.tsx`)
  - Use `authAPI.register()`
  - Show success message with email verification instructions
  - Redirect to login after registration

- **Email Verification Page** (`src/pages/VerifyEmail.tsx`)
  - Handle activation link: `/verify-email?uid=...&token=...`
  - Use `authAPI.activate(uid, token)`
  - Show success/error messages

- **Password Reset Pages**
  - Request: `authAPI.resetPassword(email)`
  - Confirm: `authAPI.confirmPasswordReset(uid, token, new_password)`

### 3. Protected Routes
Add authentication check to routes:
- Wrap routes with auth check
- Redirect to login if not authenticated
- Check `is_verified` status before allowing interviews

### 4. Subscription Management UI
- **Subscription Page** (`src/pages/Subscription.tsx`)
  - Display current plan using `subscriptionsAPI.getCurrent()`
  - Show usage info using `subscriptionsAPI.getUsage()`
  - Plan selection and upgrade buttons
  - Integrate Atmos payment flow

### 5. Usage Limits Check
- Before starting interview, check `subscriptionsAPI.getUsage()`
- Show limit reached message if needed
- Redirect to subscription page for upgrade

### 6. Error Handling
- Add global error handler for API errors
- Show user-friendly error messages
- Handle network errors gracefully

## 🧪 Testing Checklist

Before deploying:

- [ ] Test registration flow
- [ ] Test email verification
- [ ] Test login/logout
- [ ] Test conversation token retrieval
- [ ] Test interview flow (start → speak → end)
- [ ] Test interview analysis
- [ ] Test usage limits (free tier)
- [ ] Test subscription creation
- [ ] Test error handling (network errors, API errors)

## 📝 API Endpoints Used

### Authentication
- `POST /api/auth/users/` - Register
- `POST /api/auth/token/login/` - Login
- `POST /api/auth/token/refresh/` - Refresh token
- `POST /api/auth/token/logout/` - Logout
- `GET /api/auth/users/me/` - Get current user
- `POST /api/auth/users/activation/` - Activate account

### Interviews
- `GET /api/v1/interviews/` - List interviews
- `GET /api/v1/interviews/{id}/` - Get interview
- `POST /api/v1/voice/conversation_token/` - Get ElevenLabs token
- `POST /api/v1/interviews/{id}/analyze/` - Analyze interview
- `GET /api/v1/interviews/{id}/result/` - Get results

### Subscriptions
- `GET /api/v1/subscription/current/` - Get current subscription
- `POST /api/v1/subscription/create_subscription/` - Create subscription
- `POST /api/v1/subscription/cancel/` - Cancel subscription
- `GET /api/v1/usage/info/` - Get usage info

## 🚀 Deployment

1. **Set environment variables** in Vercel/Netlify:
   - `VITE_API_BASE_URL=https://visa.up.railway.app/api`

2. **Build and deploy**:
   ```bash
   npm run build
   # Deploy to Vercel/Netlify
   ```

3. **Update CORS** on backend if needed:
   - Add frontend domain to `CORS_ALLOWED_ORIGINS` in Django settings

## 📚 Files Modified

- `src/lib/api.ts` - **NEW** - API service layer
- `src/components/RealtimeVoiceInterface.tsx` - Updated to use Django API
- `src/pages/ChatPage.tsx` - Updated to use RealtimeVoiceInterface
- `src/pages/ResultPage.tsx` - Updated to use Django analyze endpoint

## 🔗 Backend URL

Current backend: `https://visa.up.railway.app/api`

Make sure this matches your deployed backend URL!

