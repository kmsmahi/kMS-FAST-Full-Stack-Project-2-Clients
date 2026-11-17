import React from 'react';
import UseAuth from '../Hooks/UseAuth';
import UseRole from '../Hooks/UseRole';
import NotFound from '../Shared/NotFound';

const AdminRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const [role, roleLoading] = UseRole();

  if (loading || roleLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg" style={{ color: '#96b830' }}></span>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return <NotFound />;
  }

  return children;
};

export default AdminRoute;