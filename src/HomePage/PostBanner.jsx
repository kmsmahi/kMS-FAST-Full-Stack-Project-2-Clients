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
    <section className="bg-white py-16 sm:py-20 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-800 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#96b830] animate-pulse"></span>
            Seamless Workflow
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight font-sans">
            How KMS-<span className='text-[#96b830]'>FAST</span> Works
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed">
            A streamlined 4-step delivery lifecycle engineered for absolute speed, transparency, and reliability.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="group relative bg-white hover:bg-gray-50/80 border border-gray-200 hover:border-[#CAEB66] rounded-2xl p-6 transition-all duration-300 shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              {/* Top Row: Icon & Step Number */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-center p-2.5 transition-transform duration-300 group-hover:scale-110 group-hover:border-[#CAEB66]/60">
                  <img 
                    src={item.icon} 
                    alt={item.title} 
                    className="w-full h-full object-contain" 
                  />
                </div>
                <span className="text-xs font-bold text-gray-400 group-hover:text-gray-900 transition-colors">
                  {item.step}
                </span>
              </div>

              {/* Content */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 font-sans group-hover:text-gray-900 transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
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