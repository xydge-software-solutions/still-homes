"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

// Luxury Apartment Images for Slideshow
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1613545325278-f24b0cae1224?q=80&w=2600&auto=format&fit=crop"
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function Calendar({ 
  value, 
  onChange, 
  minDate, 
  maxDate,
  label 
}: { 
  value: Date | null, 
  onChange: (date: Date) => void, 
  minDate?: Date, 
  maxDate?: Date
  label: string
}) {
  const [currentDate, setCurrentDate] = useState(value || new Date());
  
  // Sync internal calendar view when value changes externally
  useEffect(() => {
    if (value) setCurrentDate(value);
  }, [value]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const newDate = new Date(year, month, day);
    onChange(newDate);
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    return value && day === value.getDate() && month === value.getMonth() && year === value.getFullYear();
  };

  const isDisabled = (day: number) => {
    const date = new Date(year, month, day);
    if (minDate && date < new Date(minDate.setHours(0,0,0,0))) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  return (
    <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm w-[300px]">
      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{label}</p>
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="font-semibold text-gray-900">
          {MONTH_NAMES[month]} {year}
        </div>
        <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-900 transition-colors">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {DAYS.map(d => <div key={d} className="text-xs font-bold text-gray-400 py-1">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const disabled = isDisabled(day);
          const selected = isSelected(day);
          
          return (
            <button
              key={day}
              onClick={() => !disabled && handleDateClick(day)}
              disabled={disabled}
              className={`
                w-8 h-8 rounded-full text-sm font-medium flex items-center justify-center transition-all
                ${selected ? 'bg-cyan-500 text-white shadow-md shadow-cyan-200' : ''}
                ${!selected && !disabled ? 'hover:bg-cyan-50 text-gray-700 hover:text-cyan-600' : ''}
                ${disabled ? 'text-gray-300 cursor-not-allowed' : ''}
                ${isToday(day) && !selected ? 'ring-1 ring-cyan-500 text-cyan-500' : ''}
              `}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const FEATURED_LISTINGS = [
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

function FeaturedListingCard({ listing }: { listing: typeof FEATURED_LISTINGS[0] }) {
  return (
    <div className="min-w-[300px] w-[300px] md:min-w-[350px] md:w-[350px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group snap-start">
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

export default function LandingPage() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  
  // Search State
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [activeCity, setActiveCity] = useState("Lagos");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 350 + 24; // Card width + gap
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  // Mount animation
  useEffect(() => {
    setMounted(true);
  }, []);

  // Slideshow Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Close Datepicker on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatDate = (date: Date | null) => {
    if (!date) return "";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const smartDateDisplay = () => {
    if (checkIn && checkOut) return `${formatDate(checkIn)} - ${formatDate(checkOut)}`;
    if (checkIn) return `${formatDate(checkIn)} - Check out`;
    return "";
  };

  // Today's date normalized
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className={`min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900 ${mounted ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}>
      
      {/* ─── Navbar ───────────────────────────────────────────────────────────────── */}
      <nav className="fixed w-full z-50 bg-white/10 backdrop-blur-md border-b border-white/10 transition-colors duration-300 hover:bg-white/90 group/nav">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-linear-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/30 transition-all duration-300">
              <svg viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="font-bold text-white text-xl tracking-tight [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] group-hover/nav:text-gray-900 group-hover/nav:[text-shadow:none] transition-all">
              Still Homes
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/stays" className="text-sm font-medium text-white/90 hover:text-white transition-colors [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] group-hover/nav:text-gray-600 group-hover/nav:hover:text-gray-900 group-hover/nav:[text-shadow:none]">Find Stays</Link>
            <Link href="/features" className="text-sm font-medium text-white/90 hover:text-white transition-colors [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] group-hover/nav:text-gray-600 group-hover/nav:hover:text-gray-900 group-hover/nav:[text-shadow:none]">Features</Link>
            <Link href="/about" className="text-sm font-medium text-white/90 hover:text-white transition-colors [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] group-hover/nav:text-gray-600 group-hover/nav:hover:text-gray-900 group-hover/nav:[text-shadow:none]">About Us</Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden md:block text-sm font-semibold text-white hover:text-cyan-200 transition-colors [text-shadow:_0_1px_2px_rgb(0_0_0_/_20%)] group-hover/nav:text-gray-600 group-hover/nav:hover:text-gray-900 group-hover/nav:[text-shadow:none]">Sign in</Link>
            <Link href="/register" className="px-5 py-2.5 bg-white hover:bg-cyan-50 text-gray-900 text-sm font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group-hover/nav:bg-gray-900 group-hover/nav:text-white group-hover/nav:hover:bg-black">
              Join as Agent
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-20 lg:pb-32">
        
        {/* Slideshow Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gray-900/40 z-10" /> {/* Overlay for readability */}
          {HERO_IMAGES.map((img, index) => (
            <div
              key={index}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
              style={{ backgroundImage: `url('${img}')` }}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
            Discover Premium Shortlets
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1] [text-shadow:_0_4px_12px_rgb(0_0_0_/_40%)]">
            Experience comfort, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-200 to-white">
              redefined daily.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/90 leading-relaxed mb-12 [text-shadow:_0_2px_4px_rgb(0_0_0_/_30%)]">
            Find the perfect stay for your next trip. To luxury villas, <br/>experience verified comfort across Nigeria.
          </p>

          {/* Search Bar Container */}
          <div className="relative max-w-3xl mx-auto z-50" ref={datePickerRef}>
            <div className={`bg-white p-2 rounded-2xl shadow-2xl transition-all duration-300 flex flex-col md:flex-row items-center gap-2 ${showDatePicker ? 'rounded-b-none md:rounded-b-none' : ''}`}>
              
              {/* Location Input */}
              <div className="flex-1 w-full px-4 py-3 md:py-4 flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-100">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div className="text-left w-full">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Location</p>
                  <input 
                    type="text" 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Where to?" 
                    className="w-full text-gray-900 placeholder:text-gray-400 font-medium focus:outline-none bg-transparent"
                  />
                </div>
              </div>
              
              {/* Date Input Box */}
              <div 
                className="flex-1 w-full px-4 py-3 md:py-4 flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <div className="text-left w-full select-none">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Check in - Out</p>
                  <p className={`font-medium ${smartDateDisplay() ? 'text-gray-900' : 'text-gray-400'}`}>
                    {smartDateDisplay() || "Add dates"}
                  </p>
                </div>
              </div>

              <button className="w-full md:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Search
              </button>
            </div>

            {/* Date Pickers Popover */}
            {showDatePicker && (
               <div className="absolute top-full left-0 right-0 bg-white rounded-b-2xl md:rounded-2xl border-t md:border-t-0 md:mt-2 p-6 shadow-2xl flex flex-col md:flex-row items-start justify-center gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                 <div className="flex flex-col md:flex-row gap-6 mx-auto">
                   <Calendar 
                      label="Check In" 
                      value={checkIn} 
                      onChange={(date) => {
                        setCheckIn(date);
                        // Auto clear checkout if it's before new checkin
                        if (checkOut && date > checkOut) setCheckOut(null);
                      }}
                      minDate={today}
                   />
                   <div className="w-[1px] bg-gray-100 hidden md:block" />
                   <Calendar 
                      label="Check Out" 
                      value={checkOut} 
                      onChange={(date) => {
                        setCheckOut(date);
                        setShowDatePicker(false); // Auto close mostly
                      }}
                      minDate={checkIn || today}
                   />
                 </div>
               </div>
            )}
          </div>
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-white/60">
            {["Lagos", "Abuja", "Port Harcourt", "Lekki", "Ikeja"].map(city => (
              <span key={city} className="text-sm font-semibold uppercase tracking-wider hover:text-white transition-colors cursor-pointer">{city}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Listings ──────────────────────────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-cyan-600 font-bold text-sm tracking-widest uppercase mb-2 block">Premium Stays</span>
              <h2 className="text-4xl font-bold text-gray-900 tracking-tight">Featured Listings</h2>
            </div>
            
            <div className="flex items-center gap-4">
              {/* City Tabs */}
              <div className="flex p-1 bg-gray-100 rounded-xl">
                {["Lagos", "Abuja", "Port Harcourt"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setActiveCity(city)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-bold transition-all ${
                      activeCity === city 
                        ? "bg-white text-gray-900 shadow-sm" 
                        : "text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>

               {/* Carousel Arrows */}
               <div className="hidden md:flex items-center gap-2">
                <button 
                  onClick={() => scroll('left')}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 hover:border-gray-300 transition-all text-gray-600"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                    <path d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button 
                  onClick={() => scroll('right')}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-900 hover:text-white hover:border-gray-900 transition-all text-gray-600"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Carousel */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0"
          >
            {FEATURED_LISTINGS
              .filter(l => l.city === activeCity)
              .map((listing) => (
                <FeaturedListingCard key={listing.id} listing={listing} />
              ))}
            
            {/* See All Card */}
            <Link href="/stays" className="min-w-[300px] w-[300px] md:min-w-[350px] md:w-[350px] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-cyan-500 hover:bg-cyan-50/50 transition-all duration-300 group flex flex-col items-center justify-center snap-start cursor-pointer relative overflow-hidden">
               <div className="absolute inset-0 bg-[radial-gradient(#22d3ee_1px,transparent_1px)] [background-size:16px_16px] opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
               
               <div className="w-20 h-20 bg-white rounded-full shadow-lg shadow-gray-100 flex items-center justify-center mb-6 z-10 group-hover:scale-110 transition-transform duration-300">
                 <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-8 h-8 text-cyan-500">
                   <path d="M5 12h14M12 5l7 7-7 7" />
                 </svg>
               </div>
               
               <h3 className="text-xl font-bold text-gray-900 mb-2 z-10">See All Stays</h3>
               <p className="text-gray-500 text-sm z-10">Explore 50+ listings in {activeCity}</p>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Features Grid ────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Verified Excellence",
                desc: "Every home is personally verified by our team to ensure the highest standards.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                ),
                color: "text-emerald-500 bg-emerald-50"
              },
              {
                title: "Secure Bookings",
                desc: "Book with confidence using our secure payment protection and fraud prevention.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                ),
                color: "text-blue-500 bg-blue-50"
              },
              {
                title: "24/7 Support",
                desc: "Our dedicated support team is always available to help before, during, and after your stay.",
                icon: (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                ),
                color: "text-amber-500 bg-amber-50"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-xl hover:shadow-gray-200/40 transition-all duration-300 group">
                <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-7 h-7">
                    {feature.icon}
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ──────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative rounded-[2.5rem] overflow-hidden bg-gray-900 text-center py-20 px-6">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600596542815-e32c2159f8d5?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Are you a Property Owner?
              </h2>
              <p className="text-lg text-gray-400 mb-10 leading-relaxed">
                Join hundreds of agents and homeowners earning more with Still Homes. 
                Get powerful tools to manage your listings and bookings seamlessly.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link 
                  href="/register" 
                  className="w-full sm:w-auto px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-gray-900 font-bold rounded-xl transition-all transform hover:-translate-y-1 block sm:inline-block"
                >
                  Become an Agent
                </Link>
                <Link 
                  href="/login" 
                  className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl backdrop-blur-sm transition-all border border-white/10 block sm:inline-block"
                >
                  Agent Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Footer ─────────────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">
              Still Homes
            </span>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-8 text-sm font-medium text-gray-500">
            <Link href="/" className="hover:text-gray-900">Privacy Policy</Link>
            <Link href="/" className="hover:text-gray-900">Terms of Service</Link>
            <Link href="/" className="hover:text-gray-900">Support</Link>
          </div>
          
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Still Homes. All rights reserved.
          </p>
        </div>
      </footer>
    
    </div>
  );
}
