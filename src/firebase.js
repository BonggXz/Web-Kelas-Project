// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"

import {getAuth, GoogleAuthProvider} from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBv8dwpk4R4pMcSdVqBoozfkdLsrxf5W_A",
  authDomain: "web-kelas-4dba7.firebaseapp.com",
  projectId: "web-kelas-4dba7",
  storageBucket: "web-kelas-4dba7.appspot.com",
  messagingSenderId: "307180776090",
  appId: "1:307180776090:web:c551c8c206af2a9019cd23"


};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();