import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import UseAxios from '../Hooks/UseAxios';
import {
  FaShieldAlt,
  FaUserCheck,
  FaUsers,
  FaEnvelope,
  FaCalendarAlt,
  FaSearch,
  FaUserShield,
  FaUserMinus,
  FaExclamationTriangle,
  FaCheckCircle,
  FaTimes
} from 'react-icons/fa';

const SUPER_ADMIN_EMAIL = 'salauddinmahi2002@gmail.com';

const UsersList = () => {
  const axiosSecure = UseAxios();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch users using TanStack Query
  const { data: users = [], isLoading, isError, error } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  // Mutation to update user role
  const roleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const res = await axiosSecure.patch(`/users/admin/${userId}`, { role: newRole });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(['allUsers']);
      const actionText = variables.newRole === 'admin' ? 'promoted to Admin' : 'demoted to User';
      showToast('success', `${selectedUser?.name || 'User'} has been ${actionText}.`);
      setSelectedUser(null);
    },
    onError: (err) => {
      showToast('error', err.response?.data?.error || 'Failed to update user role.');
      setSelectedUser(null);
    }
  });

  const confirmRoleChange = () => {
    if (!selectedUser) return;
    const newRole = selectedUser.role === 'admin' ? 'user' : 'admin';
    roleMutation.mutate({ userId: selectedUser._id, newRole });
  };

  // Filter users by search term and role tab
  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query);

    const userRole = user.role || 'user';
    const matchesRole = roleFilter === 'all' || userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Summary counts for filter pills
  const adminCount = users.filter((u) => u.role === 'admin').length;
  const riderCount = users.filter((u) => u.role === 'rider').length;
  const standardCount = users.filter((u) => !u.role || u.role === 'user').length;

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="text-sm text-base-content/60 font-medium">Loading registered accounts...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 max-w-2xl mx-auto mt-10">
        <div className="alert alert-error shadow-sm rounded-xl">
          <FaExclamationTriangle className="w-5 h-5" />
          <span>Failed to load users: {error.response?.data?.message || error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* Floating Toast Notification */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert shadow-lg text-white border-0 ${
              toast.type === 'success' ? 'bg-emerald-600' : 'bg-rose-600'
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
      <div className="bg-base-100 p-6 rounded-2xl shadow-sm border border-base-200 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary shrink-0">
            <FaUsers className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-base-content tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-base-content/60 mt-0.5">
              Control administrative privileges, review rider accounts, and search registered members.
            </p>
          </div>
        </div>

        {/* Quick Metric Pills */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="px-3.5 py-2 rounded-xl bg-base-200/70 border border-base-300/60 text-xs font-semibold text-base-content/80">
            Total: <span className="text-primary font-bold ml-1">{users.length}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200/70 text-xs font-semibold text-rose-700">
            Admins: <span className="font-bold ml-1">{adminCount}</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200/70 text-xs font-semibold text-amber-700">
            Riders: <span className="font-bold ml-1">{riderCount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-base-100 p-4 rounded-2xl border border-base-200 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Role Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-base-200/60 p-1 rounded-xl">
          {[
            { id: 'all', label: `All (${users.length})` },
            { id: 'admin', label: `Admins (${adminCount})` },
            { id: 'rider', label: `Riders (${riderCount})` },
            { id: 'user', label: `Users (${standardCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                roleFilter === tab.id
                  ? 'bg-base-100 text-primary shadow-sm'
                  : 'text-base-content/60 hover:text-base-content'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-base-content/40">
            <FaSearch className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-sm h-10 w-full pl-9 pr-8 rounded-xl focus:input-primary text-sm bg-base-50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/40 hover:text-base-content"
              title="Clear search"
            >
              <FaTimes className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Users Table Card */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table w-full">
            {/* Table Head */}
            <thead className="bg-base-200/50 text-base-content/70 uppercase text-[11px] font-bold tracking-wider border-b border-base-200">
              <tr>
                <th className="py-4 pl-6 w-12">#</th>
                <th>Member</th>
                <th>Contact Email</th>
                <th>Current Role</th>
                <th>Joined Date</th>
                <th className="text-right pr-6">Access Control</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-base-200/70">
              {filteredUsers.map((user, index) => {
                const isSuperAdmin =
                  user.email?.toLowerCase().trim() === SUPER_ADMIN_EMAIL.toLowerCase();
                const isAdmin = user.role === 'admin';

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-base-200/30 transition-colors duration-150"
                  >
                    <th className="pl-6 font-medium text-xs text-base-content/50">
                      {index + 1}
                    </th>

                    {/* Profile */}
                    <td>
                      <div className="flex items-center gap-3.5">
                        <div className="avatar">
                          <div className="mask mask-squircle w-11 h-11 bg-base-200 ring-1 ring-base-300/60">
                            <img
                              src={user.image || 'https://i.ibb.co/SwcVjPmM/agent-pending.png'}
                              alt={user.name || 'User'}
                              onError={(e) => {
                                e.target.src = 'https://i.ibb.co/SwcVjPmM/agent-pending.png';
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-base-content flex items-center gap-2">
                            {user.name || 'Valued User'}
                            {isSuperAdmin && (
                              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide rounded-md bg-primary/10 text-primary">
                                Owner
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-base-content/45 font-mono mt-0.5">
                            #{user._id.slice(-6).toUpperCase()}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <div className="flex items-center gap-2 text-sm text-base-content/80">
                        <FaEnvelope className="w-3.5 h-3.5 text-base-content/35 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td>
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          <FaShieldAlt className="w-3 h-3 text-rose-600" />
                          Admin
                        </span>
                      ) : user.role === 'rider' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          <FaUserCheck className="w-3 h-3 text-amber-600" />
                          Rider
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          User
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td>
                      <div className="flex items-center gap-2 text-xs font-medium text-base-content/65">
                        <FaCalendarAlt className="w-3.5 h-3.5 text-base-content/35" />
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'N/A'}
                      </div>
                    </td>

                    {/* Action Buttons */}
                    <td className="text-right pr-6">
                      {isSuperAdmin ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-base-200/70 text-base-content/50 cursor-not-allowed select-none">
                          <FaShieldAlt className="w-3 h-3" /> Protected
                        </span>
                      ) : isAdmin ? (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 transition-all duration-150 shadow-2xs cursor-pointer"
                        >
                          <FaUserMinus className="w-3.5 h-3.5" />
                          Revoke Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-primary bg-primary/10 hover:bg-primary hover:text-white border border-primary/20 hover:border-primary transition-all duration-150 shadow-2xs cursor-pointer"
                        >
                          <FaUserShield className="w-3.5 h-3.5" />
                          Promote to Admin
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-16 px-4">
            <div className="w-12 h-12 rounded-full bg-base-200 flex items-center justify-center mx-auto mb-3 text-base-content/40">
              <FaSearch className="w-5 h-5" />
            </div>
            <p className="text-base font-semibold text-base-content/80">No matching users found</p>
            <p className="text-xs text-base-content/50 mt-1">
              {searchTerm
                ? `No accounts matched "${searchTerm}" under the selected filter.`
                : 'No users exist in this category yet.'}
            </p>
            {(searchTerm || roleFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setRoleFilter('all');
                }}
                className="btn btn-sm btn-ghost text-primary mt-3"
              >
                Reset filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Professional Confirmation Modal */}
      {selectedUser && (
        <div className="modal modal-open modal-bottom sm:modal-middle bg-black/40 backdrop-blur-xs">
          <div className="modal-box rounded-2xl border border-base-200 shadow-2xl max-w-md p-6">
            {/* Modal Icon & Title */}
            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  selectedUser.role === 'admin'
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-primary/10 text-primary'
                }`}
              >
                {selectedUser.role === 'admin' ? (
                  <FaExclamationTriangle className="w-6 h-6" />
                ) : (
                  <FaUserShield className="w-6 h-6" />
                )}
              </div>
              <div>
                <h3 className="font-bold text-lg text-base-content">
                  {selectedUser.role === 'admin'
                    ? 'Revoke Administrator Access?'
                    : 'Grant Administrator Access?'}
                </h3>
                <p className="text-sm text-base-content/65 mt-1 leading-relaxed">
                  {selectedUser.role === 'admin' ? (
                    <>
                      You are about to remove admin privileges from{' '}
                      <span className="font-semibold text-base-content">
                        {selectedUser.name || selectedUser.email}
                      </span>
                      . They will be reverted to a standard user account.
                    </>
                  ) : (
                    <>
                      You are about to promote{' '}
                      <span className="font-semibold text-base-content">
                        {selectedUser.name || selectedUser.email}
                      </span>{' '}
                      to <span className="font-semibold text-primary">Admin</span>. They will gain
                      full access to manage users, riders, and system settings.
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Target User Preview Box */}
            <div className="mt-5 p-3.5 rounded-xl bg-base-200/60 border border-base-300/60 flex items-center gap-3">
              <img
                src={selectedUser.image || 'https://i.ibb.co/SwcVjPmM/agent-pending.png'}
                alt={selectedUser.name}
                className="w-10 h-10 rounded-lg object-cover bg-base-300"
                onError={(e) => {
                  e.target.src = 'https://i.ibb.co/SwcVjPmM/agent-pending.png';
                }}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-base-content truncate">
                  {selectedUser.name || 'Valued User'}
                </p>
                <p className="text-xs text-base-content/60 truncate">{selectedUser.email}</p>
              </div>
              <span className="text-[11px] font-bold uppercase px-2.5 py-1 rounded-md bg-base-100 border border-base-300 text-base-content/70">
                {selectedUser.role || 'user'} → {selectedUser.role === 'admin' ? 'user' : 'admin'}
              </span>
            </div>

            {/* Modal Footer Buttons */}
            <div className="modal-action mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedUser(null)}
                disabled={roleMutation.isPending}
                className="btn btn-sm h-10 px-4 rounded-xl btn-ghost text-base-content/70 hover:bg-base-200"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmRoleChange}
                disabled={roleMutation.isPending}
                className={`btn btn-sm h-10 px-5 rounded-xl text-white border-0 shadow-sm ${
                  selectedUser.role === 'admin'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'btn-primary'
                }`}
              >
                {roleMutation.isPending ? (
                  <>
                    <span className="loading loading-spinner loading-xs"></span>
                    Updating...
                  </>
                ) : selectedUser.role === 'admin' ? (
                  'Yes, Revoke Admin'
                ) : (
                  'Yes, Confirm Promotion'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersList;