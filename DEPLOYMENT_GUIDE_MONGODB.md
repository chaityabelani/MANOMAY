# Vercel Deployment Guide (MongoDB)

This guide walks you through deploying your Next.js application with MongoDB to Vercel.

## 1. Prerequisites
- A GitHub repository with your code pushed.
- A Vercel account.
- A MongoDB Atlas account and cluster.

## 2. Database Connection Logic (`lib/db.ts`)
Your project uses a **Singleton Pattern** for the database connection. This is critical for Vercel's serverless environment because:
- **Hot Reloading**: Prevents creating multiple connections during local development.
- **Serverless**: reuses the connection across function invocations if the container is warm, preventing "Too many connections" errors.

**Code Check:**
Your `src/lib/db.ts` is already configured correctly. It checks for `MONGODB_URI` *inside* the function, which prevents build-time crashes when the variable is missing.

## 3. MongoDB Atlas Configuration
1.  **Get Connection String**:
    - Go to Atlas > Connect > Drivers.
    - Copy the string: `mongodb+srv://<user>:<password>@cluster...`
2.  **Network Access (IP Whitelisting)**:
    - **Crucial**: Vercel Serverless Functions use dynamic IP addresses. You cannot whitelist a single IP.
    - Go to **Network Access** > **Add IP Address**.
    - Select **Allow Access from Anywhere** (`0.0.0.0/0`).
    - *Note: For higher security, you would use Vercel Secure Compute (Enterprise) or VPC Peering, but `0.0.0.0/0` is standard for standard Vercel deployments.*

## 4. Vercel Configuration
1.  **Import Project**:
    - Go to Vercel Dashboard > **Add New...** > **Project**.
    - Import your `MANOMAY` repository.
2.  **Environment Variables**:
    - Expand the **Environment Variables** section.
    - Add the following:
        - `MONGODB_URI`: Your full connection string (with actual password).
        - `JWT_SECRET`: A long random string (e.g., generated via `openssl rand -hex 32`).
3.  **Deploy**:
    - Click **Deploy**.

## 5. Troubleshooting Common Issues

### Build Fails: `Please define the MONGODB_URI...`
- **Cause**: The build process tried to import a file that checks for the env var immediately.
- **Fix**: We already fixed this in `lib/db.ts` by moving the check inside `dbConnect()`. Ensure you pushed that change.

### Runtime Error: `MongooseError: The 'uri' parameter...`
- **Cause**: `MONGODB_URI` is missing in Vercel.
- **Fix**: Go to Settings > Environment Variables and ensure it's added correctly.

### Runtime Error: `querySrv ECONNREFUSED`
- **Cause**: MongoDB Atlas is blocking the connection.
- **Fix**: Go to Atlas > Network Access and ensure `0.0.0.0/0` is Active.

## 6. Usage in Code
You can use the connection in any Server Action or API Route:

```typescript
import dbConnect from '@/lib/db';
import User from '@/models/User';

export async function myAction() {
  await dbConnect(); // <--- Connects or uses cached connection
  const users = await User.find({});
  return users;
}
```
