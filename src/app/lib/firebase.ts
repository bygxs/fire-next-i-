// lib/firebase/firebase.ts
/* Explanation of the Combined File:
Firebase Initialization: The initializeFirebase function checks if Firebase has already been initialized. If not, it initializes it with the configuration from environment variables.
Firebase Services: The authentication, Firestore, and storage services are initialized and exported.
FCM Token Management: The getFCMToken function requests notification permissions and retrieves the FCM token.
Message Listener: The onMessageListener function sets up a listener for incoming messages.
This structure keeps your Firebase setup organized and allows you to easily manage both the core Firebase services and the messaging functionality. */
// lib/firebase/firebase.ts

import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, getToken, onMessage, Messaging } from 'firebase/messaging';

let firebaseApp: FirebaseApp | undefined;
let messaging: Messaging | undefined;

// Initialize Firebase if it hasn't been already
const initializeFirebase = () => {
  if (!getApps().length) {
    const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    };

    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApps()[0];
  }
};

// Ensure Firebase is initialized before accessing services
const ensureFirebaseInitialized = () => {
  if (!firebaseApp) {
    initializeFirebase();
  }
};

// Initialize Firebase services
const getFirebaseServices = () => {
  ensureFirebaseInitialized();
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  return { auth, db, storage };
};

// Get FCM token
export const getFCMToken = async () => {
  if (typeof window === 'undefined') return null;

  try {
    initializeFirebase();

    if (!messaging) {
      messaging = getMessaging(firebaseApp);
    }

    // Request permission
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      console.log('Notification permission denied');
      return null;
    }

    // Get token
    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    console.log('FCM Token:', token);
    return token;
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};

// Listen for messages
export const onMessageListener = (callback: (payload: any) => void) => {
  if (typeof window === 'undefined') return () => {};

  try {
    initializeFirebase();

    if (!messaging) {
      messaging = getMessaging(firebaseApp);
    }

    return onMessage(messaging, callback);
  } catch (error) {
    console.error('Error setting up message listener:', error);
    return () => {};
  }
};

// Export Firebase services
export const { auth, db, storage } = getFirebaseServices();
