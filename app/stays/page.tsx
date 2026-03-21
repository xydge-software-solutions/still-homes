"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const ALL_LISTINGS = [
  // Lagos Listings
  { id: 1, city: "Lagos", title: "Luxury Ocean View", location: "Victoria Island, Lagos", price: 150000, rating: 4.9, image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=800&auto=format&fit=crop" },
  { id: 2, city: "Lagos", title: "Modern Duplex", location: "Lekki Phase 1, Lagos", price: 120000, rating: 4.8, image: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=800&auto=format&fit=crop" },
  { id: 3, city: "Lagos", title: "Cozy Studio", location: "Ikoyi, Lagos", price: 85000, rating: 4.7, image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=800&auto=format&fit=crop" },
  { id: 4, city: "Lagos", title: "The Palms Villa", location: "Ajah, Lagos", price: 95000, rating: 4.6, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
  { id: 5, city: "Lagos", title: "Skyline Apartment", location: "Eko Atlantic, Lagos", price: 200000, rating: 5.0, image: "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=800&auto=format&fit=crop" },
  { id: 6, city: "Lagos", title: "Minimalist Haven", location: "Yaba, Lagos", price: 60000, rating: 4.5, image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=800&auto=format&fit=crop" },

  // Abuja Listings
  { id: 7, city: "Abuja", title: "Presidential Suite", location: "Maitama, Abuja", price: 250000, rating: 5.0, image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop" },
  { id: 9, city: "Abuja", title: "Family Home", location: "Wuse II, Abuja", price: 90000, rating: 4.6, image: "https://images.unsplash.com/photo-1600596542815-e32c2159f8d5?q=80&w=800&auto=format&fit=crop" },
  { id: 10, city: "Abuja", title: "Hilltop Villa", location: "Asokoro, Abuja", price: 300000, rating: 4.9, image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?q=80&w=800&auto=format&fit=crop" },
  { id: 11, city: "Abuja", title: "Urban Loft", location: "Gwarinpa, Abuja", price: 70000, rating: 4.4, image: "https://images.unsplash.com/photo-1484154218962-a1c002085d2f?q=80&w=800&auto=format&fit=crop" },
  { id: 12, city: "Abuja", title: "Green Estate", location: "Jabi, Abuja", price: 110000, rating: 4.7, image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800&auto=format&fit=crop" },
  { id: 13, city: "Abuja", title: "Diplomatic Residence", location: "Central Area, Abuja", price: 180000, rating: 4.8, image: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=800&auto=format&fit=crop" },

  // Port Harcourt Listings
  { id: 14, city: "Port Harcourt", title: "Garden Estate", location: "GRA, Port Harcourt", price: 75000, rating: 4.5, image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800&auto=format&fit=crop" },
  { id: 15, city: "Port Harcourt", title: "Oil City Suites", location: "Old GRA, PH", price: 95000, rating: 4.6, image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format&fit=crop" },
  { id: 16, city: "Port Harcourt", title: "Executive Flat", location: "Peter Odili Rd, PH", price: 65000, rating: 4.3, image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800&auto=format&fit=crop" },
  { id: 17, city: "Port Harcourt", title: "Riverside Mansion", location: "Eagle Island, PH", price: 130000, rating: 4.7, image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=800&auto=format&fit=crop" },
  { id: 18, city: "Port Harcourt", title: "Cozy Bungalow", location: "Rumuola, PH", price: 50000, rating: 4.2, image: "https://images.unsplash.com/photo-1510627489930-0c1b0dc58e85?q=80&w=800&auto=format&fit=crop" },
  { id: 19, city: "Port Harcourt", title: "Modern Studio", location: "Ada George, PH", price: 45000, rating: 4.1, image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?q=80&w=800&auto=format&fit=crop" },
];

function ListingCard({ listing }: { listing: typeof ALL_LISTINGS[0] }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className="relative h-64 overflow-hidden">
        <div className="absolute top-3 right-3 z-10 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-red-500 transition-colors cursor-pointer">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </div>
        <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute bottom-3 left-3 bg-gray-900/80 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-yellow-400">
            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
          </svg>
          {listing.rating}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-gray-900 text-lg mb-1">{listing.title}</h3>
        <div className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {listing.location}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div>
            <span className="font-bold text-gray-900 text-lg">₦{listing.price.toLocaleString()}</span>
            <span className="text-gray-400 text-sm"> / night</span>
          </div>
          <button className="px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-lg hover:bg-cyan-500 transition-colors">
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

export default function StaysPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredListings = activeFilter === "All" 
    ? ALL_LISTINGS 
    : ALL_LISTINGS.filter(l => l.city === activeFilter);

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900">
      
      {/* ─── Navbar (Solid Background for this page) ────────────────────────────────── */}
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
            <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors">Sign in</Link>
            <Link href="/register" className="px-5 py-2.5 bg-gray-900 text-white hover:bg-black text-sm font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
              Join as Agent
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Main Content ─────────────────────────────────────────────────────────── */}
      <main className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
           <div>
             <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">Explore Our Stays</h1>
             <p className="text-gray-500 max-w-xl">Find your perfect getaway from our curated selection of verified homes, apartments, and luxury villas across Nigeria.</p>
           </div>
           
           {/* Filters */}
           <div className="flex p-1 bg-gray-100 rounded-xl overflow-x-auto max-w-full">
            {["All", "Lagos", "Abuja", "Port Harcourt"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${
                  activeFilter === filter 
                    ? "bg-white text-gray-900 shadow-sm" 
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        
        {/* Empty State */}
        {filteredListings.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-gray-400">
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No listings found</h3>
            <p className="text-gray-500">Try changing your filters or check back later.</p>
          </div>
        )}

      </main>

    </div>
  );
}