import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import UseAxios from '../Hooks/UseAxios';
import { FiTruck, FiCheck, FiX, FiPhone, FiMail, FiMapPin, FiUserCheck, FiFilter } from 'react-icons/fi';

const RidersList = () => {
  const axiosSecure = UseAxios();
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');

  // Fetch riders from backend
  useEffect(() => {
    setLoading(true);
    const endpoint = statusFilter === 'all' ? '/riders' : `/riders?status=${statusFilter}`;
    axiosSecure.get(endpoint)
      .then((res) => {
        setRiders(Array.isArray(res.data) ? res.data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching riders:', err);
        setRiders([]);
        setLoading(false);
      });
  }, [axiosSecure, statusFilter]);

  // Handle Approve / Reject Action
  const handleStatusUpdate = (rider, newStatus) => {
    const isApproving = newStatus === 'approved';

    Swal.fire({
      title: isApproving ? 'Approve Rider Application?' : 'Reject Rider Application?',
      text: isApproving
        ? `${rider.name} will be granted Rider role access in the system.`
        : `Are you sure you want to reject ${rider.name}'s application?`,
      icon: isApproving ? 'question' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isApproving ? '#CAEB66' : '#d33',
      cancelButtonColor: '#f3f4f6',
      confirmButtonText: isApproving
        ? '<span class="text-gray-900 font-bold">Yes, Approve</span>'
        : '<span class="text-white font-bold">Yes, Reject</span>',
      cancelButtonText: '<span class="text-gray-700 font-semibold">Cancel</span>',
      customClass: {
        popup: 'rounded-3xl',
        confirmButton: 'rounded-2xl px-5 py-3',
        cancelButton: 'rounded-2xl px-5 py-3'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axiosSecure.patch(`/riders/status/${rider._id}`, { status: newStatus });

          if (res.data.success) {
            setRiders((prev) =>
              prev.map((item) =>
                item._id === rider._id ? { ...item, status: newStatus } : item
              )
            );

            Swal.fire({
              title: isApproving ? 'Approved!' : 'Rejected',
              text: `Rider status updated to ${newStatus}.`,
              icon: 'success',
              confirmButtonColor: '#CAEB66',
              customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-2xl px-5 py-3 text-gray-900 font-bold'
              }
            });
          }
        } catch (error) {
          console.error('Status update error:', error);
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update rider status. Please try again.',
            icon: 'error',
            confirmButtonColor: '#CAEB66'
          });
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#96b830]"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FiUserCheck className="text-[#96b830]" /> Riders List & Applications
          </h1>
          <p className="text-xs text-gray-500">Review fleet applications, verify vehicles, and manage active riders</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1 bg-white p-1 border border-gray-200 rounded-2xl shadow-xs">
            <FiFilter className="w-3.5 h-3.5 text-gray-400 ml-2 mr-1" />
            {['all', 'pending', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-[#CAEB66] text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 shadow-xs">
            Total: <span className="text-[#96b830] font-bold">{riders.length}</span>
          </div>
        </div>
      </div>

      {/* Riders Table Card */}
      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {riders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-sm font-medium">No riders found for the selected filter.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-xs md:table-sm w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <th>#</th>
                  <th>Rider Info</th>
                  <th>Operating Zone</th>
                  <th>Vehicle & License</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {riders.map((rider, index) => (
                  <tr key={rider._id || index} className="hover:bg-gray-50/50 transition-colors">
                    <th>{index + 1}</th>

                    {/* Rider Name & Contact */}
                    <td>
                      <div className="font-bold text-gray-900">{rider.name}</div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5">
                        <FiMail className="w-3 h-3 text-gray-400" /> {rider.email}
                      </div>
                      <div className="text-[11px] text-gray-500 flex items-center gap-1">
                        <FiPhone className="w-3 h-3 text-gray-400" /> {rider.phone}
                      </div>
                    </td>

                    {/* District & Region */}
                    <td>
                      <div className="font-semibold text-gray-800 flex items-center gap-1">
                        <FiMapPin className="w-3.5 h-3.5 text-[#96b830]" /> {rider.district}
                      </div>
                      <span className="text-[11px] text-gray-400">{rider.region}</span>
                    </td>

                    {/* Bike & License Info */}
                    <td>
                      <div className="font-semibold text-gray-800 flex items-center gap-1.5">
                        <FiTruck className="w-3.5 h-3.5 text-gray-500" />
                        {rider.bikeModel} ({rider.bikeYear})
                      </div>
                      <div className="text-[11px] text-gray-500">
                        Reg: <span className="font-medium text-gray-700">{rider.bikeRegistration}</span>
                      </div>
                      <div className="text-[11px] text-gray-500">
                        License: <span className="font-medium text-gray-700">{rider.drivingLicense}</span>
                      </div>
                    </td>

                    {/* Applied Date */}
                    <td className="text-xs text-gray-500">
                      {rider.appliedAt ? new Date(rider.appliedAt).toLocaleDateString() : 'Recent'}
                    </td>

                    {/* Status Badge */}
                    <td>
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                          rider.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : rider.status === 'rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {rider.status || 'pending'}
                      </span>
                    </td>

                    {/* Approve / Reject Actions */}
                    <td className="text-center">
                      {rider.status === 'pending' ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(rider, 'approved')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                            title="Approve Rider"
                          >
                            <FiCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(rider, 'rejected')}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer"
                            title="Reject Application"
                          >
                            <FiX className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs font-medium text-gray-400 italic">
                          Processed
                        </span>
                      )}
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

export default RidersList;