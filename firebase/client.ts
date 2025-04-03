import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB4rdvUDZt7OXmjpJ9QPBtiFq7lNBOHIXQ",
  authDomain: "interprep-b4660.firebaseapp.com",
  projectId: "interprep-b4660",
  storageBucket: "interprep-b4660.firebasestorage.app",
  messagingSenderId: "1060940032553",
  appId: "1:1060940032553:web:a8b839bb1a079790208a38",
  measurementId: "G-4BG4Z5L0ZR",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
