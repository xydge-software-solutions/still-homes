export type UserRole = "guest" | "agent" | "admin";
export type AgentStatus = "active" | "suspended";
export type IdVerificationStatus =
  | "unsubmitted"
  | "submitted"
  | "verified"
  | "rejected";
export type ListingStatus = "pending" | "approved" | "rejected";
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

// ─── USER ────────────────────────────────────────────────────────────────────

export interface IdVerification {
  status: IdVerificationStatus;
  idCardUrl: string | null;
  rejectionReason: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
}

export interface UserProfile {
  uid: string;
  email: string;
  fullName: string;
  phone: string;
  role: UserRole;
  agentStatus: AgentStatus | null;    // Only set when role === "agent"
  idVerification: IdVerification | null; // Only set when role === "agent"
  createdAt: string;
  updatedAt: string;
}

// ─── LISTING ─────────────────────────────────────────────────────────────────

export interface Listing {
  id: string;
  agentId: string;
  agentName: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pricePerNight: number;              // Stored in kobo
  images: string[];                   // Max 10 Storage URLs
  videoUrl: string | null;
  amenities: string[];
  maxGuests: number;
  status: ListingStatus;
  bookedDates: string[];              // ["2024-12-01", "2024-12-02"]
  rejectionReason: string | null;
  averageRating: number;              // Default 0
  totalReviews: number;               // Default 0
  createdAt: string;
  updatedAt: string;
}

// ─── BOOKING ─────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  listingId: string;
  listingTitle: string;
  listingCity: string;
  listingImage: string;
  guestId: string;
  guestName: string;
  guestEmail: string;
  agentId: string;
  checkIn: string;                    // "YYYY-MM-DD"
  checkOut: string;                   // "YYYY-MM-DD"
  nights: number;
  totalAmount: number;                // Kobo
  commissionAmount: number;           // Kobo
  agentEarnings: number;              // Kobo
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paystackReference: string;
  paystackChannel: string | null;
  hasReview: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── REVIEW ──────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  listingId: string;
  bookingId: string;
  guestId: string;
  guestName: string;
  rating: number;                     // 1 to 5
  comment: string;
  createdAt: string;
}

// ─── CONFIG ──────────────────────────────────────────────────────────────────

export interface CommissionConfig {
  percentage: number;
  updatedAt: string;
  updatedBy: string;
}