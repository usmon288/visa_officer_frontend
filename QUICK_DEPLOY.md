# 🚀 Quick Frontend Deployment Guide

## Build Status: ✅ Ready

Your frontend builds successfully! Now let's deploy it.

## Option 1: Deploy via Vercel CLI (Fastest)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Login to Vercel
```bash
vercel login
```
This will open your browser to authenticate.

### Step 3: Deploy
```bash
cd dream-achiever-ai
vercel
```

Follow the prompts:
- **Set up and deploy?** → Yes
- **Which scope?** → Your account
- **Link to existing project?** → No
- **Project name?** → visa-officer-ai (or your choice)
- **Directory?** → `./` (current directory)
- **Override settings?** → No

### Step 4: Set Environment Variable
After deployment, Vercel will give you a URL. Then:

1. Go to https://vercel.com/dashboard
2. Click on your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://visa.up.railway.app/api`
   - **Environment**: Production, Preview, Development (select all)
5. Click **Save**
6. Go to **Deployments** tab
7. Click the **3 dots** on latest deployment → **Redeploy**

## Option 2: Deploy via GitHub + Vercel Web (Recommended)

### Step 1: Push to GitHub
```bash
cd dream-achiever-ai
git init  # if not already a git repo
git add .
git commit -m "Ready for deployment"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### Step 2: Import to Vercel
1. Go to https://vercel.com
2. Click **Add New** → **Project**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `dream-achiever-ai` (or leave blank if repo root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### Step 3: Add Environment Variable
Before deploying, click **Environment Variables**:
- **Name**: `VITE_API_BASE_URL`
- **Value**: `https://visa.up.railway.app/api`
- Select all environments (Production, Preview, Development)

### Step 4: Deploy
Click **Deploy** and wait ~2 minutes.

## Option 3: Deploy via Netlify

### Step 1: Install Netlify CLI
```bash
npm install -g netlify-cli
```

### Step 2: Login
```bash
netlify login
```

### Step 3: Deploy
```bash
cd dream-achiever-ai
npm run build
netlify deploy --prod --dir=dist
```

### Step 4: Set Environment Variable
1. Go to https://app.netlify.com
2. Select your site
3. Go to **Site settings** → **Environment variables**
4. Add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://visa.up.railway.app/api`
5. Redeploy

## After Deployment

### 1. Update Backend CORS
Once you have your frontend URL (e.g., `https://your-app.vercel.app`):

1. Go to Railway dashboard
2. Select your backend service
3. Go to **Variables** tab
4. Add or update `CORS_ALLOWED_ORIGINS`:
   ```
   http://localhost:5173,http://localhost:3000,https://your-app.vercel.app
   ```
5. Railway will auto-redeploy

### 2. Update Frontend URL for Emails
In Railway, update `FRONTEND_URL`:
```
FRONTEND_URL=https://your-app.vercel.app
```

### 3. Test Everything
- [ ] Registration works
- [ ] Email verification links work (check they point to your Vercel URL)
- [ ] Login works
- [ ] Interview flow works
- [ ] Subscription page works

## Your Deployment URLs

After deployment, you'll have:
- **Frontend**: `https://your-app.vercel.app` (or `.netlify.app`)
- **Backend**: `https://visa.up.railway.app/api`

## Troubleshooting

### Build Fails
- Check Node.js version (18+ required)
- Clear cache: `rm -rf node_modules .next && npm install`

### CORS Errors
- Make sure frontend URL is in Railway's `CORS_ALLOWED_ORIGINS`
- Redeploy backend after updating

### Environment Variables Not Working
- Make sure variable name is exactly `VITE_API_BASE_URL`
- Redeploy after adding variables
- Check Vercel/Netlify logs

## Next Steps

1. Deploy frontend (choose one option above)
2. Update backend CORS with frontend URL
3. Test end-to-end
4. Launch! 🎉

