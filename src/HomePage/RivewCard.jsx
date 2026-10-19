import React from 'react';
import img1 from '../assets/allLogos/reviewQuote.png';

const RivewCard = ({ singleRev }) => {
  const { name, position, place, review, image } = singleRev || {};

  return (
    <div className="h-full bg-white border border-gray-200 hover:border-[#CAEB66] rounded-3xl p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group relative overflow-hidden">
      
      {/* Top Accent Line on Hover */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-transparent group-hover:bg-[#CAEB66] transition-all duration-300 rounded-full"></div>

      <div>
        {/* Quote Icon & Header */}
        <div className="flex items-center justify-between mb-4">
          <img 
            className="w-8 h-6 object-contain opacity-70 group-hover:opacity-100 transition-opacity" 
            src={img1} 
            alt="Quote" 
          />
          {/* Star Rating Display */}
          <div className="flex items-center gap-0.5 text-[#96b830]">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>

        {/* Review Text */}
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic mb-6">
          "{review}"
        </p>
      </div>

      {/* Author Details Footer */}
      <div>
        <hr className="border-gray-100 mb-4" />
        <div className="flex items-center gap-3.5">
          <img 
            className="w-12 h-12 rounded-full object-cover border border-gray-200 group-hover:border-[#CAEB66] transition-colors" 
            src={image} 
            alt={name || 'Customer'} 
          />
          <div>
            <h4 className="text-sm font-bold text-gray-900 font-sans tracking-tight">
              {name}
            </h4>
            <p className="text-xs text-gray-500 font-medium">
              {position} • <span className="text-gray-700">{place}</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default RivewCard;