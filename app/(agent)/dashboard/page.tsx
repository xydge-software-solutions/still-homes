"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Booking } from "@/types";
import { koboToNaira } from "@/lib/utils";
import RoleGuard from "@/components/shared/RoleGuard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalListings: number;
  totalBookings: number;
  monthlyEarnings: number;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-700",
    pending: "bg-amber-100 text-amber-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };
  return (
    <span
      className={`text-xs font-semibold px-3 py-1 rounded-full ${
        styles[status] || "bg-gray-100 text-gray-600"
      }`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon,
  label,
  value,
  change,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <span className="text-emerald-500 text-sm font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">
          {change}
        </span>
      </div>
      <p className="text-gray-500 text-sm mb-1">{label}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AgentDashboard() {
  const { user } = useAuth();


  const [stats, setStats] = useState<DashboardStats>({
    totalListings: 0,
    totalBookings: 0,
    monthlyEarnings: 0,
  });
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [earningsData, setEarningsData] = useState<
    { month: string; earnings: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Fetch listings count
      const listingsSnap = await getDocs(
        query(
          collection(db, "listings"),
          where("agentId", "==", user.uid)
        )
      );
      const totalListings = listingsSnap.size;

      // Fetch all bookings for this agent
      const bookingsSnap = await getDocs(
        query(
          collection(db, "bookings"),
          where("agentId", "==", user.uid),
          orderBy("createdAt", "desc")
        )
      );

      const allBookings = bookingsSnap.docs.map(
        (d) => d.data() as Booking
      );
      const totalBookings = allBookings.length;

      // Calculate monthly earnings (current month)
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const monthlyEarnings = allBookings
        .filter((b) => {
          const date = new Date(b.createdAt);
          return (
            b.paymentStatus === "paid" &&
            date.getMonth() === currentMonth &&
            date.getFullYear() === currentYear
          );
        })
        .reduce((sum, b) => sum + b.agentEarnings, 0);

      // Build last 6 months earnings data for chart
      const monthNames = ["Jan","Feb","Mar","Apr","May","Jun",
        "Jul","Aug","Sep","Oct","Nov","Dec"];

      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return { month: monthNames[d.getMonth()], year: d.getFullYear(), monthIndex: d.getMonth() };
      });

      const chartData = last6Months.map(({ month, year, monthIndex }) => {
        const earnings = allBookings
          .filter((b) => {
            const date = new Date(b.createdAt);
            return (
              b.paymentStatus === "paid" &&
              date.getMonth() === monthIndex &&
              date.getFullYear() === year
            );
          })
          .reduce((sum, b) => sum + b.agentEarnings / 100, 0);
        return { month, earnings };
      });

      // Recent bookings — last 4
      const recent = allBookings.slice(0, 4);

      setStats({ totalListings, totalBookings, monthlyEarnings });
      setRecentBookings(recent);
      setEarningsData(chartData);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetchDashboardData();
  }, [user, fetchDashboardData]);

  return (
    <RoleGuard allowedRoles={["agent"]}>
      <div className="flex bg-gray-50 min-h-screen">
        
        {/* Main Content */}
        <main className="flex-1 min-h-screen">
          {/* Top Bar */}
          <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20">
            <h1 className="text-xl font-bold text-gray-900">
              Agent Dashboard
            </h1>
            <div className="flex items-center gap-3">
              {/* Notification Bell */}
              <button className="relative w-10 h-10 flex items-center justify-center rounded-xl hover:bg-gray-50 transition-colors">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5 text-gray-500"
                >
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>

              {/* New Listing Button */}
              <Link
                href="/agent/listings/new"
                className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4"
                >
                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                </svg>
                New Listing
              </Link>
            </div>
          </header>

          <div className="p-8 space-y-8">
            

            {/* Stat Cards */}
            <div className="grid grid-cols-3 gap-6">
              <StatCard
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-cyan-600">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                }
                label="Total Listings"
                value={loading ? "—" : String(stats.totalListings)}
                change="+12%"
                color="bg-cyan-50"
              />
              <StatCard
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-blue-600">
                    <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                  </svg>
                }
                label="Total Bookings"
                value={loading ? "—" : String(stats.totalBookings)}
                change="+8%"
                color="bg-blue-50"
              />
              <StatCard
                icon={
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-emerald-600">
                    <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                  </svg>
                }
                label="Monthly Earnings"
                value={loading ? "—" : koboToNaira(stats.monthlyEarnings)}
                change="+22%"
                color="bg-emerald-50"
              />
            </div>

            {/* Bottom Grid — Bookings + Quick Add */}
            <div className="grid grid-cols-3 gap-6">
              {/* Recent Bookings */}
              <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">Recent Bookings</h2>
                  <Link
                    href="/agent/bookings"
                    className="text-sm text-cyan-500 font-semibold hover:underline"
                  >
                    View All
                  </Link>
                </div>

                {loading ? (
                  <div className="p-6">
                    <p className="text-gray-400 text-sm">
                      Loading bookings...
                    </p>
                  </div>
                ) : recentBookings.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-400 text-sm">
                      No bookings yet.
                    </p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Guest
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentBookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {/* Avatar with initials */}
                              <div className="w-8 h-8 rounded-full bg-cyan-100 flex items-center justify-center shrink-0">
                                <span className="text-cyan-600 text-xs font-bold">
                                  {booking.guestName
                                    ?.split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("") || "G"}
                                </span>
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {booking.guestName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-600 truncate max-w-32 block">
                              {booking.listingTitle}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-gray-500">
                              {booking.checkIn.slice(5)} –{" "}
                              {booking.checkOut.slice(5)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge
                              status={booking.bookingStatus}
                            />
                          </td>
                          <td className="px-6 py-4">
                            <button className="text-gray-300 hover:text-gray-500">
                              <svg
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className="w-5 h-5"
                              >
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Quick Add Listing */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-bold text-gray-900 mb-1">
                  Add New Listing
                </h2>
                <p className="text-gray-400 text-sm mb-5">
                  Draft a new property listing quickly.
                </p>

                <QuickListingForm />
              </div>
            </div>

            {/* Earnings Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-bold text-gray-900">
                    Earnings Performance
                  </h2>
                  <p className="text-gray-400 text-sm mt-0.5">
                    Revenue statistics for the last 6 months
                  </p>
                </div>
                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                  Last 6 Months
                </span>
              </div>

              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={earningsData}
                    margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="earningsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#06b6d4"
                          stopOpacity={0.15}
                        />
                        <stop
                          offset="95%"
                          stopColor="#06b6d4"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#f1f5f9"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#94a3b8", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) =>
                        v >= 1000 ? `₦${v / 1000}k` : `₦${v}`
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "12px",
                        fontSize: "13px",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      formatter={(value: any) => [
                        `₦${value.toLocaleString()}`,
                        "Earnings",
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke="#06b6d4"
                      strokeWidth={2.5}
                      fill="url(#earningsGradient)"
                      dot={false}
                      activeDot={{
                        r: 5,
                        fill: "#06b6d4",
                        stroke: "#fff",
                        strokeWidth: 2,
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}

// ─── Quick Listing Form ───────────────────────────────────────────────────────

function QuickListingForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Apartment");
  const [price, setPrice] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    // Pass title and price as query params to pre-fill the full form
    const params = new URLSearchParams({ title, type, price });
    router.push(`/agent/listings/new?${params.toString()}`);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Property Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Modern Sunset Penthouse"
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent bg-white"
          >
            <option>Apartment</option>
            <option>House</option>
            <option>Studio</option>
            <option>Villa</option>
            <option>Duplex</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
            Price / Night
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">
              ₦
            </span>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="25000"
              className="w-full border border-gray-200 rounded-xl pl-7 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
          Property Photo
        </label>
        <div
          onClick={() => router.push("/agent/listings/new")}
          className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-300 hover:bg-cyan-50/30 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="w-8 h-8 text-gray-300 mb-1"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
          <span className="text-xs text-gray-400">Click to upload image</span>
        </div>
      </div>

      <button
        onClick={handleCreate}
        disabled={!title.trim()}
        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors text-sm"
      >
        Create Listing
      </button>
    </div>
  );
}
