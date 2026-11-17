import React from 'react';
import UseAuth from '../Hooks/UseAuth';
import NotFound from '../Shared/NotFound';

const PrivateRoute = ({ children }) => {
  const { user, loading } = UseAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" style={{ color: '#96b830' }}></span>
      </div>
    );
  }

  if (!user) {
    return <NotFound />;
  }

  return children;
};

export default PrivateRoute;