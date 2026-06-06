# 🚀 Production Deployment Guide

This guide explains how to deploy the AffiliateCRM MERN stack application to live production hosting services.

---

## 📦 Source Code & Build Files
**Note on Build Folders:** 
This repository does not (and should not) track compiled build files (such as `dist/` or `build/` directories). These folders are ignored in `.gitignore`. 
When deploying, **Netlify** or your chosen platform pulls the raw source code from GitHub, installs dependencies, and compiles the fresh production build directly on their server. This guarantees that your live application is always built cleanly from your latest code commit.

---

## 🌐 1. Deploying the Frontend (Netlify)

Since this repository is a monorepo, a preconfigured [netlify.toml](file:///c:/Users/YASHASVI%20PANDEY/Downloads/affiliate-crm-CLEAN%20(1)/netlify.toml) is included in the root directory to automate the build settings.

1. **Sign Up/In**: Go to [Netlify](https://www.netlify.com/) and sign in using your GitHub account.
2. **Import Project**: 
   * Click **"Add new site"** → **"Import an existing project"**.
   * Authenticate with GitHub and search for/select your **`AffiliateCRM`** repository.
3. **Build & Directory Configuration**:
   Netlify will read the root `netlify.toml` automatically and populate these configuration fields:
   * **Base directory**: `frontend`
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
4. **Environment Variables**:
   * Before deploying, go to **Site settings** → **Environment variables**.
   * Add the following key:
     * `VITE_API_URL`: Set this to your deployed backend API URL (e.g., `https://affiliate-crm-api.onrender.com/api`).
5. **Deploy**: Click **Deploy Site**. Netlify will build your application and generate a public URL.

---

## 🖥️ 2. Deploying the Backend (Render)

Render is a developer-friendly platform that hosts Node.js applications on a free tier.

1. Go to [Render](https://render.com/) and sign in.
2. Click **New** → **Web Service** and link your GitHub repository.
3. Configure the following build and execute settings:
   * **Name**: `affiliate-crm-api`
   * **Root Directory**: `backend`
   * **Runtime**: `Node`
   * **Build Command**: `npm install`
   * **Start Command**: `node server.js`
4. Select the **Free** instance type.
5. Click **Advanced** and add the following Environment Variables:
   * `NODE_ENV`: `production`
   * `PORT`: `10000`
   * `MONGODB_URI`: *Your cloud MongoDB Atlas URL (see next section)*
   * `JWT_SECRET`: *A secure, random secret string for JWT signatures*
   * `JWT_EXPIRES_IN`: `7d`
   * `FRONTEND_URL`: *Your Netlify frontend URL (e.g., `https://your-site.netlify.app`)*
   * `GEMINI_API_KEY`: *Your Google AI Studio Gemini API Key*
6. Click **Create Web Service**. 
   > ℹ️ *Render's free tier spins down services after 15 minutes of inactivity. The first request received after sleeping will take about 50 seconds to boot the server back up.*

---

## 🗄️ 3. Creating a Free Database (MongoDB Atlas)

To allow your live backend to store and retrieve data, host your database on a free MongoDB Atlas cluster.

1. Sign up on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Create** to deploy a new database cluster. Select the **M0 Free** cluster tier.
3. Choose a cloud provider and region closest to your target users, then click **Create**.
4. In **Security Quickstart**:
   * Create a database username and password. Note these down.
   * Under **IP Access List**, choose **"Allow Access from Anywhere"** (`0.0.0.0/0`). This is necessary because serverless and free hosting providers (like Render) rotate their outbound IP addresses.
5. In **Database** -> **Clusters**, click **Connect** → **Drivers**.
6. Copy the connection string. It will look like this:
   `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`
7. Replace `<username>` and `<password>` with your database user credentials.
8. Paste this finalized connection string as the `MONGODB_URI` environment variable on your backend hosting dashboard (e.g., Render).
