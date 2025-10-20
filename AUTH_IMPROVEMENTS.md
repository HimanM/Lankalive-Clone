# Authentication & Session Management Improvements

## Summary
Added logout functionality and automatic token expiration handling to ensure secure admin sessions.

## Changes Made

### 1. Backend (No changes needed)
- JWT token expiration is already handled by the backend decorator `@requires_role`
- Backend returns 401 status when token is expired or invalid

### 2. Frontend Auth Utilities (`frontend/src/utils/auth.js`)

**Added functions:**
```javascript
export function clearToken() { localStorage.removeItem('ll_token') }
export function logout() { clearToken() }
```

**Purpose:** Clear stored JWT token from localStorage on logout

### 3. API Request Handler (`frontend/src/api/index.js`)

**Added 401 Interceptor:**
```javascript
// Handle 401 Unauthorized - token expired or invalid
if (resp.status === 401) {
  clearToken()
  // Redirect to login page if not already there
  if (!window.location.pathname.includes('/admin/login')) {
    window.location.href = '/admin/login'
  }
  throw new Error('Session expired. Please login again.')
}
```

**How it works:**
- Every API request that returns 401 (Unauthorized) triggers automatic logout
- Token is cleared from localStorage
- User is redirected to login page (unless already there)
- User sees clear error message: "Session expired. Please login again."

### 4. Header Component (`frontend/src/components/Header.jsx`)

**Changes:**
- Import `logout` and `useNavigate` from React Router
- Added `handleLogout` function that calls `logout()` and navigates to `/admin/login`
- Split login/dashboard button into two separate buttons when logged in:
  - **Dashboard button** - Navigate to admin dashboard
  - **Logout button** - Clear token and return to login
- Both desktop and mobile navigation updated

**UI Updates:**
- Desktop: Two buttons side-by-side (Dashboard + Logout)
- Mobile: Two stacked buttons in mobile menu
- Logout button styled with gray background (bg-gray-600) to distinguish from primary actions

### 5. Admin Dashboard (`frontend/src/pages/AdminDashboard.jsx`)

**Changes:**
- Import `logout` function
- Added `handleLogout` function
- Added logout button in header section (top-right of dashboard)
- Button styled consistently with gray background

**UI Updates:**
- Dashboard header now has a flex layout with title on left, logout button on right
- Logout button: `"Logout"` with gray background (bg-gray-600)

## User Experience Flow

### Normal Logout Flow
1. User clicks "Logout" button (in Header or AdminDashboard)
2. `logout()` function clears the JWT token from localStorage
3. User is redirected to `/admin/login`
4. User must login again to access admin features

### Token Expiration Flow
1. User's JWT token expires (default: 1 hour from login)
2. User tries to perform any admin action (create article, upload media, etc.)
3. Backend returns 401 Unauthorized
4. API interceptor catches the 401 response:
   - Clears the expired token from localStorage
   - Redirects user to `/admin/login`
   - Shows error: "Session expired. Please login again."
5. User must login again with valid credentials

### Session Persistence
- JWT token stored in localStorage with key: `ll_token`
- Token persists across browser refreshes/tabs
- Token is sent with every admin API request via `Authorization: Bearer <token>` header
- Backend validates token on every protected route

## Security Benefits

1. **Automatic Session Cleanup**
   - Expired tokens are immediately cleared
   - User cannot continue with invalid session

2. **Clear User Feedback**
   - User knows when their session expired
   - Clear call to action (login again)

3. **Multiple Logout Options**
   - Logout button in main header (always visible)
   - Logout button in admin dashboard
   - Automatic logout on token expiration

4. **Protected Admin Routes**
   - All admin actions require valid, non-expired token
   - 401 handling prevents unauthorized access attempts

## Testing Checklist

### Manual Logout
- [ ] Click logout button in Header (desktop view)
- [ ] Verify redirected to `/admin/login`
- [ ] Verify token cleared from localStorage
- [ ] Try accessing `/admin/dashboard` → should redirect to login
- [ ] Click logout in mobile menu
- [ ] Click logout button on AdminDashboard page

### Token Expiration
- [ ] Login as admin
- [ ] Wait for token to expire (default: 1 hour)
- [ ] Try any admin action (create article, upload media)
- [ ] Verify automatic redirect to login
- [ ] Verify error message displayed
- [ ] Login again and verify full functionality restored

### Edge Cases
- [ ] Logout while on admin page → redirects to login
- [ ] Logout while on public page → Header updates correctly
- [ ] Token expires on public page → no redirect (public pages don't need auth)
- [ ] Multiple tabs: logout in one tab → other tabs handle expired token gracefully
- [ ] Direct URL access to `/admin/dashboard` without token → redirects to login

## Configuration

### JWT Expiration Time
Backend configuration in `backend/app/controllers/decorators.py`:
```python
JWT_EXP_SECONDS = int(os.getenv('JWT_EXP_SECONDS', str(60 * 60)))  # Default: 1 hour
```

To change expiration time, set environment variable:
```bash
export JWT_EXP_SECONDS=3600  # 1 hour
export JWT_EXP_SECONDS=7200  # 2 hours
export JWT_EXP_SECONDS=86400 # 24 hours
```

### JWT Secret
```python
JWT_SECRET = os.getenv('JWT_SECRET', 'dev-secret')  # Change in production!
```

**Important:** Set a strong JWT_SECRET in production environment

## Known Behaviors

1. **Token Check Timing**
   - Token expiration is only checked when making API requests
   - User can stay on a page indefinitely without token validation
   - Token expiration is detected on next API call

2. **Redirect Logic**
   - 401 handler checks if already on login page to prevent redirect loops
   - Redirects use `window.location.href` for full page reload
   - This ensures all React state is cleared properly

3. **localStorage Usage**
   - Token persists in localStorage (survives page refreshes)
   - Shared across all tabs in same domain
   - Cleared on logout or 401 response

## Future Enhancements (Optional)

1. **Token Refresh**
   - Implement refresh token mechanism
   - Automatically renew token before expiration
   - Reduce login frequency for users

2. **Session Timeout Warning**
   - Show warning modal 5 minutes before expiration
   - Allow user to extend session
   - Prevent data loss during article editing

3. **Activity-Based Expiration**
   - Reset expiration timer on user activity
   - Keep session active while user is working
   - More user-friendly than fixed expiration

4. **Remember Me**
   - Option to extend session duration
   - Separate long-lived tokens for "remember me"
   - Balance between security and convenience

5. **Logout All Devices**
   - Backend endpoint to invalidate all user tokens
   - Useful for security incidents
   - Requires token blacklist or database-backed tokens
