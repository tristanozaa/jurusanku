// Fix: Changed import style to namespace import to potentially work around a module resolution issue.
import * as firebaseApp from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Ganti dengan konfigurasi Firebase Anda sendiri
// Anda bisa mendapatkannya dari Firebase Console proyek Anda:
// Project Settings > General > Your apps > Web app > Firebase SDK snippet > Config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Inisialisasi Firebase
const app = firebaseApp.initializeApp(firebaseConfig);

// Ekspor layanan Firebase yang akan digunakan
export const auth = getAuth(app);
export const db = getFirestore(app);
