// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import firebase from "firebase/compat/app";
import "firebase/firestore";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBHL0DFSwN5V58YgxzTFGKD-0DN1Mcnazo",
  authDomain: "todo-list-be277.firebaseapp.com",
  projectId: "todo-list-be277",
  storageBucket: "todo-list-be277.appspot.com",
  messagingSenderId: "1065540951605",
  appId: "1:1065540951605:web:e14011616ebc1bba049b7c",
  measurementId: "G-3YQL91ZBVJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db}