import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';

// Import required modules
import { Pagination, Autoplay } from 'swiper/modules';

import slide1 from '../assets/brands/amazon.png';
import slide2 from '../assets/brands/amazon_vector.png';
import slide3 from '../assets/brands/casio.png';
import slide4 from '../assets/brands/moonstar.png';
import slide5 from '../assets/brands/randstad.png';
import slide6 from '../assets/brands/star.png';
import slide7 from '../assets/brands/start_people.png';

const partnerBrands = [
  { id: 1, name: "Amazon", logo: slide1 },
  { id: 2, name: "Amazon Vector", logo: slide2 },
  { id: 3, name: "Casio", logo: slide3 },
  { id: 4, name: "Moonstar", logo: slide4 },
  { id: 5, name: "Randstad", logo: slide5 },
  { id: 6, name: "Star", logo: slide6 },
  { id: 7, name: "Start People", logo: slide7 },
];

export default function Company() {
  return (
    <section className="bg-white py-12 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-8">
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-800">
            We've helped thousands of sales teams
          </p>
        </div>

        {/* Brand Logo Carousel */}
        <Swiper
          grabCursor={true}
          loop={true}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
            dynamicBullets: true,
          }}
          breakpoints={{
            320: { slidesPerView: 2, spaceBetween: 20 },
            640: { slidesPerView: 3, spaceBetween: 30 },
            768: { slidesPerView: 4, spaceBetween: 40 },
            1024: { slidesPerView: 5, spaceBetween: 50 },
          }}
          modules={[Pagination, Autoplay]}
          className="mySwiper !pb-12"
        >
          {partnerBrands.map((brand) => (
            <SwiperSlide key={brand.id}>
              <div className="flex items-center justify-center p-4 h-20 bg-gray-50/50 hover:bg-white border border-gray-200/80 hover:border-[#CAEB66] rounded-2xl transition-all duration-300 shadow-sm hover:shadow-lg group">
                <img
                  src={brand.logo}
                  alt={brand.name}
                  className="max-h-9 w-auto object-contain opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}