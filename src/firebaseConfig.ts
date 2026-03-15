// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCANvvs3gTR8jbrrDHFYBCDl3BGsUTRBwU",
  authDomain: "experiencesocial-6de79.firebaseapp.com",
  projectId: "experiencesocial-6de79",
  storageBucket: "experiencesocial-6de79.firebasestorage.app",
  messagingSenderId: "1007508534190",
  appId: "1:1007508534190:web:7ffff8eaa6a9c330f74e3f",
  measurementId: "G-19GY4DZTYP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);