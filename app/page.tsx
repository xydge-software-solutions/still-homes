"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-cyan-100 selection:text-cyan-900 animate-in fade-in duration-700">
      
      {/* ─── Navbar ───────────────────────────────────────────────────────────────── */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/stays" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Find Stays
            </Link>
            <Link href="/features" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="/about" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
              About Us
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              href="/login" 
              className="hidden md:block text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              Sign in
            </Link>
            <Link 
              href="/register" 
              className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-semibold rounded-full transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              Join as Agent
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-cyan-200/20 rounded-full blur-[100px] -z-10" />
        <div className="absolute top-40 right-0 w-200 h-150 bg-blue-100/30 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-50 border border-cyan-100 text-cyan-700 text-xs font-bold uppercase tracking-wider mb-8 animate-fade-in-up">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
            Discover Premium Shortlets
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-[1.1]">
            Experience comfort, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-500 to-blue-600">
              redefined daily.
            </span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 leading-relaxed mb-12">
            Find the perfect stay for your next trip. From cozy apartments 
            to luxury villas, experience verified comfort across Nigeria.
          </p>

          {/* Search Mockup */}
          <div className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row items-center gap-2">
            <div className="flex-1 w-full px-4 py-3 md:py-4 flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div className="text-left w-full">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">Location</p>
                <input 
                  type="text" 
                  placeholder="Where do you want to go?" 
                  className="w-full text-gray-900 placeholder:text-gray-400 font-medium focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex-1 w-full px-4 py-3 md:py-4 flex items-center gap-3 border-b md:border-b-0 md:border-r border-gray-100">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5 text-gray-400">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div className="text-left w-full">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">When</p>
                <input 
                  type="text" 
                  placeholder="Add dates" 
                  className="w-full text-gray-900 placeholder:text-gray-400 font-medium focus:outline-none"
                />
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
          
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-gray-400 grayscale opacity-70">
            {["Lagos", "Abuja", "Port Harcourt", "Lekki", "Ikeja"].map(city => (
              <span key={city} className="text-sm font-semibold uppercase tracking-wider hover:text-cyan-500 hover:grayscale-0 transition-colors cursor-pointer">{city}</span>
            ))}
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
