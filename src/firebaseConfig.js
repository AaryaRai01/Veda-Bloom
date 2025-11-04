import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Read the secret keys from the .env.local file
const firebaseConfig = {
  REACT_APP_API_KEY="YOUR_API_KEY_HERE"
  REACT_APP_AUTH_DOMAIN="YOUR_AUTH_DOMAIN_HERE"
  REACT_APP_PROJECT_ID="YOUR_PROJECT_ID_HERE"
  REACT_APP_STORAGE_BUCKET="YOUR_STORAGE_BUCKET_HERE"
  REACT_APP_MESSAGING_SENDER_ID="YOUR_MESSAGING_SENDER_ID_HERE"
  REACT_APP_APP_ID="YOUR_APP_ID_HERE"
  REACT_APP_MEASUREMENT_ID="YOUR_MEASUREMENT_ID_HERE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Auth and DB
export const auth = getAuth(app);
export const db = getFirestore(app);
