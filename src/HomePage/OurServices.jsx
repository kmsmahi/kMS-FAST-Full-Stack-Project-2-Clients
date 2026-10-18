import React from 'react';
import serviceIcon from '../assets/allLogos/service.png';

const servicesList = [
  {
    id: "01",
    title: "Express & Standard Delivery",
    tag: "Same-Day / Next-Day",
    description: "We deliver parcels within 24–72 hours in Dhaka, Chittagong, Sylhet, Khulna, and Rajshahi. Express delivery available in Dhaka within 4–6 hours from pick-up to drop-off.",
    icon: serviceIcon,
  },
  {
    id: "02",
    title: "Nationwide Delivery",
    tag: "64 Districts",
    description: "We deliver parcels nationwide with home delivery in every district, ensuring your products reach customers within 48–72 hours.",
    icon: serviceIcon,
  },
  {
    id: "03",
    title: "Fulfillment Solution",
    tag: "End-to-End",
    description: "We also offer customized service with inventory management support, online order processing, packaging, and after sales support.",
    icon: serviceIcon,
  },
  {
    id: "04",
    title: "Cash On Home Delivery",
    tag: "Guaranteed Payout",
    description: "100% cash on delivery anywhere in Bangladesh with guaranteed safety of your product and transparent settlement.",
    icon: serviceIcon,
  },
  {
    id: "05",
    title: "Corporate Service",
    tag: "Enterprise B2B",
    description: "Customized corporate logistics including dedicated account management, warehouse, and large-scale inventory management support.",
    icon: serviceIcon,
  },
  {
    id: "06",
    title: "Reverse Logistics & Return",
    tag: "Easy Returns",
    description: "Through our reverse logistics facility we allow end customers to return or exchange products seamlessly with online business merchants.",
    icon: serviceIcon,
  },
];

export default function Services() {
  return (
    <section className="bg-slate-50/80 py-16 sm:py-24 border-y border-gray-200/60 relative overflow-hidden">
      
      {/* Decorative subtle background glow element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-800 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#96b830] animate-pulse"></span>
            Comprehensive Logistics Solutions
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-sans">
            KMS-<span className="text-[#96b830]">FAST</span> Services
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
            Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to enterprise shipments — we deliver on time, every time.
          </p>
        </div>

        {/* Services Grid with Pure White Cards on Soft Background */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {servicesList.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-gray-200/80 hover:border-[#CAEB66] rounded-3xl p-7 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between overflow-hidden"
            >
              {/* Top Accent Corner Pill */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#CAEB66]/10 rounded-bl-full pointer-events-none transition-transform duration-500 group-hover:scale-110"></div>

              <div>
                {/* Header Row: Icon & Category Tag */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-center p-3 shadow-inner group-hover:bg-[#CAEB66]/20 group-hover:border-[#CAEB66] transition-colors duration-300">
                    <img 
                      src={item.icon} 
                      alt={item.title} 
                      className="w-full h-full object-contain" 
                    />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold text-gray-700 bg-gray-100 border border-gray-200 group-hover:bg-[#CAEB66] group-hover:text-gray-900 group-hover:border-[#CAEB66] transition-colors duration-300">
                    {item.tag}
                  </span>
                </div>

                {/* Service Title */}
                <h3 className="text-xl font-bold text-gray-900 mb-3 font-sans tracking-tight">
                  {item.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                  {item.description}
                </p>
              </div>

              {/* Card Footer with Interaction Link */}
              <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-gray-500 group-hover:text-gray-900 transition-colors">
                <span>Explore Details</span>
                <div className="w-7 h-7 rounded-full bg-gray-100 group-hover:bg-[#CAEB66] flex items-center justify-center transition-all duration-300 group-hover:translate-x-1">
                  <svg 
                    className="w-3.5 h-3.5 text-gray-700 group-hover:text-gray-900 stroke-current" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth="2.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}