# MongoDB Setup Guide for Manomay Kiosk

This guide will help you set up your MongoDB database and connect it to your application.

## 1. Create a MongoDB Cloud Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) and sign up for a free account.
2. Create a new **Project**.
3. Create a **Cluster** (select the free tier, usually M0 Sandbox).
4. Select a cloud provider (AWS is fine) and a region near you.
5. Click **Create Cluster**.

## 2. Configure Network Access & Database User
1. Go to **Network Access** in the left sidebar.
   - Click **Add IP Address**.
   - Select **Allow Access from Anywhere** (0.0.0.0/0) for development simplicity.
   - Click **Confirm**.
2. Go to **Database Access** in the left sidebar.
   - Click **Add New Database User**.
   - Create a username and password (remember these!).
   - Select **Read and write to any database**.
   - Click **Add User**.

## 3. Get Your Connection String
1. Go back to **Database** (or Clusters) in the left sidebar.
2. Click the **Connect** button on your cluster.
3. Select **Drivers**.
4. You will see a connection string like this:
   ```
   mongodb+srv://<username>:<password>@cluster0.12345.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   ```
5. Copy this string.

## 4. Connect to Your App
1. Create a file named `.env.local` in the root of your project (where `package.json` is).
2. Add the following line, replacing `<username>` and `<password>` with the credentials you created in Step 2:
   ```env
   MONGODB_URI=mongodb+srv://youruser:yourpassword@cluster0.12345.mongodb.net/manomay_db?retryWrites=true&w=majority
   ```
   *(Note: I added `/manomay_db` after the domain to specify a database name)*

## 5. Verify Connection
1. Run your development server: `npm run dev`
2. Visit `http://localhost:3000/api/test-db`
3. You should see `{"success":true,"message":"Database Connected Successfully"}`.

## 6. Vercel Deployment
1. Go to your project settings on [Vercel](https://vercel.com).
2. Navigate to **Settings** > **Environment Variables**.
3. Add a new variable:
   - **Key**: `MONGODB_URI`
   - **Value**: Your full connection string (same as in `.env.local`).
4. Click **Save**.
5. Redeploy your application (or pushed changes will trigger a new build).
