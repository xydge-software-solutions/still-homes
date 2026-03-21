// /components/agent/IdVerificationUploader.tsx

"use client";

import { useState, useRef } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { IdVerificationStatus } from "@/types";

export default function IdVerificationUploader() {
  const { user, profile } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [justSubmitted, setJustSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const status: IdVerificationStatus =
    profile?.idVerification?.status || "unsubmitted";

  // Verified — no banner needed
  if (status === "verified") return null;

  // Submitted and awaiting review
  if (status === "submitted" || justSubmitted) {
    return (
      <section className="rounded-[30px] border border-white/70 bg-white/82 p-6 shadow-[0_24px_70px_rgba(17,24,39,0.08)] backdrop-blur-sm sm:p-7">
        <div className="inline-flex rounded-full bg-[#FFF5E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9954C]">
          Verification in review
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1C1C1E]">
          Your ID has been submitted successfully
        </h2>
        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your ID has been submitted and is under review. You will be
          able to create listings once an admin verifies it. This
          usually takes less than 24 hours.
        </p>
      </section>
    );
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const isImage = file.type.startsWith("image/");
    const isPdf = file.type === "application/pdf";

    if (!isImage && !isPdf) {
      setError("Only image or PDF files are allowed");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const storageRef = ref(storage, `id-cards/${user.uid}/${fileName}`);

      await new Promise<void>((resolve, reject) => {
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const pct = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            setProgress(pct);
          },
          reject,
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(doc(db, "users", user.uid), {
              "idVerification.status": "submitted",
              "idVerification.idCardUrl": url,
              "idVerification.submittedAt": new Date().toISOString(),
              "idVerification.rejectionReason": null,
              updatedAt: new Date().toISOString(),
            });
            setJustSubmitted(true);
            resolve();
          }
        );
      });
    } catch (err) {
      setError("Upload failed. Please try again.");
      console.error("ID upload error:", err);
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <section className="rounded-[30px] border border-white/70 bg-white/82 p-6 shadow-[0_24px_70px_rgba(17,24,39,0.08)] backdrop-blur-sm sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl">
          <div className="inline-flex rounded-full bg-[#FFF5E8] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9954C]">
            {status === "rejected" ? "Action required" : "Identity verification"}
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-[#1C1C1E]">
            {status === "rejected"
              ? "Your last submission needs to be updated"
              : "Verify your identity before publishing listings"}
          </h2>
          <p className="mt-3 text-sm leading-6 text-gray-500">
            Upload a government-issued ID card - NIN slip, driver&apos;s
            license, international passport, or voter&apos;s card.
          </p>
          {status === "rejected" &&
            profile?.idVerification?.rejectionReason && (
              <p className="mt-3 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                Rejection reason:{" "}
                {profile.idVerification.rejectionReason}
              </p>
            )}
        </div>

        <div className="min-w-[220px] rounded-[26px] bg-[#1C1C1E] p-5 text-white shadow-[0_20px_50px_rgba(28,28,30,0.25)]">
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Accepted files</p>
          <p className="mt-2 text-sm text-white/85">Images and PDFs</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-white/45">Max size</p>
          <p className="mt-2 text-sm text-white/85">5MB per upload</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.pdf"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="mt-6 rounded-[26px] border border-dashed border-[#C9954C]/35 bg-[#FFFDF9] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#1C1C1E]">
              {status === "rejected" ? "Upload a revised ID document" : "Upload your ID document"}
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Clear, readable documents are reviewed faster.
            </p>
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="inline-flex items-center justify-center rounded-full bg-[#1C1C1E] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#2D2D30] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? `Uploading ${progress}%`
              : status === "rejected"
                ? "Upload new ID"
                : "Upload ID card"}
          </button>
        </div>

        {uploading && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-gray-400">
              <span>Upload progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-[#C9954C] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    </section>
  );
}