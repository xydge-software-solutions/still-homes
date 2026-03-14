// /functions/src/index.ts

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();
const db = admin.firestore();

// Fires every time a new user registers
export const onUserCreated = functions.auth.user().onCreate(async (user) => {
  const { uid, email, displayName } = user;

  // Default role is guest
  // Agents will register through a separate flow that sets role: "agent"
  const role = "guest";

  // Set custom claim
  await admin.auth().setCustomUserClaims(uid, { role });

  // Create Firestore profile
  await db.doc(`users/${uid}`).set({
    uid,
    email,
    fullName: displayName || "",
    phone: "",
    role,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  console.log(`Created user profile for ${uid} with role: ${role}`);
});