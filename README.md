# AffiliateCRM — Full Stack MERN + AI (Free Gemini API)

## Quick Start

### Step 1 — Open MongoDB Compass
Connect to: mongodb://localhost:27017  ✅

### Step 2 — Backend Setup
```
cd backend
npm install
```

Create backend/.env file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/affiliate-crm
JWT_SECRET=mysecretkey123456789
JWT_EXPIRES_IN=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=AIzaYour_Free_Key_Here
```

Seed demo data:
```
node src/utils/seed.js
```

Start backend:
```
npm run dev
```

### Step 3 — Frontend Setup
```
cd frontend
npm install
```

Create frontend/.env file:
```
VITE_API_URL=http://localhost:5000/api
```

Start frontend:
```
npm run dev
```

### Step 4 — Open Browser
http://localhost:5173

## Demo Logins
| Role      | Email                       | Password     |
|-----------|-----------------------------|--------------|
| Admin     | admin@affiliatecrm.com      | admin123     |
| Affiliate | sarah@affiliatecrm.com      | affiliate123 |

## Get FREE AI API Key (No credit card)
1. Go to https://aistudio.google.com
2. Sign in with Google
3. Click "Get API Key" → "Create API Key"
4. Copy key (starts with AIza...)
5. Paste in backend/.env as GEMINI_API_KEY

Free limits: 15 requests/min, 1 million tokens/day

## AI Features
- Dashboard Insight — AI analysis of your CRM stats
- Lead Scoring — Hot/Warm/Cold grade per lead
- AI Notes — Auto-generate follow-up notes
- Reply Suggester — AI drafts ticket replies

## Upgraded MERN Quality Features
- **Visual Design Redesign**: Floating glassmorphic Login and Register cards on top of animated dynamic colored gradients.
- **Real-Time Notification Engine**: Socket.io integration to deliver immediate ticket updates and status warnings directly to the affiliate or user.
- **Auto-generated Ticket IDs**: Unique, secure `TKT-<NANOID>` references replacing sequential numbers.
- **Logout JWT Blacklist**: Collections tracking and matching blacklisted tokens for strict user invalidations on logout.
- **Leads Export**: Secure CSV downloads for admins.
- **In-Memory Testing Suite**: Automated backend integration testing using `mongodb-memory-server` and Jest:
  ```bash
  cd backend
  npm run test
  ```
