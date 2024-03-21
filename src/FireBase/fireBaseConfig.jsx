// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import * as firebase from 'firebase';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAl75-7cxK0okEbOEnpEABmzmEJr_aQv-I",
  authDomain: "alessandro-portfolio.firebaseapp.com",
  databaseURL: "https://alessandro-portfolio-default-rtdb.firebaseio.com",
  projectId: "alessandro-portfolio",
  storageBucket: "alessandro-portfolio.appspot.com",
  messagingSenderId: "1077155633264",
  appId: "1:1077155633264:web:176463c5c50b9a28427cb5",
  measurementId: "G-WG3E4CSVFR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const googleProvider = new firebase.auth.GoogleAuthProvider();
