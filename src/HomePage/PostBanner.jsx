import React from 'react';
import bookingIcon from '../assets/allLogos/bookingIcon.png';

const steps = [
  {
    step: "01",
    title: "Book Pick & Drop",
    description: "Easily schedule your parcel pickup and specify delivery details in just a few clicks.",
    icon: bookingIcon,
  },
  {
    step: "02",
    title: "Cash on Delivery",
    description: "Secure collection and handling of payments upon successful delivery to your recipients.",
    icon: bookingIcon,
  },
  {
    step: "03",
    title: "Delivery Hub",
    description: "Real-time sorting and dispatch managed efficiently across our advanced logistics hubs.",
    icon: bookingIcon,
  },
  {
    step: "04",
    title: "SME & Corporate",
    description: "Tailored volume shipping solutions designed to scale business and enterprise operations.",
    icon: bookingIcon,
  },
];

export default function PostBanner() {
  return (
    <section className="bg-[#0B0F19] py-20 border-b border-gray-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900 border border-gray-800 text-xs font-semibold text-[#CAEB66] mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#CAEB66] animate-pulse"></span>
            Seamless Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
            How KMS-FAST Works
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-400">
            A streamlined 4-step delivery lifecycle engineered for absolute speed, transparency, and reliability.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="group relative bg-gray-900/60 hover:bg-gray-900 border border-gray-800 hover:border-[#CAEB66]/50 rounded-2xl p-6 transition-all duration-300 shadow-lg hover:shadow-[#CAEB66]/5 flex flex-col justify-between"
            >
              {/* Top Row: Icon & Step Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-800/80 border border-gray-700/60 flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110">
                  <img src={item.icon} alt={item.title} className="w-full h-full object-contain filter invert brightness-200" />
                </div>
                <span className="text-xs font-bold text-gray-600 group-hover:text-[#CAEB66] transition-colors">
                  {item.step}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#CAEB66] transition-colors font-sans">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Subtle bottom highlight line on hover */}
              <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-transparent group-hover:bg-[#CAEB66] transition-all duration-300 rounded-full"></div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}