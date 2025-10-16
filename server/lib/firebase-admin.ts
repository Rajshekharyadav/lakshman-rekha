// Firebase Admin SDK configuration
// This file was missing and is needed for server-side Firebase operations

import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
let adminApp;
try {
  if (admin.apps.length === 0) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
      adminApp = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.VITE_FIREBASE_PROJECT_ID,
      });
    } else {
      console.warn('Firebase Admin SDK not configured - some features may not work');
      adminApp = null;
    }
  } else {
    adminApp = admin.apps[0];
  }
} catch (error) {
  console.error('Firebase Admin initialization error:', error);
  adminApp = null;
}

export const adminDb = adminApp ? admin.firestore(adminApp) : null;
export { adminApp };