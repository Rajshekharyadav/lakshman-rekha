// Firebase configuration and initialization
// Reference: firebase_barebones_javascript blueprint
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebasestorage.app`,
  messagingSenderId: "376286301971",
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: "G-SL08KY3NYM"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Google Auth Provider - Configured for popup authentication
// Sign-up/Sign-in uses signInWithPopup for desktop browsers
// Mobile devices automatically fallback to signInWithRedirect
export const googleProvider = new GoogleAuthProvider();
