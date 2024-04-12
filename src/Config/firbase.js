// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from 'firebase/auth';
import {getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyCH9-5pm2DF905hOYTqNysvxP48tLpWseo",
  authDomain: "firbase-course-93d25.firebaseapp.com",
  projectId: "firbase-course-93d25",
  storageBucket: "firbase-course-93d25.appspot.com",
  messagingSenderId: "821638611672",
  appId: "1:821638611672:web:8b97c80c9a253e4cc34dad",
  measurementId: "G-XRPWS9X6SN"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);