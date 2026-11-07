import { Outlet, NavLink } from 'react-router';
import { useState } from 'react';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center px-6 border-b border-gray-100 font-bold text-xl">
          KMS<span className="text-[#96b830]">-FAST Dashboard</span>
        </div>
        <nav className="p-4 space-y-1">
          <NavLink to="/dashboard" end className={({isActive}) => `block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'bg-[#CAEB66] text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
            Overview
          </NavLink>
          <NavLink to="/dashboard/my-parcels" className={({isActive}) => `block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'bg-[#CAEB66] text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
            My Parcels
          </NavLink>
          <NavLink to="/dashboard/send-parcel" className={({isActive}) => `block px-4 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'bg-[#CAEB66] text-gray-900 font-semibold' : 'text-gray-600 hover:bg-gray-100'}`}>
            Send Parcel
          </NavLink>
          <NavLink to="/" className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 mt-8">
            ← Back to Home
          </NavLink>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 lg:px-8 sticky top-0 z-40">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-gray-600">
            ☰
          </button>
          <span className="text-sm font-semibold text-gray-700">User Dashboard</span>
        </header>
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}