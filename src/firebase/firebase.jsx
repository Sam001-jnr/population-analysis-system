import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA1AaVa0O5BTq5gZTy4rGxQnfI26fQcyaA",
  authDomain: "population-analysis-system.firebaseapp.com",
  projectId: "population-analysis-system",
  storageBucket: "population-analysis-system.firebasestorage.app",
  messagingSenderId: "350453555081",
  appId: "1:350453555081:web:b13d2a2a0365a840014b58",
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };

export default app;