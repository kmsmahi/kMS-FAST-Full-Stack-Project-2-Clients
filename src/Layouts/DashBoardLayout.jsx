import { Outlet, NavLink, useNavigate } from 'react-router';
import { useState } from 'react';
import Logo from '../HomePage/Logo';
import UseAuth from '../Hooks/UseAuth';
import { motion, AnimatePresence } from 'framer-motion';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logOut } = UseAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <div className="min-h-screen flex bg-gray-50/50 font-sans antialiased text-gray-900">
      
      {/* Mobile Backdrop Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-xs z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 shadow-sm flex flex-col transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-gray-100">
          <NavLink
            to="/"
            className="flex items-center gap-3 group focus:outline-none rounded-xl p-1"
          >
            {/* <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 bg-gray-50 rounded-xl border border-gray-100 shadow-xs">
              <Logo />
            </div> */}

            <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Logo />
             </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-gray-900 leading-none -mb-4">
                KMS<span className="text-[#96b830]">-FAST</span>
              </span>
              <span className="text-[10px] uppercase tracking-wider font-semibold text-gray-400 mt-4">
                Logistics Portal
              </span>
            </div>
          </NavLink>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            Main Menu
          </div>

          <NavLink 
            to="/dashboard" 
            end 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-[#CAEB66] text-gray-900 shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </NavLink>

          <NavLink 
            to="/dashboard/send-parcel" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-[#CAEB66] text-gray-900 shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            Send Parcel
          </NavLink>

          <NavLink 
            to="/dashboard/my-parcels" 
            className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 ${isActive ? 'bg-[#CAEB66] text-gray-900 shadow-xs' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
          >
            <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            My Parcels
          </NavLink>

          <div className="pt-6 px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-gray-400">
            System
          </div>

          <NavLink 
            to="/" 
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
          >
            <svg className="w-5 h-5 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Return to Website
          </NavLink>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between gap-3 p-2 bg-white border border-gray-100 rounded-2xl shadow-xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#CAEB66]" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-[#CAEB66] text-gray-900 font-bold flex items-center justify-center text-xs shrink-0">
                  {userInitial}
                </div>
              )}
              <div className="flex flex-col truncate">
                <span className="text-xs font-bold text-gray-900 truncate">
                  {user?.displayName || 'Valued User'}
                </span>
                <span className="text-[11px] text-gray-500 truncate">
                  {user?.email || 'Logged In'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-72 flex flex-col min-h-screen">
        
        {/* Top Header Bar */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Toggle Navigation Sidebar"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">Customer Dashboard</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Manage your shipment deliveries and active parcel requests</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-[#CAEB66]/20 border border-[#CAEB66]/40 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#96b830] animate-pulse"></span>
              <span className="text-xs font-semibold text-gray-800">Live Tracking Active</span>
            </div>
          </div>
        </header>

        {/* Dynamic Outlet Body */}
        <main className="p-6 lg:p-10 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}