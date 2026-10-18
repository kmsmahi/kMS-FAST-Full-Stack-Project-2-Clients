import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { Link } from 'react-router';

import banner1 from '../assets/banner/banner1.png';
import banner2 from '../assets/banner/banner2.png';
import banner3 from '../assets/banner/banner3.png';

const bannerSlides = [
  {
    image: banner1,
    title: "Lightning-Fast Parcel Delivery",
    subtitle: "Experience real-time tracking, secure handling, and rapid fulfillment across all major operational zones.",
    primaryAction: { text: "Book a Shipment", to: "/dashboard" },
    secondaryAction: { text: "View Pricing", to: "/pricing" }
  },
  {
    image: banner2,
    title: "Nationwide Coverage & Logistics",
    subtitle: "Connecting customers, riders, and administrators seamlessly with automated routing and live status updates.",
    primaryAction: { text: "Check Coverage", to: "/coverage" },
    secondaryAction: { text: "Be a Rider", to: "/bearider" }
  },
  {
    image: banner3,
    title: "Secure & Trusted Operations",
    subtitle: "Enterprise-grade reliability with guaranteed delivery confirmation and dedicated round-the-clock support.",
    primaryAction: { text: "Get Started", to: "/signup" },
    secondaryAction: { text: "About Us", to: "/aboutus" }
  }
];

export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden bg-[#0B0F19] pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="rounded-3xl overflow-hidden border border-gray-800/80 shadow-2xl bg-gray-900/40">
          <Carousel
            autoPlay
            infiniteLoop
            interval={5000}
            transitionTime={600}
            showStatus={false}
            showThumbs={false}
            stopOnHover={true}
            swipeable={true}
            emulateTouch={true}
            className="w-full"
          >
            {bannerSlides.map((slide, index) => (
              <div key={index} className="relative h-[420px] sm:h-[500px] lg:h-[560px] w-full">
                
                {/* Background Image with Dark Gradient Overlay for Readability */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="absolute inset-0 w-full h-full object-cover object-center filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0F19]/95 via-[#0B0F19]/75 to-transparent sm:w-3/4"></div>

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-center items-start text-left px-6 sm:px-12 lg:px-16 max-w-2xl z-10">
                  
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-900/80 border border-gray-700/60 text-xs font-medium text-[#CAEB66] mb-4 shadow-sm backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-[#CAEB66] animate-pulse"></span>
                    KMS-FAST Logistics Platform
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4 font-sans">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <p className="text-sm sm:text-base text-gray-300 mb-8 leading-relaxed max-w-lg">
                    {slide.subtitle}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      to={slide.primaryAction.to}
                      className="px-6 py-3 rounded-full text-sm font-semibold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] transition-all duration-200 shadow-lg shadow-[#CAEB66]/15 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                    >
                      {slide.primaryAction.text}
                    </Link>
                    <Link
                      to={slide.secondaryAction.to}
                      className="px-6 py-3 rounded-full text-sm font-medium text-gray-200 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 transition-all duration-200 backdrop-blur-sm hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      {slide.secondaryAction.text}
                    </Link>
                  </div>

                </div>

              </div>
            ))}
          </Carousel>
        </div>

      </div>
    </div>
  );
}