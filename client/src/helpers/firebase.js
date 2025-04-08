import {getAuth,GoogleAuthProvider} from 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getEnv } from "./getEnv";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey:getEnv('VITE_FIREBASE_API') ,
  authDomain: "mern-blog-1ea75.firebaseapp.com",
  projectId: "mern-blog-1ea75",
  storageBucket: "mern-blog-1ea75.firebasestorage.app",
  messagingSenderId: "574354244054",
  appId: "1:574354244054:web:d31c46450aa0ec165ee477"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app)
const provider = new GoogleAuthProvider()

export {auth , provider}