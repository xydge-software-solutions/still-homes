"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import { LISTINGS } from "@/lib/data";

export default function ListingDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [listing, setListing] = useState<typeof LISTINGS[0] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [guests, setGuests] = useState(1);
  const [checkIn, setCheckIn] = useState<string>("");
  const [checkOut, setCheckOut] = useState<string>("");

  useEffect(() => {
    if (resolvedParams.id) {
        const found = LISTINGS.find(l => l.id === parseInt(resolvedParams.id));
        if (found) {
            setListing(found);
        } else {
            router.push("/404");
        }
        setLoading(false);
    }
  }, [resolvedParams.id, router]);

  if (loading || !listing) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
        </div>
    );
  }

  const totalNights = checkIn && checkOut 
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
    
  // Fee calculation (dummy)
  const serviceFee = Math.round(listing.price * totalNights * 0.1); 
  const cleaningFee = 15000;
  const total = (listing.price * totalNights) + serviceFee + cleaningFee;

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900">
      
      {/* ─── Navbar ───────────────────────────────────────────────────────────────── */}
      <nav className="fixed w-full z-50 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-xl tracking-tight">
              Still Homes
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/stays" className="text-sm font-medium text-cyan-600">Find Stays</Link>
            <Link href="/features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">Features</Link>
          </div>

          <div className="flex items-center gap-4">
             <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
             <Link href="/register" className="px-5 py-2.5 bg-gray-900 text-white hover:bg-black text-sm font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
               Join as Agent
             </Link>
          </div>
        </div>
      </nav>

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-6">
        
        {/* Title & Location */}
        <div className="mb-6">
           <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{listing.title}</h1>
           <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1 font-semibold text-gray-900">
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                {listing.rating}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="underline cursor-pointer hover:text-gray-900 font-medium">128 reviews</span>
              <span className="w-1 h-1 bg-gray-300 rounded-full" />
              <span className="flex items-center gap-1">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                </svg>
                {listing.location}
              </span>
           </div>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-12 relative group">
            <div className="md:col-span-2 h-full relative">
                <img src={listing.images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setSelectedImage(0)} alt="Main view" />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                 <img src={listing.images[1] || listing.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setSelectedImage(1)} alt="Detail view 1" />
                 <img src={listing.images[2] || listing.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setSelectedImage(2)} alt="Detail view 2" />
            </div>
            <div className="hidden md:grid grid-rows-2 gap-2 h-full">
                 <img src={listing.images[3] || listing.image} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer" onClick={() => setSelectedImage(3)} alt="Detail view 3" />
                 <div className="relative h-full overflow-hidden cursor-pointer">
                    <img src={listing.images[0]} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 brightness-50" alt="View all" />
                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg underline">
                        Show all photos
                    </div>
                 </div>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-2 space-y-10">
                
                {/* Host Info */}
                <div className="flex items-center justify-between pb-8 border-b border-gray-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Hosted by {listing.host.name}</h2>
                        <p className="text-gray-500 text-sm">
                            {listing.maxGuests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} baths
                        </p>
                    </div>
                    <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden border-2 border-white shadow-md">
                        {listing.host.image 
                         ? <img src={listing.host.image} className="w-full h-full object-cover" alt={listing.host.name} />
                         : <div className="w-full h-full flex items-center justify-center bg-cyan-100 text-cyan-600 font-bold text-xl">{listing.host.name[0]}</div>
                        }
                    </div>
                </div>

                {/* Key Features */}
                <div className="space-y-6 pb-8 border-b border-gray-100">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan-50 text-cyan-600 flex items-center justify-center shrink-0">
                           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Verified Listing</h3>
                            <p className="text-gray-500 text-sm">This home has been personally verified for quality and comfort.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                           <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Great for Work</h3>
                            <p className="text-gray-500 text-sm">Fast wifi and dedicated workspace perfect for remote work.</p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="pb-8 border-b border-gray-100">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">About this place</h2>
                    <p className="text-gray-600 leading-relaxed">
                        {listing.description}
                    </p>
                </div>

                {/* Amenities */}
                <div>
                   <h2 className="text-2xl font-bold text-gray-900 mb-6">What this place offers</h2>
                   <div className="grid grid-cols-2 gap-4">
                      {listing.amenities.map(amenity => (
                        <div key={amenity} className="flex items-center gap-3 text-gray-600">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
                                <path d="M5 13l4 4L19 7" />
                            </svg>
                            {amenity}
                        </div>
                      ))}
                   </div>
                </div>

            </div>

             {/* Right Column: Booking Card */}
            <div className="lg:col-span-1 relative">
                <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
                    
                    <div className="flex items-center justify-between mb-6">
                        <div>
                             <span className="text-2xl font-bold text-gray-900">₦{listing.price.toLocaleString()}</span>
                             <span className="text-gray-500 text-sm"> / night</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
                             <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-yellow-400">
                              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                             </svg>
                             {listing.rating}
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl mb-4 overflow-hidden">
                        <div className="flex border-b border-gray-200">
                            <div className="flex-1 p-3 border-r border-gray-200">
                                <label className="block text-xs font-bold text-gray-700 uppercase">Check-in</label>
                                <input 
                                    type="date" 
                                    className="w-full text-sm outline-none text-gray-600 cursor-pointer" 
                                    onChange={(e) => setCheckIn(e.target.value)}
                                />
                            </div>
                            <div className="flex-1 p-3">
                                <label className="block text-xs font-bold text-gray-700 uppercase">Checkout</label>
                                <input 
                                    type="date" 
                                    className="w-full text-sm outline-none text-gray-600 cursor-pointer"
                                    onChange={(e) => setCheckOut(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="p-3">
                            <label className="block text-xs font-bold text-gray-700 uppercase">Guests</label>
                            <select 
                                value={guests} 
                                onChange={(e) => setGuests(parseInt(e.target.value))}
                                className="w-full text-sm outline-none text-gray-600 bg-transparent py-1"
                            >
                                {[...Array(listing.maxGuests)].map((_, i) => (
                                    <option key={i} value={i+1}>{i+1} guest{(i+1) > 1 ? 's' : ''}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <button className="w-full py-3.5 bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/25 mb-4">
                        Reserve
                    </button>
                    
                    <p className="text-center text-xs text-gray-500 mb-6">You won't be charged yet</p>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex justify-between">
                            <span className="underline">₦{listing.price.toLocaleString()} x {totalNights} nights</span>
                            <span>₦{(listing.price * totalNights).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Cleaning fee</span>
                            <span>₦{cleaningFee.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="underline">Service fee</span>
                            <span>₦{serviceFee.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between font-bold text-gray-900 text-lg">
                        <span>Total</span>
                        <span>₦{total.toLocaleString()}</span>
                    </div>

                </div>
            </div>

        </div>

      </main>
    </div>
  );
}