// src/lib/firebase-admin.ts
import { initializeApp, applicationDefault, getApps } from 'firebase-admin/app'; // Import getApps
import { getAuth } from 'firebase-admin/auth';
// Initialize Firebase Admin SDK (only once)
if (!getApps().length) {
    initializeApp({
        credential: applicationDefault(), // Use environment variables for production
    });
}
// Export Firebase Admin Auth
export const adminAuth = getAuth();
