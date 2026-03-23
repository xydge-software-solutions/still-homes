// /app/(auth)/login/page.tsx — redesigned

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getUserProfile } from "@/lib/firestore/users";

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

const inputClass =
  "w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#C9954C]/20 focus:border-[#C9954C] transition-all duration-200 placeholder:text-gray-300 hover:border-gray-300 text-[#1C1C1E]";

const labelClass =
  "block text-[10px] font-semibold text-gray-400 uppercase tracking-[0.12em] mb-1.5";

// ─── Page ────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Shared redirect logic used by both email and Google login
  const redirectByRole = async (uid: string, role: string) => {
    const profile = await getUserProfile(uid);

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else if (role === "agent") {
      if (profile?.agentStatus === "suspended") {
        router.push("/suspended");
      } else {
        router.push("/dashboard");
      }
    } else {
      router.push("/stays");
    }
  };

  // ─── Email/Password Login ────────────────────────────────────────────────────

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { user } = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const tokenResult = await user.getIdTokenResult();
      const role = tokenResult.claims.role as string;

      await redirectByRole(user.uid, role);
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (
        code === "auth/user-not-found" ||
        code === "auth/wrong-password" ||
        code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password");
      } else if (code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ─── Google Login ─────────────────────────────────────────────────────────────

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);

    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);

      // Check if this Google user has a Firestore profile
      const profile = await getUserProfile(user.uid);

      if (!profile) {
        // This Google account has never completed registration
        // Send them to register to pick a role
        router.push("/register");
        return;
      }

      // Existing user — get role from custom claims and redirect
      const tokenResult = await user.getIdTokenResult();
      const role = tokenResult.claims.role as string;

      await redirectByRole(user.uid, role);
    } catch (err) {
      if ((err as { code?: string })?.code === "auth/popup-closed-by-user") {
        return;
      }
      setError("Google sign in failed. Please try again.");
      console.error("Google login error:", err);
    } finally {
      setGoogleLoading(false);
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-[28px] font-semibold text-[#1C1C1E] leading-tight tracking-tight">
          Welcome back
        </h1>
        <p className="text-gray-400 mt-1.5 text-sm">
          Sign in to continue to Still Homes
        </p>
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2.5 border border-gray-200 bg-white rounded-xl py-3.5 px-4 text-sm font-medium text-[#1C1C1E] hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
      >
        <GoogleIcon />
        {googleLoading ? "Opening Google\u2026" : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-gray-100" />
        <span className="text-[11px] text-gray-300 font-medium uppercase tracking-wider">or</span>
        <div className="flex-1 h-px bg-gray-100" />
      </div>

      {/* Form */}
      <form onSubmit={handleEmailSubmit} className="space-y-4">
        {/* Email */}
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

        {/* Password */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className={labelClass} style={{ marginBottom: 0 }}>Password</span>
            <a href="#" className="text-[11px] text-[#C9954C] hover:text-[#A07030] font-medium transition-colors">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Your password"
              autoComplete="current-password"
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-100 text-red-600 text-[13px] px-4 py-3 rounded-xl">
            <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#1C1C1E] text-white py-3.5 rounded-xl font-semibold text-sm hover:bg-[#2D2D30] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 mt-1"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Spinner />
              Signing in&hellip;
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <p className="text-center text-[13px] text-gray-400 mt-8">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[#1C1C1E] font-semibold hover:text-[#C9954C] transition-colors"
        >
          Create one
        </Link>
      </p>
    </>
  );
}