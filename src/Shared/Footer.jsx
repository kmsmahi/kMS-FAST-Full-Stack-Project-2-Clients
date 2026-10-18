import React from 'react';
import { Link } from 'react-router';
import Logo from '../HomePage/Logo';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0B0F19] text-gray-300 border-t border-gray-800/80 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-gray-800/80">
          
          {/* Brand & Mission (Spans 2 columns on large screens) */}
          <div className="lg:col-span-2 flex flex-col items-start gap-4">
            <Link to="/home" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#CAEB66] rounded-lg p-1">
              <div className="w-9 h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                <Logo />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-sans -ms-3 mt-2">
                KMS<span className="text-[#CAEB66]">-FAST</span>
              </span>
            </Link>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Providing reliable, ultra-fast parcel delivery and logistics management solutions. Connecting customers, riders, and administrators through a unified ecosystem since 2026.
            </p>

            <div className="flex items-center gap-3 text-xs text-gray-400 bg-gray-900/60 border border-gray-800 px-3 py-1.5 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All systems operational & deliveries active
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-white">Platform</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/home" className="hover:text-[#CAEB66] transition-colors duration-200">Home</Link>
              </li>
              <li>
                <Link to="/coverage" className="hover:text-[#CAEB66] transition-colors duration-200">Coverage Areas</Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-[#CAEB66] transition-colors duration-200">Pricing & Rates</Link>
              </li>
              <li>
                <Link to="/aboutus" className="hover:text-[#CAEB66] transition-colors duration-200">About Us</Link>
              </li>
            </ul>
          </div>

          {/* Careers & Partners */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-white">Join Us</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/bearider" className="hover:text-[#CAEB66] transition-colors duration-200">Be a Rider</Link>
              </li>
              <li>
                <Link to="/careers" className="hover:text-[#CAEB66] transition-colors duration-200">Carrier Partner</Link>
              </li>
              <li>
                <Link to="/support" className="hover:text-[#CAEB66] transition-colors duration-200">Help & Support</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-white">Legal</h3>
            <ul className="flex flex-col gap-2 text-sm">
              <li>
                <Link to="/privacy" className="hover:text-[#CAEB66] transition-colors duration-200">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#CAEB66] transition-colors duration-200">Terms of Service</Link>
              </li>
              <li>
                <Link to="/security" className="hover:text-[#CAEB66] transition-colors duration-200">Security Disclosures</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Social Icons */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500 text-center sm:text-left">
            © {currentYear} KMS-FAST Ltd. All rights reserved. Built for high-performance logistics.
          </p>

          {/* Social Media Links */}
          <div className="flex items-center gap-4">
            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-900 hover:bg-[#CAEB66] transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg>
            </a>

            {/* YouTube */}
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-900 hover:bg-[#CAEB66] transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-900 border border-gray-800 text-gray-400 hover:text-gray-900 hover:bg-[#CAEB66] transition-all duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}