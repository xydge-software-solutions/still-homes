// /lib/firestore/config.ts

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { CommissionConfig } from "@/types";

export async function getCommissionConfig(): Promise<CommissionConfig | null> {
  const snap = await getDoc(doc(db, "config", "commission"));
  return snap.exists() ? (snap.data() as CommissionConfig) : null;
}

export async function updateCommissionConfig(
  percentage: number,
  adminUid: string
): Promise<void> {
  await setDoc(doc(db, "config", "commission"), {
    percentage,
    updatedAt: new Date().toISOString(),
    updatedBy: adminUid,
  });
}
