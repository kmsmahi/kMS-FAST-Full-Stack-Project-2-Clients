import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import UseAuth from '../Hooks/UseAuth';
import UseAxios from '../Hooks/UseAxios';
import { FiTrash2, FiCreditCard } from 'react-icons/fi';

const MyParcels = () => {
  const { user } = UseAuth();
  const axiosSecure = UseAxios();
  const navigate = useNavigate();
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user parcels
  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/parcels?email=${user.email}`)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setParcels(res.data);
          } else {
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
  }, [user, axiosSecure]);

  // Handle Parcel Deletion
  const handleDelete = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this shipment booking!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#f3f4f6',
      confirmButtonText: '<span class="text-white font-bold">Yes, delete it!</span>',
      cancelButtonText: '<span class="text-gray-700 font-semibold">Cancel</span>',
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-2xl px-5 py-3',
        cancelButton: 'rounded-2xl px-5 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.delete(`/parcels/${id}`);
          
          if (res.data.success) {
            // Filter out deleted parcel from local state
            setParcels(parcels.filter(parcel => parcel._id !== id));
            Swal.fire({
              title: 'Deleted!',
              text: 'Your parcel has been removed successfully.',
              icon: 'success',
              confirmButtonColor: '#CAEB66',
              customClass: { popup: 'rounded-3xl', confirmButton: 'rounded-2xl px-5 py-3 text-gray-900 font-bold' }
            });
          } else {
            throw new Error(res.data.message || 'Failed to delete parcel');
          }
        } catch (error) {
          console.error('Delete error:', error);
          Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to delete the parcel. Please try again.',
            icon: 'error',
            confirmButtonColor: '#CAEB66'
          });
        }
      }
    });
  };

  // Handle Pay Action Navigation
  const handlePay = (parcelId) => {
    navigate(`/dashboard/payment?parcelId=${parcelId}`);
  };

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
                  <th>Parcel Name</th>
                  <th>Destination</th>
                  <th>Cost</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Booking Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {parcelList.map((parcel, index) => (
                  <tr key={parcel._id || index} className="hover:bg-gray-50/50 transition-colors">
                    <th>{index + 1}</th>
                    <td className="font-semibold text-gray-900">{parcel.parcelName || parcel.type || 'General Parcel'}</td>
                    <td>{parcel.deliveryAddress || parcel.receiverAddress || 'N/A'}</td>
                    <td className="font-semibold text-gray-900">৳{parcel.cost || '0'}</td>
                    
                    {/* Payment Status Column */}
                    <td>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        parcel.paymentStatus === 'paid' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-rose-100 text-rose-700'
                      }`}>
                        {parcel.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </td>

                    {/* Shipment Status Column */}
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

                    {/* Actions Column: Pay & Delete */}
                    <td className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        {parcel.paymentStatus !== 'paid' ? (
                          <button
                            onClick={() => handlePay(parcel._id)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                            title="Pay for this parcel"
                          >
                            <FiCreditCard className="w-3.5 h-3.5" /> Pay
                          </button>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 px-3 py-1 bg-emerald-50 rounded-xl">
                            Completed
                          </span>
                        )}

                        <button
                          onClick={() => handleDelete(parcel._id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                          title="Delete Parcel"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
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