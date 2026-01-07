# Frontend Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel or Netlify account (free tier works)

## Local Development Setup

1. **Install dependencies:**
   ```bash
   cd dream-achiever-ai
   npm install
   ```

2. **Create `.env` file:**
   ```env
   VITE_API_BASE_URL=https://visa.up.railway.app/api
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Test locally:**
   - Open http://localhost:5173
   - Test registration, login, and interview flow
   - Verify API calls work with deployed backend

## Deployment to Vercel

### Option 1: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd dream-achiever-ai
   vercel
   ```

4. **Set environment variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://visa.up.railway.app/api`
   - Redeploy after adding variables

### Option 2: Deploy via GitHub

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Select `dream-achiever-ai` folder as root directory

3. **Configure build settings:**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add environment variables:**
   - `VITE_API_BASE_URL` = `https://visa.up.railway.app/api`

5. **Deploy:**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://your-project.vercel.app`

## Deployment to Netlify

1. **Build the project:**
   ```bash
   cd dream-achiever-ai
   npm run build
   ```

2. **Deploy via Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   netlify login
   netlify deploy --prod --dir=dist
   ```

3. **Or deploy via Netlify Dashboard:**
   - Go to https://app.netlify.com
   - Drag and drop the `dist` folder
   - Or connect GitHub repository

4. **Add environment variables:**
   - Site Settings → Environment Variables
   - Add: `VITE_API_BASE_URL` = `https://visa.up.railway.app/api`

5. **Configure build settings:**
   - Build command: `npm run build`
   - Publish directory: `dist`

## Post-Deployment Checklist

- [ ] Verify frontend URL is accessible
- [ ] Test registration flow
- [ ] Test email verification (check email links point to frontend URL)
- [ ] Test login/logout
- [ ] Test interview flow (start → speak → end → analyze)
- [ ] Test subscription page
- [ ] Verify API calls work (check browser console for errors)
- [ ] Update backend CORS settings if needed

## Update Backend CORS Settings

If you get CORS errors, update `backend/config/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.vercel.app',
    'https://your-frontend.netlify.app',
    # Add your production frontend URL
]
```

Then redeploy the backend.

## Environment Variables

### Required:
- `VITE_API_BASE_URL` - Your Django backend API URL

### Optional:
- `VITE_ELEVENLABS_API_KEY` - If needed on frontend (currently handled by backend)

## Custom Domain

### Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Netlify:
1. Go to Site Settings → Domain Management
2. Add custom domain
3. Configure DNS records

## Troubleshooting

### Build Errors:
- Check Node.js version (18+ required)
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build`

### API Connection Errors:
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend is running and accessible
- Verify CORS settings on backend

### Authentication Issues:
- Check token storage in browser DevTools → Application → Local Storage
- Verify email verification links point to correct frontend URL
- Check backend email settings (FRONTEND_URL)

## Production URLs

After deployment, update these in your backend:

1. **Email verification links:**
   - Update `FRONTEND_URL` in backend `.env`:
     ```
     FRONTEND_URL=https://your-frontend.vercel.app
     ```

2. **CORS allowed origins:**
   - Add frontend URL to `CORS_ALLOWED_ORIGINS` in backend settings

## Monitoring

- **Vercel Analytics:** Enable in project settings
- **Netlify Analytics:** Enable in site settings
- **Error Tracking:** Consider adding Sentry or similar

## Continuous Deployment

Both Vercel and Netlify support automatic deployments:
- Push to `main` branch → Auto deploy
- Pull requests → Preview deployments

## Support

If you encounter issues:
1. Check browser console for errors
2. Check network tab for failed API calls
3. Verify environment variables are set
4. Check backend logs on Railway

