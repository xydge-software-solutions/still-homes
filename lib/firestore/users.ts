

import {
  doc,
  getDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types";

export async function getUserProfile(
  uid: string
): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function updateUserProfile(
  uid: string,
  data: Partial<Pick<UserProfile, "fullName" | "phone">>
): Promise<void> {
  await updateDoc(doc(db, "users", uid), {
    ...data,
    updatedAt: new Date().toISOString(),
  });
}

// Agents who have submitted their ID and are awaiting admin review
export async function getPendingIdVerifications(): Promise<UserProfile[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "agent"),
    where("idVerification.status", "==", "submitted")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}

// All agents regardless of verification status
export async function getAllAgents(): Promise<UserProfile[]> {
  const q = query(
    collection(db, "users"),
    where("role", "==", "agent")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as UserProfile);
}