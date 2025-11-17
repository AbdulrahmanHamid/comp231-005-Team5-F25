// Firebase initialization file
// Done by Vaibhav Kalia

// Import the functions you need from the SDKs you need
// These imports let us use Firebase core, Authentication, and Firestore in our app.
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// This object contains all the keys and identifiers needed to connect this frontend
// project to the correct Firebase project in the cloud.
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
// This creates a Firebase app instance using the config above.
// All other Firebase services (auth, firestore, etc.) will use this app instance.
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
// We set up `auth` so the rest of the app can handle login, signup, and user sessions.
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
// We set up `db` so the rest of the app can read and write data to Firestore.
export const db = getFirestore(app);

// Export the initialized app so it can be reused if needed in other files.
export default app;
