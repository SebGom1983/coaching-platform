// Server-only Firebase Admin setup. Used by API routes (like the .ics
// calendar feed) that need to read Firestore WITHOUT a signed-in user —
// calendar apps just fetch a plain URL, they can't send a login token.
//
// This runs on Vercel's free serverless functions (Hobby plan, no card
// needed) and only reads from Firestore's free Spark-plan quota — it does
// NOT need Firebase Storage or Cloud Functions, so it doesn't require the
// paid Blaze plan.

import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

function getAdminApp() {
  if (getApps().length) return getApps()[0];

  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (!serviceAccountJson) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
  }
  const serviceAccount = JSON.parse(serviceAccountJson);

  return initializeApp({
    credential: cert(serviceAccount),
  });
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
