import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // 1. IMPORT FIRESTORE

const firebaseConfig = {
  apiKey: ,
  authDomain: ,
  projectId: ,
  storageBucket: ,
  messagingSenderId: ,
  appId: :,
  measurementId: 
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and DB for other files to use
export const auth = getAuth(app);
export const db = getFirestore(app); // 2. EXPORT THE DATABASE
