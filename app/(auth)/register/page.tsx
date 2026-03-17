// /app/(auth)/register/page.tsx — redesigned

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserRole } from "@/types";

type RegisterMode = "guest" | "agent";

// ─── Shared micro-components ──────────────────────────────────────────────────

const GoogleIcon = () => (
  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

const EyeIcon = ({ open }: { open: boolean }) =>
  open ? (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ) : (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );

const Spinner = () => (
  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const ErrorBanner = ({ message }: { message: string }) => (
  <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-600 text-[13px] px-4 py-3 rounded-xl">
    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
    {message}
  </div>
);

const AgentWarning = () => (
  <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 text-amber-700 text-[13px] px-4 py-3 rounded-xl mb-5">
    <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
    You can access your dashboard immediately. Upload a valid ID card to start listing properties.
  </div>
);

const RoleToggle = ({
  value,
  onChange,
}: {
  value: RegisterMode;
  onChange: (v: RegisterMode) => void;
}) => (
  <div className="flex bg-gray-50 border border-gray-100 rounded-xl p-1 mb-5">
    {(["guest", "agent"] as const).map((role) => (
      <button
        key={role}
        type="button"
        onClick={() => onChange(role)}
        className={`flex-1 py-2.5 rounded-[10px] text-sm font-medium transition-all duration-200 ${
          value === role
            ? "bg-white shadow-sm text-[#1C1C1E] border border-gray-100"
            : "text-gray-400 hover:text-gray-600"
        }`}
      >
        {role === "guest" ? "I am a Guest" : "I am an Agent"}
      </button>
    ))}
  </div>
);

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9954C]/20 focus:border-[#C9954C] transition-all duration-200 placeholder:text-gray-300 hover:border-gray-300 text-[#1C1C1E]";

const labelClass =
  "block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5";

// ─── Page ────────────────────────────────────────────────────────────────────
async function createUserProfile(
  uid: string,
  email: string,
  fullName: string,
  phone: string,
  role: UserRole
) {
  await setDoc(doc(db, "users", uid), {
    uid,
    email,
    fullName,
    phone,
    role,
    agentStatus: role === "agent" ? "active" : null,
    idVerification:
      role === "agent"
        ? {
            status: "unsubmitted",
            idCardUrl: null,
            rejectionReason: null,
            submittedAt: null,
            reviewedAt: null,
          }
        : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
}

export default function RegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<RegisterMode>("guest");

  // Email/password form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Google role selection state
  // When a new Google user signs in we need to ask them their role
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{
    uid: string;
    email: string;
    fullName: string;
  } | null>(null);
  const [googleRole, setGoogleRole] = useState<RegisterMode>("guest");
  const [googlePhone, setGooglePhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): string | null => {
    if (!formData.fullName.trim()) return "Full name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.phone.trim()) return "Phone number is required";
    if (formData.password.length < 6)
      return "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      return "Passwords do not match";
    return null;
  };

  // ─── Email/Password Registration ────────────────────────────────────────────

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      await updateProfile(user, { displayName: formData.fullName });

      await createUserProfile(
        user.uid,
        formData.email,
        formData.fullName,
        formData.phone,
        mode
      );

      router.push(mode === "agent" ? "/agent/dashboard" : "/listings");
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === "auth/email-already-in-use") {
        setError("An account with this email already exists");
      } else if (code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (code === "auth/weak-password") {
        setError("Password is too weak");
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Google Registration ─────────────────────────────────────────────────────

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      // Check if this Google account already has a Firestore profile
      const existingProfile = await getDoc(doc(db, "users", user.uid));

      if (existingProfile.exists()) {
        // Returning user — they already have a role
        // Send them to login flow instead
        const profile = existingProfile.data();
        if (profile.role === "admin") {
          router.push("/admin/dashboard");
        } else if (profile.role === "agent") {
          router.push("/agent/dashboard");
        } else {
          router.push("/listings");
        }
        return;
      }

      // New Google user — we need their role and phone
      // Show the role selection step instead of redirecting
      setPendingGoogleUser({
        uid: user.uid,
        email: user.email || "",
        fullName: user.displayName || "",
      });
    } catch (err: any) {
      if (err.code === "auth/popup-closed-by-user") {
        // User closed the popup — not an error worth showing
        return;
      }
      setError("Google sign in failed. Please try again.");
      console.error("Google sign in error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── Complete Google Registration ────────────────────────────────────────────
  // Called after new Google user selects their role and enters phone number

  const handleCompleteGoogleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingGoogleUser) return;

    if (!googlePhone.trim()) {
      setError("Phone number is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createUserProfile(
        pendingGoogleUser.uid,
        pendingGoogleUser.email,
        pendingGoogleUser.fullName,
        googlePhone,
        googleRole
      );

      router.push(
        googleRole === "agent" ? "/agent/dashboard" : "/listings"
      );
    } catch (err) {
      setError("Failed to complete registration. Please try again.");
      console.error("Google profile creation error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ─── Render: Google Role Selection Step ──────────────────────────────────────
  // This screen only appears for brand new Google users

  if (pendingGoogleUser) {
    return (
      <>
        <div className="mb-8">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
            </svg>
          </div>
          <h1 className="text-[28px] font-semibold text-[#1C1C1E] leading-tight tracking-tight">
            One last step
          </h1>
          <p className="text-gray-400 mt-1.5 text-sm">
            Welcome,{" "}
            <span className="text-[#1C1C1E] font-medium">{pendingGoogleUser.fullName}</span>.
            How will you use Still Homes?
          </p>
        </div>

        <form onSubmit={handleCompleteGoogleRegistration} className="space-y-4">
          <RoleToggle value={googleRole} onChange={setGoogleRole} />

          {googleRole === "agent" && (
            <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 text-amber-700 text-[13px] px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              You will need to upload a valid ID card before you can create listings.
            </div>
          )}

          <div>
            <label className={labelClass}>Phone Number</label>
            <input
              type="tel"
              value={googlePhone}
              onChange={(e) => setGooglePhone(e.target.value)}
              placeholder="+234 800 000 0000"
              autoComplete="tel"
              className={inputClass}
            />
          </div>

          {error && <ErrorBanner message={error} />}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1C1C1E] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#2D2D30] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 mt-1"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Spinner />
                Setting up account&hellip;
              </span>
            ) : (
              "Complete Registration"
            )}
          </button>
        </form>
      </>
    );
  }

  // ─── Render: Main Registration Form ──────────────────────────────────────────

  return (
    <>
      <div className="mb-7">
        <h1 className="text-[28px] font-semibold text-[#1C1C1E] leading-tight tracking-tight">
          Create an account
        </h1>
        <p className="text-gray-400 mt-1.5 text-sm">
          Join Still Homes &mdash; it only takes a minute
        </p>
      </div>

      {/* Role Toggle */}
      <RoleToggle value={mode} onChange={setMode} />

      {mode === "agent" && <AgentWarning />}

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2.5 border border-gray-200 bg-white rounded-xl py-3.5 px-4 text-sm font-medium text-[#1C1C1E] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <GoogleIcon />
        {googleLoading ? "Opening Google\u2026" : `Continue with Google as ${mode}`}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-5">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[11px] text-gray-300 font-medium uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Email/Password Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        <div>
          <label className={labelClass}>Full Name</label>
          <input
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="John Doe"
            autoComplete="name"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
        </div>

        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+234 800 000 0000"
            autoComplete="tel"
            className={inputClass}
          />
        </div>

        {/* Password row — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                placeholder="Min. 6 chars"
                autoComplete="new-password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          <div>
            <label className={labelClass}>Confirm</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repeat"
                autoComplete="new-password"
                className={`${inputClass} pr-11`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                <EyeIcon open={showConfirmPassword} />
              </button>
            </div>
          </div>
        </div>

        {error && <ErrorBanner message={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C1C1E] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#2D2D30] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 mt-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Creating account&hellip;
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <p className="text-center text-[13px] text-gray-400 mt-7">
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-[#1C1C1E] font-semibold hover:text-[#C9954C] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </>
  );
}