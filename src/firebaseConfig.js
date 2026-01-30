import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. IMPORT FIRESTORE

const firebaseConfig = {
  apiKey: "AIzaSyDVAe7QfXdsc0TNNYcbjyD_qRVigKJaO2A",
  authDomain: "vedabloom-bc3c9.firebaseapp.com",
  projectId: "vedabloom-bc3c9",
  storageBucket: "vedabloom-bc3c9.firebasestorage.app",
  messagingSenderId: "757997746657",
  appId: "1:757997746657:web:50d8c41e779f88ecc9baa0",
  measurementId: "G-N9L32D0K3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and DB for other files to use
export const auth = getAuth(app);
export const db = getFirestore(app); // 2. EXPORT THE DATABASE
