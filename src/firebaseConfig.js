import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Log to console so you can see if Vercel is actually providing the keys
// This will help us confirm if the "Google Search" links are finally gone
console.log("Checking API URL:", process.env.REACT_APP_API_URL);

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Defensive check: Only initialize if the API key looks valid
// This prevents the "auth/invalid-api-key" crash from turning the screen white
const app = (firebaseConfig.apiKey && !firebaseConfig.apiKey.includes("google.com")) 
  ? initializeApp(firebaseConfig) 
  : null;

export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;

if (!app) {
  console.error("Firebase failed to initialize. Please check that your Vercel Environment Variables are clean and do not contain Google Search links!");
}
