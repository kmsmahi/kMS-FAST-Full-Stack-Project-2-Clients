import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UseAxios from '../Hooks/UseAxios';
import {
  FaBoxOpen,
  FaSearch,
  FaMapMarkerAlt,
  FaUser,
  FaPhoneAlt,
  FaCreditCard,
  FaCalendarAlt,
  FaEye,
  FaCheckCircle,
  FaExclamationTriangle,
  FaWeightHanging,
  FaReceipt
} from 'react-icons/fa';

const AllParcels = () => {
  const axiosSecure = UseAxios();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // 1. Fetch all parcels from the admin endpoint
  const { data: parcels = [], isLoading, isError, error } = useQuery({
    queryKey: ['allAdminParcels'],
    queryFn: async () => {
      const res = await axiosSecure.get('/parcels/admin/all');
      return res.data;
    }
  });

  // 2. Mutation to update delivery status
  const statusMutation = useMutation({
    mutationFn: async ({ parcelId, newStatus }) => {
      const res = await axiosSecure.patch(`/parcels/status/${parcelId}`, { status: newStatus });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['allAdminParcels']);
      showToast('success', `Parcel marked as ${variables.newStatus.toUpperCase()}.`);
      if (selectedParcel && selectedParcel._id === variables.parcelId) {
        setSelectedParcel((prev) => ({ ...prev, status: variables.newStatus }));
      }
    },
    onError: (err) => {
      showToast('error', err.response?.data?.error || 'Failed to update parcel status.');
    }
  });

  // 3. Search & Filter Logic
  const filteredParcels = parcels.filter((parcel) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      parcel.parcelName?.toLowerCase().includes(query) ||
      parcel.senderName?.toLowerCase().includes(query) ||
      parcel.senderEmail?.toLowerCase().includes(query) ||
      parcel.receiverName?.toLowerCase().includes(query) ||
      parcel.senderDistrict?.toLowerCase().includes(query) ||
      parcel.receiverDistrict?.toLowerCase().includes(query) ||
      parcel.transactionId?.toLowerCase().includes(query);

    const currentStatus = parcel.status || 'pending';
    const matchesStatus = statusFilter === 'all' || currentStatus === statusFilter;

    const currentPayment = parcel.paymentStatus || 'unpaid';
    const matchesPayment = paymentFilter === 'all' || currentPayment === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Summary Metrics
  const paidParcelsCount = parcels.filter((p) => p.paymentStatus === 'paid').length;
  const pendingParcelsCount = parcels.filter((p) => (p.status || 'pending') === 'pending').length;
  const totalRevenue = parcels
    .filter((p) => p.paymentStatus === 'paid')
    .reduce((sum, p) => sum + (Number(p.cost) || 0), 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg" style={{ color: '#96b830' }}></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-error">
        <p>Failed to load parcels: {error.response?.data?.message || error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert shadow-lg text-white ${
              toast.type === 'success' ? 'bg-[#96b830]' : 'bg-error'
            }`}
          >
            {toast.type === 'success' ? (
              <FaCheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <FaExclamationTriangle className="w-4 h-4 shrink-0" />
            )}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-base-content">
            <FaBoxOpen className="w-8 h-8" style={{ color: '#96b830' }} />
            All Parcels Management
          </h1>
          <p className="text-sm text-base-content/60 mt-1">
            Monitor all customer shipments, verify payments, and update delivery statuses.
          </p>
        </div>

        {/* Summary Badges */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="badge badge-lg font-semibold px-4 py-3 bg-base-200 text-base-content border-0">
            Total: {parcels.length}
          </div>
          <div className="badge badge-lg font-semibold px-4 py-3 bg-warning/15 text-warning-content border-warning/30">
            Pending: {pendingParcelsCount}
          </div>
          <div
            className="badge badge-lg font-semibold px-4 py-3 text-white border-0"
            style={{ backgroundColor: '#96b830' }}
          >
            Paid Revenue: ৳{totalRevenue.toLocaleString()} ({paidParcelsCount})
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm">
        {/* Delivery Status Tabs */}
        <div className="tabs tabs-boxed bg-base-200/60 p-1 w-full lg:w-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All' },
            { id: 'pending', label: 'Pending' },
            { id: 'picked-up', label: 'Picked Up' },
            { id: 'in-transit', label: 'In Transit' },
            { id: 'delivered', label: 'Delivered' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              style={
                statusFilter === tab.id
                  ? { backgroundColor: '#96b830', color: '#ffffff' }
                  : {}
              }
              className={`tab tab-sm font-medium transition-all ${
                statusFilter === tab.id ? 'font-semibold' : ''
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Payment Filter + Search */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="select select-bordered select-sm h-10 w-full sm:w-40 text-sm focus:outline-none"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid Only</option>
            <option value="unpaid">Unpaid Only</option>
          </select>

          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-base-content/40">
              <FaSearch className="w-4 h-4" />
            </span>
            <input
              type="text"
              placeholder="Search parcel, sender, district..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input input-bordered input-sm h-10 w-full pl-10 text-sm focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Parcels Table */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead className="bg-base-200/60 text-base-content uppercase text-xs tracking-wider">
              <tr>
                <th className="py-4 pl-6">#</th>
                <th>Parcel Info</th>
                <th>Route (From → To)</th>
                <th>Sender / Receiver</th>
                <th>Cost & Payment</th>
                <th>Delivery Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredParcels.map((parcel, index) => {
                const isPaid = parcel.paymentStatus === 'paid';
                const currentStatus = parcel.status || 'pending';

                return (
                  <tr key={parcel._id} className="hover transition-colors">
                    <th className="pl-6 font-medium text-base-content/70">{index + 1}</th>

                    {/* Parcel Info */}
                    <td>
                      <div className="font-bold text-base-content capitalize">
                        {parcel.parcelName || 'Unnamed Parcel'}
                      </div>
                      <div className="text-xs text-base-content/60 flex items-center gap-2 mt-0.5">
                        <span className="badge badge-ghost badge-xs">{parcel.parcelType}</span>
                        <span>{parcel.parcelWeight} kg</span>
                      </div>
                      <div className="text-[11px] text-base-content/45 mt-1 flex items-center gap-1">
                        <FaCalendarAlt className="w-3 h-3" />
                        {parcel.createdAt
                          ? new Date(parcel.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </div>
                    </td>

                    {/* Route */}
                    <td>
                      <div className="text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-base-content/80">
                          <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0"></span>
                          <span className="font-medium">{parcel.senderDistrict}</span>
                          <span className="text-base-content/50">({parcel.senderRegion})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-base-content/80">
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: '#96b830' }}
                          ></span>
                          <span className="font-medium">{parcel.receiverDistrict}</span>
                          <span className="text-base-content/50">({parcel.receiverRegion})</span>
                        </div>
                      </div>
                    </td>

                    {/* Sender / Receiver */}
                    <td>
                      <div className="text-xs space-y-1">
                        <div className="font-semibold text-base-content">
                          From: {parcel.senderName}
                        </div>
                        <div className="text-base-content/60">To: {parcel.receiverName}</div>
                        <div className="text-[11px] text-base-content/50">{parcel.senderEmail}</div>
                      </div>
                    </td>

                    {/* Cost & Payment */}
                    <td>
                      <div className="font-bold text-base-content">৳{parcel.cost}</div>
                      <div className="mt-1">
                        {isPaid ? (
                          <span
                            className="badge badge-sm text-white border-0 font-semibold"
                            style={{ backgroundColor: '#96b830' }}
                          >
                            Paid
                          </span>
                        ) : (
                          <span className="badge badge-sm badge-error text-white font-semibold">
                            Unpaid
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Delivery Status Selector */}
                    <td>
                      <select
                        value={currentStatus}
                        disabled={statusMutation.isPending}
                        onChange={(e) =>
                          statusMutation.mutate({
                            parcelId: parcel._id,
                            newStatus: e.target.value
                          })
                        }
                        className="select select-bordered select-xs font-semibold capitalize"
                      >
                        <option value="pending">Pending</option>
                        <option value="picked-up">Picked Up</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>

                    {/* View Details Button */}
                    <td className="text-center">
                      <button
                        onClick={() => setSelectedParcel(parcel)}
                        className="btn btn-sm btn-outline border-[#96b830]/50 text-[#96b830] hover:bg-[#96b830] hover:text-white hover:border-[#96b830] gap-1.5 transition-all duration-200"
                      >
                        <FaEye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredParcels.length === 0 && (
          <div className="text-center py-16 text-base-content/50">
            <p className="text-lg font-medium">No parcels found.</p>
            <p className="text-xs mt-1">Try adjusting your search or status filters.</p>
          </div>
        )}
      </div>

      {/* Parcel Full Details Modal */}
      {selectedParcel && (
        <div className="modal modal-open">
          <div className="modal-box max-w-2xl rounded-2xl">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2 text-base-content">
                <FaBoxOpen style={{ color: '#96b830' }} />
                Parcel Details — <span className="capitalize">{selectedParcel.parcelName}</span>
              </h3>
              <span className="text-xs font-mono text-base-content/50">
                ID: {selectedParcel._id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 text-sm">
              {/* Sender Card */}
              <div className="p-4 rounded-xl bg-base-200/50 border border-base-200 space-y-1.5">
                <p className="text-xs font-bold uppercase text-base-content/50">Sender Information</p>
                <p className="font-semibold flex items-center gap-2">
                  <FaUser className="w-3.5 h-3.5 text-base-content/40" />
                  {selectedParcel.senderName}
                </p>
                <p className="text-xs text-base-content/70">{selectedParcel.senderEmail}</p>
                <p className="text-xs flex items-center gap-2 text-base-content/70">
                  <FaPhoneAlt className="w-3 h-3 text-base-content/40" />
                  {selectedParcel.senderPhone}
                </p>
                <p className="text-xs flex items-start gap-2 text-base-content/70">
                  <FaMapMarkerAlt className="w-3.5 h-3.5 text-base-content/40 mt-0.5 shrink-0" />
                  <span>
                    {selectedParcel.senderAddress}, {selectedParcel.senderDistrict},{' '}
                    {selectedParcel.senderRegion}
                  </span>
                </p>
              </div>

              {/* Receiver Card */}
              <div className="p-4 rounded-xl bg-base-200/50 border border-base-200 space-y-1.5">
                <p className="text-xs font-bold uppercase text-base-content/50">Receiver Information</p>
                <p className="font-semibold flex items-center gap-2">
                  <FaUser className="w-3.5 h-3.5 text-base-content/40" />
                  {selectedParcel.receiverName}
                </p>
                <p className="text-xs flex items-center gap-2 text-base-content/70">
                  <FaPhoneAlt className="w-3 h-3 text-base-content/40" />
                  {selectedParcel.receiverPhone}
                </p>
                <p className="text-xs flex items-start gap-2 text-base-content/70">
                  <FaMapMarkerAlt className="w-3.5 h-3.5 text-base-content/40 mt-0.5 shrink-0" />
                  <span>
                    {selectedParcel.receiverAddress}, {selectedParcel.receiverDistrict},{' '}
                    {selectedParcel.receiverRegion}
                  </span>
                </p>
              </div>

              {/* Shipment & Payment Info */}
              <div className="md:col-span-2 p-4 rounded-xl bg-base-200/50 border border-base-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-base-content/50">Type & Weight</p>
                  <p className="font-semibold mt-0.5 flex items-center gap-1">
                    <FaWeightHanging className="w-3 h-3" />
                    {selectedParcel.parcelType} ({selectedParcel.parcelWeight} kg)
                  </p>
                </div>
                <div>
                  <p className="text-base-content/50">Delivery Cost</p>
                  <p className="font-bold text-sm mt-0.5" style={{ color: '#96b830' }}>
                    ৳{selectedParcel.cost}
                  </p>
                </div>
                <div>
                  <p className="text-base-content/50">Payment Status</p>
                  <p className="font-semibold uppercase mt-0.5 flex items-center gap-1">
                    <FaCreditCard className="w-3 h-3" />
                    {selectedParcel.paymentStatus || 'unpaid'}
                  </p>
                </div>
                <div>
                  <p className="text-base-content/50">Transaction ID</p>
                  <p className="font-mono text-[11px] truncate mt-0.5 flex items-center gap-1">
                    <FaReceipt className="w-3 h-3 shrink-0" />
                    {selectedParcel.transactionId || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                onClick={() => setSelectedParcel(null)}
                className="btn btn-sm text-white border-0"
                style={{ backgroundColor: '#96b830' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllParcels;