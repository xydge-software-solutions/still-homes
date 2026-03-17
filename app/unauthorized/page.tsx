

import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-6">
          You do not have permission to view this page.
        </p>
        <Link href="/" className="text-blue-600 hover:underline">
          Go back home
        </Link>
      </div>
    </div>
  );
}