# 🧪 Frontend Testing Checklist

## Local Testing (http://localhost:5173)

### 1. Authentication Flow
- [ ] **Registration**
  - Go to `/register`
  - Fill in email, username, password
  - Submit and check for success message
  - Verify email is sent (check console/email)

- [ ] **Email Verification**
  - Check email inbox for verification link
  - Click link or manually go to `/verify-email?uid=...&token=...`
  - Verify account activation works
  - Should redirect to home after success

- [ ] **Login**
  - Go to `/login`
  - Enter credentials
  - Should redirect to home
  - Check that user info appears in header

- [ ] **Logout**
  - Click logout button
  - Should clear session and redirect to home

### 2. Protected Routes
- [ ] **Unauthenticated Access**
  - Logout if logged in
  - Try to access `/visa` or `/chat/visa-work`
  - Should redirect to `/login`

- [ ] **Authenticated Access**
  - Login
  - Access `/visa` - should work
  - Access `/chat/visa-work` - should work

### 3. Interview Flow
- [ ] **Start Interview**
  - Go to `/visa`
  - Select a visa type (e.g., Work Visa)
  - Click "Start Interview"
  - Should get conversation token from backend
  - ElevenLabs connection should establish

- [ ] **Voice Interaction**
  - Speak into microphone
  - Verify transcript appears
  - Verify AI responds
  - Check that conversation flows naturally

- [ ] **End Interview**
  - Click "End Interview"
  - Should navigate to results page
  - Interview ID should be passed

### 4. Results & Analysis
- [ ] **View Results**
  - After ending interview
  - Should see analysis page
  - Should show approval/decline decision
  - Should show feedback and score

### 5. Usage Limits
- [ ] **Free Tier Limit**
  - Use 1 interview (free tier)
  - Try to start another interview
  - Should show limit reached message
  - Should offer upgrade option

- [ ] **Usage Display**
  - Go to `/subscription`
  - Should show current usage (e.g., "1 / 1 interviews used")
  - Should show remaining interviews

### 6. Subscription Page
- [ ] **View Plans**
  - Go to `/subscription`
  - Should see 3 plans (Free, Starter, Professional)
  - Current plan should be highlighted

- [ ] **Upgrade Flow**
  - Click "Upgrade" on Starter or Professional
  - Should call backend API
  - Should update subscription status
  - Should refresh usage info

### 7. Error Handling
- [ ] **Network Errors**
  - Disconnect internet
  - Try to login/register
  - Should show error message

- [ ] **Invalid Credentials**
  - Try to login with wrong password
  - Should show error message

- [ ] **API Errors**
  - Check browser console
  - Should not see unhandled errors

### 8. UI/UX
- [ ] **Responsive Design**
  - Test on mobile viewport
  - Test on tablet viewport
  - Test on desktop
  - All pages should be responsive

- [ ] **Loading States**
  - Buttons should show loading spinners
  - Pages should show loading indicators

- [ ] **Toast Notifications**
  - Success messages appear
  - Error messages appear
  - Messages auto-dismiss

## Browser Console Checks

Open DevTools → Console and verify:
- [ ] No red errors
- [ ] API calls are successful (200 status)
- [ ] JWT tokens are stored in localStorage
- [ ] No CORS errors

## Network Tab Checks

Open DevTools → Network and verify:
- [ ] API calls go to correct backend URL
- [ ] Authorization headers are sent
- [ ] Responses are JSON format
- [ ] No 401/403 errors (after login)

## Common Issues & Fixes

### Issue: CORS Errors
**Fix:** Update backend `CORS_ALLOWED_ORIGINS` to include `http://localhost:5173`

### Issue: 401 Unauthorized
**Fix:** 
- Check if token is in localStorage
- Verify token hasn't expired
- Try logging in again

### Issue: Email Verification Not Working
**Fix:**
- Check backend `FRONTEND_URL` is set correctly
- Verify email service is configured
- Check email spam folder

### Issue: Interview Won't Start
**Fix:**
- Check usage limits
- Verify ElevenLabs API key is set in backend
- Check browser console for errors

## Production Testing (After Deployment)

1. Test with production backend URL
2. Test email verification with production frontend URL
3. Test all flows end-to-end
4. Test on different devices/browsers
5. Monitor error logs

## Performance Checks

- [ ] Page load times < 3 seconds
- [ ] API response times < 1 second
- [ ] No memory leaks (check DevTools → Memory)
- [ ] Smooth animations and transitions

---

**Note:** The vulnerabilities in `npm audit` are in dev dependencies (esbuild/vite) and don't affect production builds. They're safe to ignore for now, or you can run `npm audit fix --force` if you want to update (may require testing).

