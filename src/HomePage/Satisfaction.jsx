import React from 'react';
import img1 from '../assets/allLogos/location-merchant.png';

const Satisfaction = () => {
  return (
    <section className="bg-[#03373D] py-20 sm:py-28 relative overflow-hidden">
      
      {/* Subtle background glow element for depth */}
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-[400px] h-[400px] bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          
          {/* Left / Top Side: Illustration */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative p-2 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm shadow-2xl">
              <img
                src={img1}
                alt="Merchant and Customer Satisfaction"
                className="w-full max-w-md h-auto object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* Right / Bottom Side: Content & Actions */}
          <div className="w-full lg:w-1/2 text-left">
            
            {/* Section Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#CAEB66] mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#CAEB66] animate-pulse"></span>
              Our Core Commitment
            </div>

            {/* Main Heading */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight font-sans">
              Merchant and Customer Satisfaction is Our First Priority
            </h2>

            {/* Description */}
            <p className="mt-4 text-sm sm:text-base text-gray-300 leading-relaxed">
              We offer the lowest delivery charge with the highest value along with 100% safety of your product. KMS-FAST delivers your parcels in every corner of Bangladesh right on time.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button className="px-6 py-3.5 rounded-xl text-sm font-bold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]">
                Become a Merchant
              </button>
              <button className="px-6 py-3.5 rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300 shadow-sm hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white">
                Earn with KMS-FAST
              </button>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default Satisfaction;