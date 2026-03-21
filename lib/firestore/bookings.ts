

import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Booking } from "@/types";

export async function getBooking(id: string): Promise<Booking | null> {
  const snap = await getDoc(doc(db, "bookings", id));
  return snap.exists() ? (snap.data() as Booking) : null;
}

export async function getGuestBookings(guestId: string): Promise<Booking[]> {
  const q = query(
    collection(db, "bookings"),
    where("guestId", "==", guestId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Booking);
}

export async function getAgentBookings(agentId: string): Promise<Booking[]> {
  const q = query(
    collection(db, "bookings"),
    where("agentId", "==", agentId),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Booking);
}

export async function getAllBookings(): Promise<Booking[]> {
  const q = query(
    collection(db, "bookings"),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Booking);
}