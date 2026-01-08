# 📦 Setup New Repository for Frontend

## Step 1: Create New Repository on GitHub

1. Go to https://github.com/new
2. Repository name: `visa-officer-frontend` (or your choice)
3. Description: "Visa Officer AI - Frontend Application"
4. Choose **Public** or **Private**
5. **DO NOT** initialize with README, .gitignore, or license
6. Click **Create repository**

## Step 2: Connect Local Code to New Repository

After creating the repo, GitHub will show you commands. Use these:

```bash
cd dream-achiever-ai
git remote add origin https://github.com/YOUR_USERNAME/visa-officer-frontend.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your GitHub username and `visa-officer-frontend` with your repo name.

## Step 3: Verify

```bash
git remote -v
```

Should show your new repository URL.

## Step 4: Deploy to Vercel

After pushing to the new repo:
1. Go to https://vercel.com
2. Import the new repository
3. Configure and deploy as described in QUICK_DEPLOY.md

