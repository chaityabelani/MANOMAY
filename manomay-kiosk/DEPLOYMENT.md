# Deployment Instructions

Follow these steps to deploy the Manomay Kiosk Website to Vercel.

## 1. Push to GitHub
1. Create a new repository on GitHub (e.g., `manomay-kiosk`).
2. Run the following commands in your terminal (inside the `manomay-kiosk` folder):

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/manomay-kiosk.git
git push -u origin main
```

## 2. Deploy to Vercel
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New..."** -> **"Project"**.
3. Select the `manomay-kiosk` repository you just pushed.
4. Click **"Import"**.
5. In the "Configure Project" screen:
   - **Framework Preset**: Next.js (should be auto-detected).
   - **Root Directory**: Ensure it is set to `.`.
   - **Build Command**: `next build` (default).
   - **Installation Command**: `npm install` (default).
6. Click **"Deploy"**.

## 3. Verify Deployment
- Vercel will install dependencies, build the project, and deploy it.
- Once finished, you will get a URL (e.g., `https://manomay-kiosk.vercel.app`).
- Open the URL on your kiosk device or browser to test.
