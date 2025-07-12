import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getToken, onMessage } from "firebase/messaging";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const config = {
  apiKey: "AIzaSyAl75-7cxK0okEbOEnpEABmzmEJr_aQv-I",
  authDomain: "alessandro-portfolio.firebaseapp.com",
  databaseURL: "https://alessandro-portfolio-default-rtdb.firebaseio.com",
  projectId: "alessandro-portfolio",
  storageBucket: "alessandro-portfolio.firebasestorage.app",
  messagingSenderId: "1077155633264",
  appId: "1:1077155633264:web:176463c5c50b9a28427cb5",
  measurementId: "G-WG3E4CSVFR"
};

export const provider = new GoogleAuthProvider();

export const app = initializeApp(config);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

const firebaseConfig = { auth, db, provider, storage, onMessage, getToken };

export default firebaseConfig;

//https://console.cloud.google.com/auth/overview?inv=1&invt=Abyu-Q&project=alessandro-portfolio