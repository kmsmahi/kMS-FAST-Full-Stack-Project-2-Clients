import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../HomePage/Logo';
 

const navItems = [
  { name: 'Home', path: '/home' },
  { name: 'Coverage', path: '/coverage' },
  { name: 'About Us', path: '/aboutus' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Be a Rider', path: '/bearider' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll shadow & background elevation
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0B0F19]/85 backdrop-blur-md border-b border-gray-800/60 shadow-lg shadow-black/10 py-3'
          : 'bg-[#0B0F19] border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo & Name */}
          <NavLink
            to="/home"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#CAEB66] rounded-lg p-1"
            aria-label="KMS-FAST Home"
          >
            <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
              <Logo></Logo>
            </div>
            <span className="text-xl font-bold tracking-tight text-white font-sans -ms-4 pt-3">
              KMS<span className="text-[#CAEB66]">-FAST</span>
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-900/60 border border-gray-800/80 px-3 py-1.5 rounded-full shadow-inner">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-[#CAEB66] ${
                    isActive
                      ? 'text-gray-900 bg-[#CAEB66] font-semibold shadow-sm'
                      : 'text-gray-300 hover:text-white hover:bg-gray-800/60'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Action Buttons (Sign In / Sign Up) */}
          <div className="hidden md:flex items-center gap-3">
            <NavLink
              to="/signin"
              className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#CAEB66] rounded-lg"
            >
              Sign In
            </NavLink>
            <NavLink
              to="/signup"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] transition-all duration-200 rounded-full shadow-md hover:shadow-[#CAEB66]/20 focus:outline-none focus:ring-2 focus:ring-[#CAEB66] focus:ring-offset-2 focus:ring-offset-[#0B0F19]"
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
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle navigation menu"
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/60 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
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
            className="md:hidden overflow-hidden bg-[#0B0F19] border-b border-gray-800 px-4 pt-4 pb-6 shadow-2xl"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'text-[#CAEB66] bg-gray-900/80 font-semibold border-l-4 border-[#CAEB66]'
                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              ))}
              
              <div className="border-t border-gray-800 my-3 pt-3 flex flex-col gap-2.5">
                <NavLink
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-3 text-sm font-medium text-gray-300 bg-gray-900/60 hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Sign In
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setIsOpen(false)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] rounded-xl transition-colors shadow-sm"
                >
                  <span>Sign Up</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M17 7H7M17 7v10" />
                  </svg>
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}