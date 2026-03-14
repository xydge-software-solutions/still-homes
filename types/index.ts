// /types/index.ts

export type UserRole = "guest" | "agent" | "admin";
export type AgentStatus = "pending" | "approved" | "suspended";
export type ListingStatus = "pending" | "approved" | "rejected";
export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  agentStatus?: AgentStatus;   // Only relevant when role === "agent"
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  agentId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pricePerNight: number;
  images: string[];            // Storage download URLs
  videoUrl?: string;           // One video max
  amenities: string[];
  maxGuests: number;
  status: ListingStatus;
  bookedDates: string[];       // ["2024-12-01", "2024-12-02"] — for double booking prevention
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  guestId: string;
  agentId: string;
  checkIn: string;             // "YYYY-MM-DD"
  checkOut: string;            // "YYYY-MM-DD"
  nights: number;
  totalAmount: number;
  commissionAmount: number;
  agentEarnings: number;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paystackReference: string;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  listingId: string;
  bookingId: string;            // One review per booking — enforced here and in rules
  guestId: string;
  guestName: string;            // Denormalized
  rating: number;               // 1 to 5 — integers only
  comment: string;
  createdAt: string;
}

export interface CommissionConfig {
  percentage: number;          // e.g. 10 means 10%
  updatedAt: string;
  updatedBy: string;           // admin uid
}