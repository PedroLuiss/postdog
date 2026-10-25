import { initializeApp, FirebaseApp } from "firebase/app";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

let app: FirebaseApp | null = null;
let messaging: Messaging | null = null;

try {
  app = initializeApp(firebaseConfig);
  if (typeof window !== "undefined") {
    isSupported().then((supported) => {
      if (supported && "serviceWorker" in navigator) {
        messaging = getMessaging(app!);
      }
    }).catch(err => console.warn("Messaging not supported:", err));
  }
} catch (error) {
  console.error("Error al inicializar Firebase:", error);
}

export { app, messaging };