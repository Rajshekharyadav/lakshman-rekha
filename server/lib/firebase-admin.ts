// Firebase Admin SDK for server-side operations
import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App;
let db: Firestore;

// Initialize Firebase Admin
if (!getApps().length) {
  // In production, use service account key
  // For development, we'll use the emulator or default credentials
  try {
    app = initializeApp({
      projectId: process.env.VITE_FIREBASE_PROJECT_ID || 'sarthi-e8175',
    });
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
} else {
  app = getApps()[0];
  db = getFirestore(app);
}

export { db };

// Helper functions for Firestore operations
export async function saveUserProfile(userId: string, data: {
  email: string;
  displayName?: string;
  location?: { lat: number; lng: number; address?: string };
}) {
  await db.collection('users').doc(userId).set({
    ...data,
    updatedAt: new Date().toISOString(),
  }, { merge: true });
}

export async function saveSafetyCheckIn(checkIn: {
  userId: string;
  location: { lat: number; lng: number };
  status: 'safe' | 'unsafe' | 'emergency';
  zoneRiskLevel?: string;
}) {
  await db.collection('safetyCheckIns').add({
    ...checkIn,
    timestamp: new Date().toISOString(),
  });
}

export async function getUserSafetyHistory(userId: string) {
  const snapshot = await db.collection('safetyCheckIns')
    .where('userId', '==', userId)
    .orderBy('timestamp', 'desc')
    .limit(10)
    .get();
  
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
