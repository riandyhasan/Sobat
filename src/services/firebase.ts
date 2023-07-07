import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const config = process.env.NEXT_PUBLIC_FIREBASE_CONFIG || "";

const firebaseConfig = JSON.parse(config);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
