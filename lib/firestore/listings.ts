// /lib/firestore/listings.ts

import {
  doc,
  getDoc,
  addDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Listing, ListingStatus } from "@/types";

export async function getListing(id: string): Promise<Listing | null> {
  const snap = await getDoc(doc(db, "listings", id));
  return snap.exists() ? (snap.data() as Listing) : null;
}

export async function getApprovedListings(city?: string): Promise<Listing[]> {
  const constraints = [
    where("status", "==", "approved"),
    orderBy("createdAt", "desc"),
  ];
  if (city) constraints.unshift(where("city", "==", city));

  const q = query(collection(db, "listings"), ...constraints);
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Listing);
}

export async function getAgentListings(agentId: string): Promise<Listing[]> {
  const q = query(
    collection(db, "listings"),
    where("agentId", "==", agentId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Listing);
}

export async function getPendingListings(): Promise<Listing[]> {
  const q = query(
    collection(db, "listings"),
    where("status", "==", "pending"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Listing);
}

export async function updateListingStatus(
  listingId: string,
  status: ListingStatus,
  rejectionReason?: string
): Promise<void> {
  await updateDoc(doc(db, "listings", listingId), {
    status,
    rejectionReason: rejectionReason || null,
    updatedAt: new Date().toISOString(),
  });
}