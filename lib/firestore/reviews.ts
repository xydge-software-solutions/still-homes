// /lib/firestore/reviews.ts

import {
  doc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Review } from "@/types";

export async function getListingReviews(listingId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("listingId", "==", listingId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Review);
}

export async function getGuestReviews(guestId: string): Promise<Review[]> {
  const q = query(
    collection(db, "reviews"),
    where("guestId", "==", guestId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Review);
}