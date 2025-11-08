// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBmPBWIIukKakHK_AfDpXxSNFCfWCmhhlI",
  authDomain: "my-dentara-app.firebaseapp.com",
  projectId: "my-dentara-app",
  storageBucket: "my-dentara-app.firebasestorage.app",
  messagingSenderId: "617609175259",
  appId: "1:617609175259:web:636268c8cd1d4fb9e9acfe",
  measurementId: "G-EPSJCMYTW6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;
