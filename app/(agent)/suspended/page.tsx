export default function AgentSuspendedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-sm border p-8 max-w-md w-full text-center">
        <div className="text-5xl mb-4">🚫</div>
        <h2 className="text-2xl font-bold mb-2">Account Suspended</h2>
        <p className="text-gray-500">
          Your agent account has been suspended. Please contact support
          for more information.
        </p>
      </div>
    </div>
  );
}