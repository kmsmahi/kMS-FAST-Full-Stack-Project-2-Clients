import React from 'react';
import { useNavigate } from 'react-router';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-base-100 px-4 text-center">
      <h1 className="text-8xl font-extrabold" style={{ color: '#96b830' }}>
        404
      </h1>
      <h2 className="text-2xl font-bold text-base-content mt-4">Page Not Found</h2>
      <p className="text-sm text-base-content/60 max-w-md mt-2">
        The page you are looking for does not exist or you do not have permission to view it.
      </p>
      <button
        onClick={() => navigate('/')}
        className="btn mt-6 text-white border-0"
        style={{ backgroundColor: '#96b830' }}
      >
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;