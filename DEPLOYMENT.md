# Deploying Manomay Kiosk to Vercel

Your codebase is now optimized for a **"One-Click Deploy"** experience.

## 1. Pre-Deployment Check
Ensure you have committed all the latest changes:
```bash
git add .
git commit -m "chore: Prepare for Vercel production deployment"
git push
```

## 2. Deploy on Vercel
1.  Go to the [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your `MANOMAY` repository.
4.  **Framework Preset**: Select `Next.js`.
5.  **Root Directory**: Leave empty (since your `package.json` is at the root).
6.  **Build Command**: `next build` (Default).
7.  **Environment Variables**: None currently required.
8.  Click **Deploy**.

## 3. Important Notes
-   **Images**: We have configured `next.config.mjs` to allow images from `images.unsplash.com`. If you use other image sources, add their domains there.
-   **Styling**: `tailwind.config.mjs` is correctly pointing to the `src/app` directory.

## 4. Troubleshooting
If you see a 404 on deployment:
-   Check `VERCEL_404_FIX.md`.
-   Verify your `Root Directory` setting in Vercel is clear.
