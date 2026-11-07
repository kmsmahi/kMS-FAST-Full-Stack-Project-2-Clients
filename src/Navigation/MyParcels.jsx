import React, { useState, useEffect } from 'react';
import UseAuth from '../Hooks/UseAuth';

const MyParcels = () => {
  const { user } = UseAuth();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/parcels?email=${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            setParcels(data);
          } else {
            console.error('API response is not an array:', data);
            setParcels([]);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching parcels:', err);
          setParcels([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#96b830]"></span>
      </div>
    );
  }

 
  const parcelList = Array.isArray(parcels) ? parcels : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Parcels</h1>
          <p className="text-xs text-gray-500">Manage and track all your delivery shipments</p>
        </div>
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 shadow-xs">
          Total Shipments: <span className="text-[#96b830] font-bold">{parcelList.length}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {parcelList.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm font-medium">No parcels found. Send your first parcel from the dashboard!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-xs md:table-sm w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <th>#</th>
                  <th>Parcel Type / Name</th>
                  <th>Receiver Name</th>
                  <th>Destination</th>
                  <th>Cost</th>
                  <th>Status</th>
                  <th>Booking Date</th>
                </tr>
              </thead>
              <tbody>
                {parcelList.map((parcel, index) => (
                  <tr key={parcel._id || index} className="hover:bg-gray-50/50 transition-colors">
                    <th>{index + 1}</th>
                    <td className="font-semibold text-gray-900">{parcel.parcelName || parcel.type || 'General Parcel'}</td>
                    <td>{parcel.receiverName || 'N/A'}</td>
                    <td>{parcel.deliveryAddress || parcel.receiverAddress || 'N/A'}</td>
                    <td className="font-semibold text-gray-900">৳{parcel.cost || '0'}</td>
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        parcel.status === 'Delivered' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {parcel.status || 'Pending'}
                      </span>
                    </td>
                    <td className="text-gray-500 text-xs">
                      {parcel.createdAt ? new Date(parcel.createdAt).toLocaleDateString() : 'Recent'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyParcels;