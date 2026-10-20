import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../HomePage/Logo';
import UseAuth from '../Hooks/UseAuth';
import { useForm } from 'react-hook-form';

const allNavItems = [
  { name: 'Home', path: '/' },
  { name: 'Coverage', path: '/coverage' },
  { name: 'About Us', path: '/aboutus' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Be a Rider', path: '/bearider' },
];

export default function Navbar() {
  const { user, logOut, updateUserProfile } = UseAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Profile Modal State & Form
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const { register, handleSubmit, reset } = useForm();

  // Filter nav items based on user authentication status
  // If user is not logged in, show only the first 3 items. If logged in, show all.
  const navItems = user ? allNavItems : allNavItems.slice(0, 3);

  // Handle scroll shadow & background elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu or modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setIsProfileModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logOut()
      .then(() => {
        setIsOpen(false);
        setIsProfileModalOpen(false);
      })
      .catch((error) => console.error('Logout error:', error));
  };

  // Helper function to upload image to ImgBB
  const uploadImageToImgBB = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
    const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

    const response = await fetch(url, { method: 'POST', body: formData });
    const data = await response.json();
    if (data.success) {
      return data.data.url;
    } else {
      throw new Error('Failed to upload image');
    }
  };

  // Handle Profile Update Submission
  const handleProfileUpdate = async (data) => {
    setUpdating(true);
    setUpdateError('');
    try {
      let photoURL = user?.photoURL || '';

      if (data.photo && data.photo[0]) {
        photoURL = await uploadImageToImgBB(data.photo[0]);
      }

      const displayName = data.name || user?.displayName;
      await updateUserProfile(displayName, photoURL);

      setIsProfileModalOpen(false);
      reset();
    } catch (err) {
      console.error(err);
      setUpdateError(err.message || 'Failed to update profile.');
    } finally {
      setUpdating(false);
    }
  };

  // Extract first letter of display name or email for avatar fallback
  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : 'U';

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/90 backdrop-blur-md py-3 shadow-sm border-b border-gray-100'
            : 'bg-white py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* Brand Logo & Name */}
            <NavLink
              to="/aboutus"
              className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#CAEB66] rounded-lg p-1"
              aria-label="KMS-FAST Home"
            >
              <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Logo />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900 font-sans -ms-4 pt-3">
                KMS<span className="text-[#96b830] font-extrabold">-FAST</span>
              </span>
            </NavLink>

            {/* Desktop Navigation Links (Dynamically filtered) */}
            <nav className="hidden md:flex items-center gap-1 bg-gray-50 border border-gray-200/70 px-3 py-1.5 rounded-full shadow-inner">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#CAEB66] ${
                      isActive
                        ? 'text-gray-900 bg-[#CAEB66] font-semibold shadow-sm'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            {/* Action Buttons / User Auth Section (Desktop) */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="flex items-center gap-3">
                  {/* Clickable User Info Badge for Profile Update */}
                  <button
                    onClick={() => setIsProfileModalOpen(true)}
                    title="Click to update profile"
                    className="flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-full pl-1.5 pr-3.5 py-1 transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                  >
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName || 'User Avatar'}
                        className="w-8 h-8 rounded-full object-cover ring-2 ring-[#CAEB66] group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-[#CAEB66] text-gray-900 font-bold flex items-center justify-center text-sm ring-2 ring-[#CAEB66]/50 group-hover:scale-105 transition-transform">
                        {userInitial}
                      </div>
                    )}
                    <span className="text-xs font-semibold text-gray-800 max-w-[120px] truncate group-hover:text-gray-900">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </button>

                  {/* Logout Button */}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-full transition-all duration-200 border border-red-100 cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] transition-all duration-200 rounded-full shadow-md hover:shadow-[#CAEB66]/30 focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:ring-offset-2 focus:ring-offset-white"
                  >
                    Sign In
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] transition-all duration-200 rounded-full shadow-md hover:shadow-[#CAEB66]/30 focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:ring-offset-2 focus:ring-offset-white"
                  >
                    <span>Sign Up</span>
                    <svg
                      className="w-4 h-4 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                    </svg>
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                aria-expanded={isOpen}
                aria-controls="mobile-menu"
                aria-label="Toggle navigation menu"
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Drawer / Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden bg-white border-b border-gray-200 px-4 pt-4 pb-6 shadow-xl"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `px-4 py-2 rounded-xl text-base font-medium transition-colors ${
                        isActive
                          ? 'text-gray-900 bg-[#CAEB66]/30 font-semibold border-l-4 border-[#CAEB66]'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                
                <div className="border-t border-gray-100 my-3 pt-3 flex flex-col gap-2.5">
                  {user ? (
                    <>
                      {/* Clickable Mobile User Profile Row */}
                      <button
                        onClick={() => {
                          setIsOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left w-full cursor-pointer"
                      >
                        {user.photoURL ? (
                          <img
                            src={user.photoURL}
                            alt={user.displayName || 'User Avatar'}
                            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#CAEB66]"
                          />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#CAEB66] text-gray-900 font-bold flex items-center justify-center text-sm">
                            {userInitial}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {user.displayName || 'User'}
                          </span>
                          <span className="text-xs text-gray-500 truncate max-w-[200px]">
                            Tap to update profile
                          </span>
                        </div>
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full text-center px-4 py-3 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to="/login"
                        onClick={() => setIsOpen(false)}
                        className="w-full text-center px-4 py-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
                      >
                        Sign In
                      </NavLink>
                      <NavLink
                        to="/register"
                        onClick={() => setIsOpen(false)}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] rounded-xl transition-colors shadow-sm"
                      >
                        <span>Sign Up</span>
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                        </svg>
                      </NavLink>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* --- PROFILE UPDATE MODAL --- */}
      <AnimatePresence>
        {isProfileModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-2xl font-bold text-gray-900 mb-1">Update Profile</h2>
              <p className="text-xs text-gray-500 mb-6">Modify your display name or profile picture below</p>

              {updateError && (
                <div className="p-3 mb-4 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                  {updateError}
                </div>
              )}

              <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.displayName || ''}
                    {...register('name')}
                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                    placeholder="Enter your name"
                  />
                </div>

                {/* Photo File Input */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">New Profile Picture</label>
                  <input
                    type="file"
                    accept="image/*"
                    {...register('photo')}
                    className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#CAEB66] file:text-gray-900 hover:file:bg-[#b8d655] cursor-pointer bg-gray-50 border border-gray-200 rounded-2xl"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsProfileModalOpen(false)}
                    className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-2xl transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-6 py-2.5 text-xs font-bold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] rounded-2xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}