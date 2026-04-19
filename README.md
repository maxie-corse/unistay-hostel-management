# UniStay — Student Hostel Management Dashboard

> A full-stack React + Firebase web application for managing student hostel complaints, tracking mess menus, and providing admin oversight — all in one centralized platform.

---

## Live Demo

**Live Application:** unistay-hostel-management.vercel.app  
  
> Use a test account or sign up to explore the full experience.

---

## Problem

Student hostels currently handle complaints (cleaning, WiFi, electricity, ragging, etc.) through informal channels like:
- WhatsApp groups (spam + no tracking)
- Google Forms (no updates)
- Verbal complaints (no accountability)

This leads to:
- **No tracking** — complaints disappear after resolution
- **No accountability** — nobody knows what's being worked on
- **Poor transparency** — students can't see complaint status
- **Unsafe reporting** — sensitive issues like ragging have no anonymous outlet
- **No Prioritization** — urgent issues could be ignored

**UniStay** solves this with a structured, transparent, role-aware and real-time system.

---

## Features

### Student Experience
- Email/password Authentication with persistent sessions (Firebase Auth)
- Raise complaints with:
  - Category (WiFi, Electricity, Mess, Ragging, etc.)
  - Urgency flag
  - Optional **anonymous mode**
- Personal dashboard:
  - Total complaints
  - Status breakdown (Pending → In Progress → Resolved)
- Smart filtering:
  - Status, category, search
  - “My complaints” toggle
- **Hybrid visibility system**:
  - See all complaints (except ragging)
  - Identity hidden for anonymous posts
- **Upvote system**:
  - Prioritize common issues democratically
- Weekly mess menu viewer

### Admin Experience
- Full visibility across all complaints
- Real-time complaint updates
- Status control:
  - Pending → In Progress → Resolved
- Urgent & ragging highlighting
- **Mess menu editor (live update from frontend)**
- System-wide insights via dashboard

### Security

UniStay is built with **intentional guardrails**:

- Ragging complaints → **admin only visibility**
- Anonymous complaints → **no identity stored or shown**
- User identity:
  - Visible only to **admin or complaint owner**
- Upvotes:
  - Controlled via Firestore + frontend checks

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend Framework | React 18 (Vite) |
| Routing | React Router v6 |
| State Management | Context API (AuthContext + ComplaintsContext) |
| Backend / Auth | Firebase (Auth + Firestore) |
| Charts | Recharts |
| Icons | Lucide React |
| Date Formatting | date-fns |
| Styling | CSS Modules (custom design system) |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── complaints/
│   │   └── ComplaintCard.jsx       # Card with urgent/ragging highlight
│   ├── dashboard/
│   │   └── StatCard.jsx            # Animated stat cards
│   ├── layout/
│   │   ├── AppLayout.jsx           # Shell with sidebar + outlet
│   │   ├── Sidebar.jsx             # Nav with user card, mobile drawer
│   │   └── Topbar.jsx              # Header with page title
│   └── ui/
│       ├── EmptyState.jsx          # Illustrated empty states
│       ├── LoadingScreen.jsx       # Full-screen loader
│       ├── StatusBadge.jsx         # Color-coded status pills
│       └── Toast.jsx               # Submission confirmation
├── context/
│   ├── AuthContext.jsx             # Firebase auth + user profile
│   └── ComplaintsContext.jsx       # Real-time complaints subscription
├── hooks/
│   └── useFilteredComplaints.js    # useMemo-based filter logic
├── pages/
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashboardPage.jsx           # Stats + chart + recent complaints
│   ├── ComplaintsPage.jsx          # Filter + search + full list
│   ├── AddComplaintPage.jsx        # Full form with toggles
│   └── MessMenuPage.jsx            # Weekly meal grid
├── services/
│   └── firebase.js                 # All Firebase operations
└── utils/
    └── helpers.js                  # Colors, icons, time formatting
```

---

## Database Schema (Firestore)

### `users/{uid}`
```json
{
  "id": "uid",
  "name": "User Name",
  "email": "user@email.com",
  "roomNumber": "204",
  "role": "student",
  "createdAt": "timestamp"
}
```

### `complaints/{id}`
```json
{
  "title": "WiFi not working",
  "description": "No internet since yesterday",
  "category": "WiFi",
  "status": "Pending",
  "isAnonymous": false,
  "isUrgent": true,
  "location": "Floor 2",
  "createdBy": "uid or null",
  "createdByName": "User Name or null",
  "createdByRoom": "204 or null",
  "upvotes": 0,
  "upvotedBy": [],
  "createdAt": "timestamp"
}
```

### `messMenu/{day}`
```json
{
  "day": "Monday",
  "breakfast": "Idli, Sambar, Coconut Chutney",
  "lunch": "Rice, Dal, Aloo Sabzi, Salad",
  "dinner": "Chapati, Paneer Butter Masala, Dal"
}
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/unistay.git
cd unistay
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication** → Email/Password sign-in
4. Enable **Firestore Database** (start in test mode, then apply security rules)
5. Go to **Project Settings → Your Apps → Web App** and copy the config

### 4. Configure environment variables
```bash
cp .env.example .env
```
Fill in your Firebase credentials in `.env`.

### 5. Deploy Firestore security rules
```bash
npm install -g firebase-tools
firebase login
firebase init firestore   # select your project
firebase deploy --only firestore:rules,firestore:indexes
```

### 6. Run the development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173)

### 7. Seed the Mess Menu (one-time)

After signing up and logging in, open the browser console and run:
```js
import { seedMessMenu } from './src/services/firebase.js';
seedMessMenu();
```
Or temporarily add a button in development that calls `seedMessMenu()`.

### 8. Create an Admin account

1. Sign up normally through the app
2. Go to **Firestore Console → users → {your uid}**
3. Edit the document and set `role` to `"admin"`

---

## Deploy to Vercel

```bash
npm run build
npx vercel --prod
```

Add your `.env` variables in the Vercel dashboard under **Project Settings → Environment Variables**.

---

## Security Rules Summary

- Students can only read their own complaints (scoped access)
- Anonymous complaint data never stores user identity (enforced at application layer)
- Only admins can update complaint status (enforced at Firestore rules layer)
- Mess menu is read-only for students, write-only for admins

---

## Author

Built by Srujana Sawant as an end-term project for **Building Web Applications with React** — Batch 2029.

