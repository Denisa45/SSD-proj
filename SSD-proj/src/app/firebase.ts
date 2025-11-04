// src/app/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAfV2w6KpVePZ6FEjSBsdkltayjQ74nUtw",
  authDomain: "studyplanner2-676f9.firebaseapp.com",
  projectId: "studyplanner2-676f9",
  storageBucket: "studyplanner2-676f9.firebasestorage.app",
  messagingSenderId: "619989503475",
  appId: "1:619989503475:web:2effce2a7c433d7bed5686",
  measurementId: "G-KHKHS4LSVH"
};

// ✅ Initialize Firebase and Auth
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
