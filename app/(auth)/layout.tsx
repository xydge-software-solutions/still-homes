
import Link from "next/link";
import { ImageCarousel } from "@/components/auth/ImageCarousel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[5fr_7fr]">
      {/* ── Left panel – form ─────────────────────────────────────── */}
      <div className="flex flex-col min-h-screen bg-white">
        {/* Logo */}
        <div className="px-8 md:px-12 pt-8 shrink-0">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-[#1C1C1E] flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z"
                  fill="white"
                />
              </svg>
            </div>
            <span className="font-semibold text-[#1C1C1E] text-[17px] tracking-tight">
              Still Homes
            </span>
          </Link>
        </div>

        {/* Scrollable form area — centers when content fits, scrolls when it doesn't */}
        <div className="flex-1 overflow-y-auto px-8 md:px-12">
          <div className="min-h-full flex flex-col justify-center py-10">
            <div className="w-full max-w-105 mx-auto">
              {children}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 md:px-12 py-5 shrink-0">
          <p className="text-[11px] text-gray-300">
            © 2026 Still Homes. All rights reserved.
          </p>
        </div>
      </div>

      {/* ── Right panel – image carousel ──────────────────────────── */}
      <div className="hidden lg:block sticky top-0 h-screen bg-gray-900 overflow-hidden">
        <ImageCarousel />
      </div>
    </div>
  );
}