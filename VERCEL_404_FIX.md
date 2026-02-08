# Resolving Vercel "NOT_FOUND" (404) Deployment Error

### 🔍 Diagnosis
Based on your provided code and configuration:
- **Framework:** Next.js 14.1.0 (`src/app` router)
- **Configuration:** Standard `next.config.mjs` (default) and `package.json` scripts.
- **Structure:** Code is at the project root (`src/` and `package.json` are top-level).

**The Verdict:** Your code is correct. The error is in the **Vercel Project Settings**.

---

## 1. The Fix: specific configuration change

You have two options. **Option A** is the recommended permanent fix in the Vercel Dashboard. **Option B** is a code-based override.

### Option A: Fix Vercel Root Directory (Recommended)
The 404 occurs because Vercel is looking for your built application in a subdirectory (or the wrong directory), while your code sits at the root.

1. Go to **Vercel Dashboard** > **Select Project** > **Settings**.
2. Find the **"Root Directory"** section.
3. **Action:** Ensure this field is **COMPLETELY EMPTY**.
   - If it says `./` or `manomay-kiosk` or anything else, **delete it**.
4. Click **Save**.
5. Go to **Deployments** tab > Click the three dots (⋮) on the latest build > **Redeploy**.

### Option B: Force Config via `vercel.json` (Alternative)
If you cannot access settings easily, create a `vercel.json` file in your root folder:

```json
{
  "framework": "nextjs",
  "cleanUrls": true
}
```
*Note: This might not override a hard-set Root Directory in the dashboard, so Option A is safer.*

---

## 2. Root Cause Analysis

**Observation:** "My application builds, but the deployed URL returns a 404."

- **The Configuration:** Vercel was likely set up assuming your code was in a subdirectory (e.g., if you uploaded a folder containing the project folder).
- **The Conflict:**
  1. **Build Phase:** Vercel found `package.json` and ran `next build`. Next.js successfully created the `.next` folder.
  2. **Serving Phase:** Vercel's Edge Network looked for the **Entry Point** (the Output Directory). Because the "Root Directory" setting was misaligned, it looked in the wrong place for the `.next` folder or static assets.
  3. **Result:** It found nothing matching `/`, so it returned `404 NOT_FOUND`.

---

## 3. The Concept: Build vs. Serve

To understand `NOT_FOUND` on a successful build, you must distinguish between **Building** and **Serving**.

| Concept | What it does | Where it fails here |
| :--- | :--- | :--- |
| **Build** | Converts `src/app/page.tsx` → `.next/server/app/page.html` | ✅ Works! Code is valid. |
| **Serve** | Maps URL `your-site.com/` → `.next/server/app/page.html` | ❌ Fails! Router is looking in wrong path. |

**Mental Model:**
Imagine you baked a cake in the **Kitchen** (Build), but the Waiter (Server) is looking for it in the **Garage**. The cake exists, but the customer (User) gets a "404 Not Found" because the Waiter assumes instructions meant "Garage".

**Standard Entry Points:**
- **Next.js App Router:** The entry is dynamic. Vercel expects a specific `.next` folder structure.
- **Static HTML:** Expects `index.html`.
*Your app is Next.js, so it relies on the `.next` folder being exactly where Vercel expects it relative to the Root Directory.*

---

## 4. Warning Signs & Code Smells

Check these if the issue persists:

1.  **Nested Folders:**
    - *Bad:* `repo-root/my-app/package.json` (when Vercel Root is `repo-root`).
    - *Fix:* Set Vercel Root to `my-app`.
2.  **Output Export:**
    - If `next.config.mjs` has `output: 'export'`, it produces an `out` folder. Vercel usually auto-detects this, but if manually configured to `.next`, it fails. (Your config is standard, so this is unlikely).
3.  **Middleware:**
    - Does `middleware.ts` exist? If it redirects incorrectly, it causes 404s. (You don't have one visible in root).
4.  **Case Sensitivity:**
    - `Imports` matching file names exactly (`Header.tsx` vs `header.tsx`). Windows is case-insensitive, Linux (Vercel) is not.

## 5. Summary
Your code is production-ready. Valid structure, valid config. This is purely a "wiring" issue in the Vercel Dashboard. **Clear the Root Directory setting and redeploy.**
