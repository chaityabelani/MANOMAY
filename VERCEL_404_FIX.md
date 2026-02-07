# Fixing Vercel 404 NOT_FOUND Error

## 1. **The Fix: Update Vercel Project Settings**

### Step-by-Step Solution

1. **Go to your Vercel dashboard**: https://vercel.com/dashboard
2. **Select your project** (MANOMAY)
3. **Click "Settings"** in the top navigation
4. **Scroll to "Root Directory"** section
5. **Leave it COMPLETELY EMPTY/BLANK** (this means the root, NOT `./` or `manomay-kiosk`)
   - If there's any text in the field, delete it entirely
   - An empty Root Directory = project root
6. **Click "Save"**
7. **Go to "Deployments"** tab
8. **Click the three dots** on the latest deployment
9. **Select "Redeploy"**

### Alternative: Check Build Output Directory

If the above doesn't work:
1. In Settings → **Build & Development Settings**
2. Verify:
   - **Framework Preset:** Next.js (auto-detected)
   - **Build Command:** `next build` or leave empty for default
   - **Output Directory:** `.next` or leave empty for default
   - **Install Command:** `npm install` or leave empty for default

---

## 2. **Root Cause: Why This Error Occurred**

### What Was Happening vs. What Should Happen

**The Sequence of Events:**
1. You initially created the project in a subdirectory (`manomay-kiosk`)
2. Files were later moved to the root directory
3. Vercel **remembered the old configuration** from earlier deployments
4. When you pushed new commits, Vercel successfully built the app
5. **BUT** Vercel is still looking for pages in the old location

### What Triggered This Specific Error

The build succeeded, which means:
- ✅ Vercel found `package.json`
- ✅ Vercel ran `npm install`
- ✅ Vercel ran `next build`
- ✅ The build completed without errors

**However**, when you try to access the URL:
- ❌ Vercel's routing can't find the pages
- ❌ Returns `404 NOT_FOUND`

This happens because Vercel's **root directory setting** is pointing to the wrong place.

### The Misconception

Many developers think: *"If the build succeeds, the deployment should work."*

**Reality:** A successful build means the code compiles. A working deployment means:
1. Code compiles ✅
2. **Pages are served from the correct location** ← This is where it failed
3. All routes are accessible

---

## 3. **The Underlying Concept: Vercel's Multi-Project Architecture**

### Why Does This Error Exist?

Vercel is designed to support **monorepos** (multiple projects in one repository). You might have:

```
my-repo/
  ├── frontend/          ← Next.js app
  ├── backend/           ← API server
  ├── mobile-app/        ← React Native
  └── package.json       ← Root config
```

To handle this, Vercel needs to know: **"Which folder contains the app I should deploy?"**

This is the **Root Directory** setting.

### The Correct Mental Model

Think of Vercel deployment in two phases:

**Phase 1: Build**
- Vercel clones your repo
- Navigates to the **Root Directory** you specified
- Runs `npm install` and `next build` **in that directory**

**Phase 2: Serve**
- Vercel looks for the `.next` folder **in that same directory**
- Sets up routing based on the `pages/` or `app/` folder

If the Root Directory is wrong:
- Build might still work (if `package.json` exists there)
- **But serving fails** because the `.next` output is in a different location

### How This Fits Into Vercel's Design

Vercel separates concerns:
- **GitHub Integration** → Watches for commits
- **Build Phase** → Compiles your code
- **Deploy Phase** → Serves the compiled output
- **Routing Phase** → Maps URLs to pages

The **Root Directory setting bridges** the Build and Deploy phases.

---

## 4. **Warning Signs: Recognizing This Pattern**

### What to Look Out For

🚩 **Red Flags that indicate a Root Directory issue:**

1. **Build succeeds but all pages return 404**
   - Especially if even the home page (`/`) returns 404
   
2. **Deployment preview works but production doesn't** (or vice versa)
   - Indicates different settings between preview/production
   
3. **You recently moved files** from a subdirectory to root (or vice versa)
   - Vercel doesn't automatically detect this change
   
