// src/services/firebase.js
// ──────────────────────────────────────────────────────────────
// Replace the firebaseConfig values below with your own project
// credentials from https://console.firebase.google.com
// ──────────────────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { arrayUnion, arrayRemove, increment } from 'firebase/firestore';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  setDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── Auth helpers ──────────────────────────────────────────────

export const registerUser = async ({ name, email, password, roomNumber }) => {
  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  await setDoc(doc(db, 'users', user.uid), {
    id: user.uid,
    name,
    email,
    roomNumber,
    role: 'student',
    createdAt: serverTimestamp(),
  });
  return user;
};

export const loginUser = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const onAuthChange = (cb) => onAuthStateChanged(auth, cb);

export const fetchUserProfile = async (uid) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

// ── Complaints ────────────────────────────────────────────────

export const createComplaint = async (data) => {
  return addDoc(collection(db, 'complaints'), {
    ...data,
    status: 'Pending',
    upvotes: 0,
    upvotedBy: [],
    createdAt: serverTimestamp(),
  });
};

export const fetchComplaints = async (userId, role) => {
  const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
  const snap = await getDocs(q);

  return snap.docs
    .map(d => ({ id: d.id, ...d.data() }))
    .filter(c => {
      if (role === 'admin') return true;
      return c.category !== 'Ragging';
    });
};

export const subscribeToComplaints = (userId, role, cb) => {
  const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));

  return onSnapshot(q, (snap) => {
    const data = snap.docs
      .map(d => ({ id: d.id, ...d.data() }))
      .filter(c => {
        if (role === 'admin') return true;
        return c.category !== 'Ragging';
      });

    cb(data);
  });
};

export const updateComplaintStatus = (id, status) =>
  updateDoc(doc(db, 'complaints', id), { status, updatedAt: serverTimestamp() });

export const toggleUpvote = async (complaintId, userId, hasUpvoted) => {
  const ref = doc(db, 'complaints', complaintId);

  if (hasUpvoted) {
    // remove upvote
    return updateDoc(ref, {
      upvotes: increment(-1),
      upvotedBy: arrayRemove(userId),
    });
  } else {
    // add upvote
    return updateDoc(ref, {
      upvotes: increment(1),
      upvotedBy: arrayUnion(userId),
    });
  }
};

// ── Mess Menu ─────────────────────────────────────────────────

export const fetchMessMenu = async () => {
  const snap = await getDocs(collection(db, 'messMenu'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const updateMessMenu = (dayId, data) => {
  return setDoc(doc(db, 'messMenu', dayId), data, { merge: true });
};

export const seedMessMenu = async () => {
  try {
    const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

    const menus = [
      { breakfast: 'Idli, Sambar, Coconut Chutney', lunch: 'Rice, Dal, Aloo Sabzi, Salad', dinner: 'Chapati, Paneer Butter Masala, Dal' },
      { breakfast: 'Poha, Tea, Banana', lunch: 'Rice, Rajma, Jeera Aloo, Curd', dinner: 'Chapati, Mixed Veg, Kheer' },
      { breakfast: 'Upma, Boiled Eggs, Coffee', lunch: 'Rice, Sambar, Beans Fry, Buttermilk', dinner: 'Puri, Chana Masala, Halwa' },
      { breakfast: 'Paratha, Curd, Pickle', lunch: 'Rice, Dal Fry, Gobi Sabzi, Salad', dinner: 'Chapati, Palak Paneer, Rice' },
      { breakfast: 'Bread Toast, Omelette, Tea', lunch: 'Veg Biryani, Raita, Papad', dinner: 'Chapati, Dal Tadka, Sabzi' },
      { breakfast: 'Pongal, Filter Coffee, Chutney', lunch: 'Rice, Chicken Curry, Dal, Salad', dinner: 'Chapati, Shahi Paneer, Pulao' },
      { breakfast: 'Dosa, Sambar, Chutney', lunch: 'Rice, Chole, Aloo Fry, Curd', dinner: 'Chapati, Egg Curry, Dal' },
    ];

    for (let i = 0; i < days.length; i++) {
      console.log("Writing:", days[i]); // 🔍 debug

      await setDoc(doc(db, 'messMenu', days[i].toLowerCase()), {
        day: days[i],
        ...menus[i],
      });
    }

    alert("✅ FULL MENU SEEDED");
    console.log("DONE");
  } catch (err) {
    console.error("❌ ERROR:", err);
    alert("Seeding failed");
  }
};
