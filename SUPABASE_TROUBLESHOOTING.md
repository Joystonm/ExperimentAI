# Supabase Authentication Troubleshooting

## Current Errors and Solutions

### 1. ❌ "Email not confirmed"

**Problem**: Supabase requires email confirmation by default.

**Solution**: Disable email confirmation in Supabase (for development):

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Settings**
3. Scroll to **Email Auth**
4. **Disable** "Enable email confirmations"
5. Click **Save**

Now users can sign up and login immediately without email verification.

---

### 2. ❌ "Email rate limit exceeded" (429 error)

**Problem**: Too many signup/login attempts in a short time.

**Solutions**:

**Option A - Wait**: Wait 5-10 minutes before trying again

**Option B - Use different email**: Try signing up with a different email address

**Option C - Adjust rate limits** (Supabase Dashboard):
1. Go to **Authentication** → **Rate Limits**
2. Increase limits for development
3. Save changes

---

### 3. ❌ CORS Error / "Failed to fetch"

**Problem**: Supabase URL or API key is incorrect, or CORS is not configured.

**Solutions**:

**Step 1 - Verify Environment Variables**:

Check your `.env` file:
```env
VITE_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

**Step 2 - Get Correct Values**:
1. Go to Supabase Dashboard
2. Select your project
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

**Step 3 - Restart Dev Server**:
```bash
# Stop the server (Ctrl+C)
npm run dev
```

**Step 4 - Clear Browser Cache**:
- Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Or clear browser cache completely

---

## Quick Setup Checklist

### ✅ Supabase Configuration

1. **Create Supabase Project**:
   - Go to https://supabase.com/dashboard
   - Create new project or use existing

2. **Disable Email Confirmation** (Development):
   - Authentication → Settings
   - Disable "Enable email confirmations"
   - Save

3. **Get API Credentials**:
   - Settings → API
   - Copy Project URL
   - Copy anon/public key

4. **Configure Environment**:
   ```bash
   # Create .env file
   cp .env.example .env
   
   # Edit .env with your values
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGc...
   ```

5. **Restart Server**:
   ```bash
   npm run dev
   ```

---

## Testing Authentication

### Test Signup:
1. Go to http://localhost:3000/signup
2. Use a **new email** (not previously used)
3. Enter name, email, password (min 6 chars)
4. Click "Sign up"
5. Should redirect to home page

### Test Login:
1. Go to http://localhost:3000/login
2. Enter the email/password from signup
3. Click "Sign in"
4. Should redirect to home page

### Verify Session:
1. After login, refresh the page
2. Should remain logged in
3. Navbar should show user email

---

## Common Issues

### Issue: "Invalid API key"
**Fix**: Double-check your `VITE_SUPABASE_ANON_KEY` in `.env`

### Issue: "Failed to fetch"
**Fix**: 
1. Verify `VITE_SUPABASE_URL` is correct
2. Check internet connection
3. Restart dev server

### Issue: "User already registered"
**Fix**: 
1. Use a different email
2. Or go to Supabase Dashboard → Authentication → Users
3. Delete the existing user
4. Try again

### Issue: Rate limit errors
**Fix**: 
1. Wait 5-10 minutes
2. Use different email
3. Adjust rate limits in Supabase dashboard

---

## Production Setup

For production, you should:

1. **Enable Email Confirmation**:
   - Authentication → Settings
   - Enable "Enable email confirmations"
   - Configure email templates

2. **Set Up Email Provider**:
   - Use custom SMTP or email service
   - Configure in Authentication → Email Templates

3. **Adjust Rate Limits**:
   - Set appropriate limits for production
   - Monitor usage

4. **Add Password Reset**:
   - Implement forgot password flow
   - Use `supabase.auth.resetPasswordForEmail()`

---

## Environment Variables Reference

```env
# Required
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key

# Format
# URL: https://[project-ref].supabase.co
# Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## Need Help?

1. Check Supabase Dashboard for errors
2. Check browser console for detailed error messages
3. Verify all environment variables are correct
4. Ensure Supabase project is active and not paused
5. Check Supabase status page: https://status.supabase.com/
