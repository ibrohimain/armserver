
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDUh1dFKAChj3gYcRZyVs7pbZ0kT-KSSTs",
  authDomain: "jizpibaza.firebaseapp.com",
  projectId: "jizpibaza",
  storageBucket: "jizpibaza.firebasestorage.app",
  messagingSenderId: "151383449765",
  appId: "1:151383449765:web:803e00969fb56538766d4c",
  measurementId: "G-72PXE70G7C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics conditionally
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null;
