// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAQpqCXQPg5JHhae2vDMmP0oH3Nsau-xM4",
  authDomain: "sihtest-5732c.firebaseapp.com",
  projectId: "sihtest-5732c",
  storageBucket: "sihtest-5732c.firebasestorage.app",
  messagingSenderId: "325818348088",
  appId: "1:325818348088:web:14788c9e101d49b404eccd",
  measurementId: "G-KSCC2YTQBT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); // 👈 add this
export const analytics = getAnalytics(app); // optional
