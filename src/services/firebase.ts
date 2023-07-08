import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "";

const firebaseConfig = JSON.parse(config);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
