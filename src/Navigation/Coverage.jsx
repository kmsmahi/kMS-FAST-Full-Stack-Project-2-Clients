import React, { useState, useMemo } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useLoaderData } from 'react-router';
import L from 'leaflet';

// Import Leaflet styles
import 'leaflet/dist/leaflet.css';

// Import default Leaflet marker assets to fix broken icon paths in Vite/Webpack
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default marker icon configuration
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Helper component to smoothly center/fly map when a district is selected
function MapController({ center, zoom }) {
  const map = useMap();
  if (center) {
    map.flyTo(center, zoom, { duration: 1.2 });
  }
  return null;
}

export default function Coverage() {
  const initialPosition = [23.6850, 90.3563]; // Center of Bangladesh
  const rawMarkerData = useLoaderData() || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCenter, setSelectedCenter] = useState(initialPosition);
  const [mapZoom, setMapZoom] = useState(7);

  // Filter district markers based on search input
  const filteredMarkers = useMemo(() => {
    if (!searchTerm.trim()) return rawMarkerData;
    return rawMarkerData.filter((item) => {
      const districtMatch = item.district?.toLowerCase().includes(searchTerm.toLowerCase());
      const areaMatch = item.covered_area?.some((area) =>
        area.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return districtMatch || areaMatch;
    });
  }, [searchTerm, rawMarkerData]);

  // Handle district selection from search / sidebar
  const handleSelectDistrict = (data) => {
    if (data.latitude && data.longitude) {
      setSelectedCenter([data.latitude, data.longitude]);
      setMapZoom(10);
    }
  };

  return (
    <section className="bg-slate-50/70 min-h-screen py-12 sm:py-20 border-b border-gray-200/60 relative overflow-hidden">
      
      {/* Decorative ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#CAEB66]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Search Bar Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-800 mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#96b830] animate-pulse"></span>
            Nationwide Logistics Network
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight font-sans">
            We are available in <span className="text-[#96b830]">64 Districts</span>
          </h1>
          
          <p className="mt-3 text-sm sm:text-base text-gray-600 leading-relaxed">
            Delivering door-to-door across every corner of Bangladesh with speed, safety, and live status visibility.
          </p>

          {/* Interactive Search Input */}
          <div className="mt-8 relative max-w-xl mx-auto">
  <div className="relative flex items-center bg-white shadow-sm hover:shadow-md ring-1 ring-gray-200 focus-within:ring-2 focus-within:ring-[#CAEB66] rounded-2xl transition-all duration-300 overflow-hidden pr-2">
    
    {/* Search Icon */}
    <div className="pl-4 text-gray-400">
      <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
        <circle cx="11" cy="11" r="8"></circle>
        <path d="m21 21-4.3-4.3" strokeLinecap="round"></path>
      </svg>
    </div>

    {/* Input Field */}
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search by district or service area (e.g. Dhaka, Chittagong, Dhanmondi)..."
      className="w-full py-3.5 pl-3 pr-2 text-sm text-gray-900 placeholder-gray-400 bg-transparent border-none outline-none focus:outline-none focus:ring-0"
    />

    {/* Theme-Aligned Clear Button */}
    {searchTerm && (
      <button 
        onClick={() => setSearchTerm('')} 
        className="shrink-0 px-3 py-1.5 text-xs font-semibold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] rounded-xl transition-all duration-200 shadow-sm flex items-center gap-1"
      >
        <span>Clear</span>
        <svg className="w-3 h-3 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="3">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    )}
  </div>
  
  {/* Search Results Counter Badge */}
  <div className="mt-2 text-right pr-2">
    <span className="text-xs text-gray-500 font-medium">
      Showing <strong className="text-gray-900">{filteredMarkers.length}</strong> of {rawMarkerData.length} hubs
    </span>
  </div>
</div>
        </div>

        {/* Main Content Layout: Sidebar + Map */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: District Hub List (Desktop & Tablet Sidebar) */}
          <div className="lg:col-span-4 bg-white border border-gray-200 rounded-3xl p-5 shadow-sm max-h-[600px] overflow-y-auto flex flex-col gap-3">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 font-sans">
                Active Delivery Hubs
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#CAEB66]/30 text-gray-900">
                100% Coverage
              </span>
            </div>

            {filteredMarkers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-xs">
                No coverage hubs found matching "{searchTerm}".
              </div>
            ) : (
              filteredMarkers.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectDistrict(item)}
                  className="group p-3.5 rounded-2xl bg-gray-50/80 hover:bg-white border border-gray-200/80 hover:border-[#CAEB66] transition-all duration-200 cursor-pointer shadow-none hover:shadow-md flex items-center justify-between"
                >
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 group-hover:text-gray-900 transition-colors">
                      {item.district}
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                      {item.covered_area?.join(', ') || 'District Center Hub'}
                    </p>
                  </div>
                  
                  <div className="w-7 h-7 rounded-full bg-white group-hover:bg-[#CAEB66] border border-gray-200 group-hover:border-[#CAEB66] flex items-center justify-center transition-colors shrink-0">
                    <svg className="w-3.5 h-3.5 text-gray-600 group-hover:text-gray-900 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Column: Leaflet Map Container */}
          <div className="lg:col-span-8 bg-white border border-gray-200 rounded-3xl p-2.5 shadow-sm relative overflow-hidden">
            <MapContainer
              center={initialPosition}
              zoom={7}
              scrollWheelZoom={false}
              className="h-[500px] sm:h-[600px] w-full rounded-2xl z-0"
            >
              <MapController center={selectedCenter} zoom={mapZoom} />
              
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {filteredMarkers.map((data, index) => (
                <Marker 
                  key={index} 
                  position={[data.latitude, data.longitude]}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 font-sans text-gray-900 max-w-xs">
                      <div className="flex items-center justify-between gap-2 border-b border-gray-100 pb-2 mb-2">
                        <strong className="text-sm font-bold text-gray-900">
                          {data.district} District
                        </strong>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#CAEB66] text-gray-900">
                          KMS-FAST
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-600 leading-relaxed">
                        <span className="font-semibold text-gray-800">Service Centers: </span>
                        {data.covered_area?.join(', ') || 'Full district coverage'}
                      </p>

                      <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#96b830] font-semibold">
                        <span>Home Delivery Available</span>
                        <span>24–72 Hrs</span>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

        </div>

      </div>
    </section>
  );
}