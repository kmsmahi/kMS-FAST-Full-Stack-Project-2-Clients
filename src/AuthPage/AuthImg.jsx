import React from 'react';
import img1 from '../assets/allLogos/authImage.png';

const AuthImg = () => {
    return (
        <div className="relative flex items-center justify-center p-6">
            {/* Ambient background glow */}
            <div className="absolute w-72 h-72 bg-[#CAEB66]/20 rounded-full blur-3xl pointer-events-none"></div>
            
            <img 
                src={img1} 
                alt="KMS-FAST Authentication Visual" 
                className="relative z-10 w-full max-w-lg object-contain drop-shadow-xl rounded-3xl" 
            />
        </div>
    );
};

export default AuthImg;