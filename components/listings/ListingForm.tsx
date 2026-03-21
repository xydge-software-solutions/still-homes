"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Listing } from "@/types";
import { nairaToKobo } from "@/lib/utils";
import ImageUploader from "./ImageUploader";
import VideoUploader from "./VideoUploader";

const AMENITIES_OPTIONS = [
  "WiFi", "AC", "Pool", "Parking", "Kitchen",
  "Washer", "TV", "Generator", "Security", "Gym",
];

const NIGERIA_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa",
  "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti",
  "Enugu", "FCT", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano",
  "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger",
  "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto",
  "Taraba", "Yobe", "Zamfara",
];

interface ListingFormProps {
  existingListing?: Listing;
}

interface FormData {
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  pricePerNight: string;
  maxGuests: string;
  amenities: string[];
  images: string[];
  videoUrl: string | null;
}

export default function ListingForm({ existingListing }: ListingFormProps) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const isEditing = !!existingListing;

  const [formData, setFormData] = useState<FormData>({
    title: existingListing?.title || "",
    description: existingListing?.description || "",
    address: existingListing?.address || "",
    city: existingListing?.city || "",
    state: existingListing?.state || "",
    pricePerNight: existingListing
      ? String(existingListing.pricePerNight / 100)
      : "",
    maxGuests: existingListing ? String(existingListing.maxGuests) : "",
    amenities: existingListing?.amenities || [],
    images: existingListing?.images || [],
    videoUrl: existingListing?.videoUrl || null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAmenityToggle = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const validate = (): string | null => {
    // Gate: must be ID verified to create or edit listings
    if (profile?.idVerification?.status !== "verified") {
      return "You must complete ID verification before creating listings.";
    }
    if (!formData.title.trim()) return "Title is required";
    if (!formData.description.trim()) return "Description is required";
    if (!formData.address.trim()) return "Address is required";
    if (!formData.city.trim()) return "City is required";
    if (!formData.state) return "State is required";
    if (!formData.pricePerNight || Number(formData.pricePerNight) <= 0)
      return "Valid price is required";
    if (!formData.maxGuests || Number(formData.maxGuests) <= 0)
      return "Valid guest count is required";
    if (formData.images.length === 0)
      return "At least one image is required";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const listingData = {
        agentId: user.uid,
        agentName: profile.fullName,
        title: formData.title.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state,
        pricePerNight: nairaToKobo(Number(formData.pricePerNight)),
        maxGuests: Number(formData.maxGuests),
        amenities: formData.amenities,
        images: formData.images,
        videoUrl: formData.videoUrl,
        updatedAt: new Date().toISOString(),
      };

      if (isEditing && existingListing) {
        // Editing resets status to pending — admin must re-approve
        await updateDoc(doc(db, "listings", existingListing.id), {
          ...listingData,
          status: "pending",
          rejectionReason: null,
        });
      } else {
        // Create new listing
        const docRef = await addDoc(collection(db, "listings"), {
          ...listingData,
          status: "pending",
          bookedDates: [],
          averageRating: 0,
          totalReviews: 0,
          rejectionReason: null,
          createdAt: new Date().toISOString(),
        });
        // Write the document's own ID into the document
        await updateDoc(docRef, { id: docRef.id });
      }

      router.push("/agent/listings");
    } catch (err) {
      setError("Failed to save listing. Please try again.");
      console.error("Listing save error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold">
        {isEditing ? "Edit Listing" : "Create New Listing"}
      </h1>

      {/* Basic Info */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">
          Basic Information
        </h2>
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            placeholder="Cozy 2-bedroom apartment in Lekki"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            rows={4}
            placeholder="Describe your property in detail..."
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </section>

      {/* Location */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Location</h2>
        <div>
          <label className="block text-sm font-medium mb-1">
            Street Address
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, address: e.target.value }))
            }
            placeholder="15 Admiralty Way"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, city: e.target.value }))
              }
              placeholder="Lagos"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              value={formData.state}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, state: e.target.value }))
              }
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select state</option>
              {NIGERIA_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">
          Pricing & Capacity
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Price per Night (₦)
            </label>
            <input
              type="number"
              value={formData.pricePerNight}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  pricePerNight: e.target.value,
                }))
              }
              placeholder="25000"
              min="0"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Maximum Guests
            </label>
            <input
              type="number"
              value={formData.maxGuests}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxGuests: e.target.value,
                }))
              }
              placeholder="4"
              min="1"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Amenities */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">Amenities</h2>
        <div className="grid grid-cols-3 gap-3">
          {AMENITIES_OPTIONS.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={formData.amenities.includes(amenity)}
                onChange={() => handleAmenityToggle(amenity)}
                className="rounded"
              />
              <span className="text-sm">{amenity}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">
          Photos (max 10)
        </h2>
        <ImageUploader
          agentId={user?.uid || ""}
          existingImages={formData.images}
          onImagesChange={(urls) =>
            setFormData((prev) => ({ ...prev, images: urls }))
          }
        />
      </section>

      {/* Video */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold border-b pb-2">
          Video Tour (optional)
        </h2>
        <VideoUploader
          agentId={user?.uid || ""}
          existingVideoUrl={formData.videoUrl}
          onVideoChange={(url) =>
            setFormData((prev) => ({ ...prev, videoUrl: url }))
          }
        />
      </section>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting
          ? isEditing
            ? "Saving changes..."
            : "Creating listing..."
          : isEditing
          ? "Save Changes"
          : "Submit for Approval"}
      </button>

      {isEditing && (
        <p className="text-sm text-gray-500 text-center">
          Editing a listing resets it to pending. Admin must re-approve.
        </p>
      )}
    </form>
  );
}