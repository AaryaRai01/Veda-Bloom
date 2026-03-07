import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};

// Debug logs
console.log("Firebase Config:", firebaseConfig);
console.log("API URL:", process.env.REACT_APP_API_URL);

// Prevent Firebase crash if env vars missing
if (!firebaseConfig.apiKey) {
  console.error("Firebase environment variables are missing");
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
