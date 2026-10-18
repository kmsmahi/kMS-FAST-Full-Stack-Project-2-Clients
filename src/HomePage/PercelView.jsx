import React from 'react';
import img1 from '../assets/allLogos/live-tracking.png';
import img2 from '../assets/allLogos/safe-delivery.png';

const features = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description: "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey with complete peace of mind.",
    icon: img1,
    tag: "Real-Time Updates"
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description: "We ensure your parcels are handled with care and delivered securely. Our reliable process guarantees safe and damage-free delivery every time.",
    icon: img2,
    tag: "Guaranteed Safety"
  },
  {
    id: 3,
    title: "24/7 Support Service",
    description: "Our dedicated support team is available around the clock to assist you with any questions, status updates, or delivery concerns—anytime you need us.",
    icon: img2, // Replace with your call center icon if available
    tag: "Always Active"
  }
];

export default function ParcelView() {
  return (
    <section className="bg-slate-50/80 py-16 sm:py-24 border-b border-gray-200/60 relative overflow-hidden">
      
      {/* Decorative ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-800 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#96b830] animate-pulse"></span>
            Why Choose KMS-FAST
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-sans">
            Core Delivery Assurance
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Engineered with modern tracking technology and round-the-clock reliability for every parcel.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-200 hover:border-[#CAEB66] rounded-3xl p-6 sm:p-7 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Row: Icon Container + Vertical Divider + Tag */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    {/* Icon Box */}
                    <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-3 shadow-inner group-hover:bg-[#CAEB66]/20 group-hover:border-[#CAEB66] transition-colors duration-300">
                      <img 
                        src={item.icon} 
                        alt={item.title} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" 
                      />
                    </div>

                    {/* Vertical Divider Line */}
                    <div className="w-[1px] h-10 bg-gray-200 group-hover:bg-[#CAEB66] transition-colors"></div>
                  </div>

                  {/* Badge Tag */}
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 group-hover:bg-[#CAEB66] group-hover:text-gray-900 group-hover:border-[#CAEB66] transition-colors">
                    {item.tag}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-sans tracking-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Bottom Subtle Highlight Line */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-400 group-hover:text-gray-900 transition-colors">
                <span>Verified Service</span>
                <span className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-[#CAEB66] transition-colors"></span>
              </div>

              {/* Hover Edge Accent */}
              <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-transparent group-hover:bg-[#CAEB66] transition-all rounded-r-full"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}