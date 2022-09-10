import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

console.log(process.env.REACT_APP_API_KEY)

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "chat-f3592.firebaseapp.com",
  projectId: "chat-f3592",
  storageBucket: "chat-f3592.appspot.com",
  messagingSenderId: "537646199572",
  appId: "1:537646199572:web:2fa8f164279c0d97160801"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
