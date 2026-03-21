// /components/listings/VideoUploader.tsx

"use client";

import { useState, useRef } from "react";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebase";

interface VideoUploaderProps {
  agentId: string;
  existingVideoUrl?: string | null;
  onVideoChange: (url: string | null) => void;
}

export default function VideoUploader({
  agentId,
  existingVideoUrl = null,
  onVideoChange,
}: VideoUploaderProps) {
  const [videoUrl, setVideoUrl] = useState<string | null>(existingVideoUrl);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      setError("Only video files are allowed");
      return;
    }
    if (file.size > 100 * 1024 * 1024) {
      setError("Video must be under 100MB");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      if (videoUrl) {
        try {
          await deleteObject(ref(storage, videoUrl));
        } catch {
          // Continue even if old video delete fails
        }
      }

      const fileName = `${Date.now()}-${file.name.replace(/\s/g, "_")}`;
      const storageRef = ref(
        storage,
        `listings/${agentId}/videos/${fileName}`
      );

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
            setVideoUrl(url);
            onVideoChange(url);
            resolve();
          }
        );
      });
    } catch {
      setError("Video upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    if (!videoUrl) return;
    try {
      await deleteObject(ref(storage, videoUrl));
    } catch {
      console.warn("Could not delete video from storage");
    }
    setVideoUrl(null);
    onVideoChange(null);
  };

  return (
    <div className="space-y-4">
      {videoUrl ? (
        <div className="space-y-2">
          <video
            src={videoUrl}
            controls
            className="w-full rounded-lg max-h-64"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-500 text-sm hover:underline"
          >
            Remove video
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <span className="text-gray-500">
                Uploading video... {progress}%
              </span>
            ) : (
              <span className="text-gray-500">
                Click to upload a video tour (max 100MB, optional)
              </span>
            )}
          </button>

          {uploading && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}