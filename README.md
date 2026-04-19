# UniStay — Student Hostel Management Dashboard

> A React web application for managing student hostel complaints, tracking mess menus, and providing admin oversight — all in one centralized platform.

---

## Problem Statement

Student hostels currently handle complaints (cleaning, WiFi, electricity, ragging, etc.) through informal channels like WhatsApp groups and Google Forms. This leads to:
- **No tracking** — complaints disappear after resolution
- **No accountability** — nobody knows what's being worked on
- **Poor transparency** — students can't see complaint status
- **Unsafe reporting** — sensitive issues like ragging have no anonymous outlet

**UniStay** solves this with a structured, transparent, role-aware web application.

---

## Features

### For Students
- Email/password authentication with persistent sessions
- Personal room dashboard
- Raise complaints with category, urgency, and optional **anonymous mode**
- Track complaint status (Pending → In Progress → Resolved)
- View weekly mess menu (Breakfast / Lunch / Dinner)
- Dashboard with complaint stats and charts

### For Admins
- View **all** complaints across all students
- Update complaint status in real-time
- Category breakdown and insights
- Urgent/Ragging complaint highlighting

### Security
- Anonymous complaints never store user identity in DB
- Firestore security rules enforce role-based access
- Protected routes for all authenticated content

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

## React Concepts Used

| Concept | Where |
|---|---|
| `useState` | All forms, filters, loading states |
| `useEffect` | Auth listener, data fetching |
| `useContext` | Auth + Complaints global state |
| `useMemo` | Filtered complaints list, dashboard stats |
| `useCallback` | Event handlers, submit handlers |
| `useRef` | (available for future form focus management) |
| `React.lazy` + `Suspense` | All pages are lazy-loaded |
| Controlled Forms | Login, Signup, Add Complaint |
| React Router | Multi-page navigation, protected routes |
| Lifting State Up | Complaints shared across pages via context |
| Conditional Rendering | Auth gates, empty states, loading skeletons |
| Lists & Keys | Complaint cards, menu items |

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
  "name": "Arjun Mehta",
  "email": "arjun@college.edu",
  "roomNumber": "A-204",
  "role": "student",
  "createdAt": "timestamp"
}
```

### `complaints/{id}`
```json
{
  "title": "WiFi not working",
  "description": "No internet in Block C since yesterday",
  "category": "WiFi",
  "status": "Pending",
  "isAnonymous": false,
  "isUrgent": true,
  "location": "Block C, Floor 2",
  "createdBy": "uid or null",
  "createdByName": "Arjun Mehta or null",
  "createdByRoom": "A-204 or null",
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

## Design System

- **Font Display:** Syne (bold geometric headers)
- **Font Body:** DM Sans (clean, readable)
- **Primary:** Deep navy `#0d0f1a`
- **Accent:** Amber `#f59e0b`
- **Status Colors:** Yellow (Pending), Blue (In Progress), Green (Resolved), Red (Urgent/Ragging)
- **Approach:** CSS Modules with CSS custom properties for full theming consistency

---

## Security Rules Summary

- Students can only read their own complaints
- Anonymous complaint data never stores user identity (enforced at application layer)
- Only admins can update complaint status (enforced at Firestore rules layer)
- Mess menu is read-only for students, write-only for admins

---

## Author

Built by Srujana Sawant as an end-term project for **Building Web Applications with React** — Batch 2029.