4. **Error ID changes but error type stays the same**
   - `Code: NOT_FOUND` with different IDs means routing is consistently failing

### Similar Mistakes in Related Scenarios

This same pattern occurs when:

**Scenario 1: Monorepo Confusion**
```
my-repo/
  ├── apps/
  │   └── web/          ← Next.js is here
  └── package.json      ← But Vercel points to root
```
**Fix:** Set Root Directory to `apps/web`

**Scenario 2: Framework Auto-Detection Fails**
```
my-repo/
  ├── frontend/         ← Next.js
  └── next.config.mjs   ← Config in root (wrong!)
```
**Fix:** Move `next.config.mjs` into `frontend/` OR set Root Directory to root

**Scenario 3: Build Output Location Changed**
You changed `next.config.mjs`:
```javascript
// Added this:
output: 'export',
distDir: 'dist',  // Changed from default '.next'
```
**Fix:** Update Vercel's Output Directory to `dist`

### Code Smells

🚩 **Project structure red flags:**
- Multiple `package.json` files at different levels
- Next.js config files in unexpected locations
- `.next` folder in a different directory than your source files

---

## 5. **Alternatives and Trade-offs**

### Approach 1: Fix Vercel Settings (Recommended ✅)

**What:** Update Root Directory to `./` in Vercel dashboard

**Pros:**
- No code changes needed
- Keeps your project structure clean
- Works immediately after redeployment

**Cons:**
- Requires manual dashboard access
- Easy to forget when setting up new projects

---

### Approach 2: Use `vercel.json` Configuration

Create `vercel.json` in your root:

```json
{
  "buildCommand": "next build",
  "devCommand": "next dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "outputDirectory": ".next"
}
```

**Pros:**
- Configuration lives in code (version controlled)
- Portable across Vercel projects
- Team members get the same settings

**Cons:**
- Adds extra configuration file
- Can conflict with Vercel dashboard settings
- Overkill for simple projects

---

### Approach 3: Restructure as Explicit Subdirectory

Move everything back to `manomay-kiosk/`:

```
MANOMAY/
  └── manomay-kiosk/
      ├── src/
      ├── package.json
      └── next.config.mjs
```

Then set Root Directory to `manomay-kiosk`

**Pros:**
- Explicit structure
- Good for monorepos
- Clear separation if you add more projects later

**Cons:**
- Extra nesting
- More typing in paths
- Doesn't match typical Next.js conventions

---

### Approach 4: Use Vercel CLI for Deployment

Instead of GitHub integration:

```bash
npm install -g vercel
cd c:/Users/Chaitya/OneDrive/Desktop/MANOMAY
vercel --prod
```

**Pros:**
- Manual control over deployments
- Can specify settings per deployment
- Good for testing

**Cons:**
- Loses automatic deployment on push
- Requires local Vercel CLI
- More manual work

---

## Best Practice Recommendation

**For your current situation:**

1. **Fix the Vercel dashboard settings** (Approach 1)
   - Fastest solution
   - No code changes
   
2. **Keep project in root directory**
   - Follows Next.js conventions
   - Simpler structure
   
3. **Consider adding `vercel.json` later** if you:
   - Work in a team
   - Deploy multiple similar projects
   - Want version-controlled deploy settings

---

## Quick Checklist

Before redeploying, verify:

- [ ] Root Directory is **completely empty/blank** (empty field = root directory)
- [ ] Framework Preset shows "Next.js"
- [ ] `src/app/page.tsx` exists in your root
- [ ] `package.json` is in the root
- [ ] `next.config.mjs` is in the root
- [ ] No `.vercelignore` file excluding important files

After making changes:
- [ ] Redeploy from Vercel dashboard
- [ ] Wait for build to complete
- [ ] Test your deployment URL
- [ ] Verify all routes work (`/`, `/menu`, `/cart`, `/checkout`)

---

## Summary

**The Problem:** Vercel built successfully but serves 404s because it's looking for pages in the wrong directory.

**The Solution:** Update Vercel's "Root Directory" setting to `./` (root) and redeploy.

**Key Insight:** A successful build ≠ a working deployment. Vercel needs to know where to find your built pages.
