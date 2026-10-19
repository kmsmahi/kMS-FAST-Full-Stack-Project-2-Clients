import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';

const Coverage = () => {
    const position = [51.505, -0.09];
    return (
        <div>
            <div className='flex flex-col gap-4'>
                <h1 className='text-4xl font-bold'>We are available in 64 districts</h1>

            <div>
                <label className="input">
  <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
    <g
      strokeLinejoin="round"
      strokeLinecap="round"
      strokeWidth="2.5"
      fill="none"
      stroke="currentColor"
    >
      <circle cx="11" cy="11" r="8"></circle>
      <path d="m21 21-4.3-4.3"></path>
    </g>
  </svg>
  <input type="search" required placeholder="Search" />
</label>
            </div>

            <h1 className='text-3xl font-semibold text-center'>We deliver almost all over Bangladesh</h1>
            </div>





            
        
render(
  <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    <Marker position={position}>
      <Popup>
        A pretty CSS3 popup. <br /> Easily customizable.
      </Popup>
    </Marker>
  </MapContainer>
)
        </div>
    );
};

export default Coverage;