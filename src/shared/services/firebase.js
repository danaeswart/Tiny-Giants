import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// These values identify the project, they are not secrets. Access is protected by
// the sign-in and by firestore.rules. Fill them in via .env.local (see .env.example).
const config = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const alreadyStarted = getApps().length > 0; // true after a fast refresh
const app = alreadyStarted ? getApp() : initializeApp(config);

// The sign-in is kept in memory only, never written to the device, so every time the app
// is opened it starts at the login screen. (To stay signed in between launches, use
// getReactNativePersistence(AsyncStorage) here instead.)
export const auth = alreadyStarted ? getAuth(app) : initializeAuth(app, { persistence: inMemoryPersistence });

export const db = getFirestore(app);

