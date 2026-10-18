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
    primaryAction: { text: "Book a Shipment", to: "/dashboard" },
    secondaryAction: { text: "View Pricing", to: "/pricing" }
  },
  {
    image: banner2,
    title: "Nationwide Coverage & Logistics",
    primaryAction: { text: "Check Coverage", to: "/coverage" },
    secondaryAction: { text: "Be a Rider", to: "/bearider" }
  },
  {
    image: banner3,
    title: "Secure & Trusted Operations",
    primaryAction: { text: "Get Started", to: "/signup" },
    secondaryAction: { text: "About Us", to: "/aboutus" }
  }
];

export default function Banner() {
  // rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-gray-200 bg-white
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="">
        <Carousel
          autoPlay
          infiniteLoop
          interval={5000}
          transitionTime={600}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          stopOnHover={true}
          swipeable={true}
          emulateTouch={true}
          className="w-full"
          /* 2. Custom Left Arrow */
          renderArrowPrev={(clickHandler, hasPrev, label) =>
            hasPrev && (
              <button
                type="button"
                onClick={clickHandler}
                aria-label={label}
                className="absolute -left-2 sm:left-4 top-2/3 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md border border-gray-200 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
              </button>
            )
          }
          /* 3. Custom Right Arrow */
          renderArrowNext={(clickHandler, hasNext, label) =>
            hasNext && (
              <button
                type="button"
                onClick={clickHandler}
                aria-label={label}
                className="absolute -right-2 sm:right-4 top-2/3 -translate-y-1/2 z-20 w-8 h-8 sm:w-11 sm:h-11 flex items-center justify-center rounded-full bg-white/90 hover:bg-white text-gray-800 shadow-md border border-gray-200 transition-all duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 stroke-current"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            )
          }
        >
          {bannerSlides.map((slide, index) => (
            <div 
              key={index} 
              className="relative h-[250px] sm:h-[400px] lg:h-[500px] w-full bg-white flex items-center justify-center pb-12 sm:pb-14"
            >
              {/* Full Unobstructed Banner Image */}
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-contain object-center"
              />

              {/* Floating Action Buttons */}
              <div className="absolute inset-x-0 bottom-2 sm:bottom-4 flex justify-center items-center px-2 z-10">
                <div className="flex flex-row items-center justify-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md px-3 py-2 sm:px-5 sm:py-3 rounded-xl shadow-md border border-gray-200">
                  <Link
                    to={slide.primaryAction.to}
                    className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] transition-all shadow-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                  >
                    {slide.primaryAction.text}
                  </Link>
                  <Link
                    to={slide.secondaryAction.to}
                    className="px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 border border-gray-300 transition-all shadow-sm whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-gray-400"
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
  );
}