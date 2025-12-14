// Import core Firebase
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// ✅ IMPORT THESE (YOU MISSED THEM)
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCH7-LPNEkM7eaZxkOLsOVBoXrKPkEqtVA",
  authDomain: "key-value-68b55.firebaseapp.com",
  projectId: "key-value-68b55",
  storageBucket: "key-value-68b55.appspot.com",
  messagingSenderId: "28562743192",
  appId: "1:28562743192:web:857a5eef538d7986df15ed",
  measurementId: "G-4MKYTD4WDE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Optional: analytics (only works in browser, not SSR)
const analytics = getAnalytics(app);

// ✅ EXPORTS THAT YOUR APP EXPECTS
export const auth = getAuth(app);
export const db = getFirestore(app);
