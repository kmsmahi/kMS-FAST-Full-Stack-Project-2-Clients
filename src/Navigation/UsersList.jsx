
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
  FaCheckCircle
} from 'react-icons/fa';

const SUPER_ADMIN_EMAIL = 'salauddinmahi2002@gmail.com';

const THEME = '#96b830';

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

  // Fetch users
  const {
    data: users = [],
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['allUsers'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  // Update user role
  const roleMutation = useMutation({
    mutationFn: async ({ userId, newRole }) => {
      const res = await axiosSecure.patch(
        `/users/admin/${userId}`,
        { role: newRole }
      );
      return res.data;
    },

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['allUsers'] });

      const actionText =
        variables.newRole === 'admin'
          ? 'promoted to Admin'
          : 'demoted to User';

      showToast(
        'success',
        `${selectedUser?.name || 'User'} has been ${actionText}.`
      );

      setSelectedUser(null);
    },

    onError: (err) => {
      showToast(
        'error',
        err.response?.data?.error || 'Failed to update user role.'
      );

      setSelectedUser(null);
    }
  });

  const confirmRoleChange = () => {
    if (!selectedUser) return;

    const newRole =
      selectedUser.role === 'admin' ? 'user' : 'admin';

    roleMutation.mutate({
      userId: selectedUser._id,
      newRole
    });
  };

  // Filter users
  const filteredUsers = users.filter((user) => {
    const query = searchTerm.toLowerCase().trim();

    const matchesSearch =
      !query ||
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query);

    const userRole = user.role || 'user';

    const matchesRole =
      roleFilter === 'all' || userRole === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Summary counts
  const adminCount = users.filter(
    (u) => u.role === 'admin'
  ).length;

  const riderCount = users.filter(
    (u) => u.role === 'rider'
  ).length;

  const standardCount = users.filter(
    (u) => !u.role || u.role === 'user'
  ).length;

  const filterTabs = [
    { id: 'all', label: `All (${users.length})` },
    { id: 'admin', label: `Admins (${adminCount})` },
    { id: 'rider', label: `Riders (${riderCount})` },
    { id: 'user', label: `Users (${standardCount})` }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-[#96b830]"></span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-error">
        <p>
          Failed to load users:{' '}
          {error.response?.data?.message || error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 max-w-7xl mx-auto">

      {/* Toast Notification */}
      {toast && (
        <div className="toast toast-top toast-end z-50">
          <div
            className={`alert shadow-lg text-white ${
              toast.type === 'success'
                ? 'bg-[#96b830]'
                : 'bg-error'
            }`}
          >
            {toast.type === 'success' ? (
              <FaCheckCircle className="w-4 h-4 shrink-0" />
            ) : (
              <FaExclamationTriangle className="w-4 h-4 shrink-0" />
            )}

            <span className="text-sm font-medium">
              {toast.message}
            </span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 bg-base-100 p-5 lg:p-6 rounded-2xl shadow-sm border border-base-200">

        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-base-content">
            <FaUsers className="w-7 h-7 text-[#96b830]" />
            User Management Dashboard
          </h1>

          <p className="text-sm text-base-content/60 mt-2">
            Manage system users, view roles, and monitor registered accounts.
          </p>
        </div>

        <div className="badge badge-lg font-semibold px-4 py-3 bg-[#96b830]/15 text-[#96b830] border border-[#96b830]/30">
          Total Displayed: {filteredUsers.length} / {users.length}
        </div>
      </div>

      {/* Search & Filter */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-center justify-between bg-base-100 p-4 rounded-xl border border-base-200 shadow-sm">

        {/* Role Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setRoleFilter(tab.id)}
              className={`px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold transition-all duration-200 border ${
                roleFilter === tab.id
                  ? 'bg-[#96b830] text-white border-[#96b830] shadow-sm'
                  : 'bg-base-200/50 text-base-content/70 border-transparent hover:border-[#96b830]/50 hover:text-[#96b830]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-base-content/40">
            <FaSearch className="w-4 h-4" />
          </span>

          <input
            type="text"
            placeholder="Search by user name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input input-bordered input-sm h-11 w-full pl-10 text-sm focus:outline-none focus:border-[#96b830] focus:ring-1 focus:ring-[#96b830]/40"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-base-100 rounded-2xl shadow-sm border border-base-200 overflow-hidden">

        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">

            {/* Table Header */}
            <thead className="bg-base-200/60 text-base-content uppercase text-xs tracking-wider">
              <tr>
                <th className="py-4 pl-6">#</th>
                <th>User Profile</th>
                <th>Email Address</th>
                <th>Role</th>
                <th>Joined Date</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody>
              {filteredUsers.map((user, index) => {
                const isSuperAdmin =
                  user.email?.toLowerCase().trim() ===
                  SUPER_ADMIN_EMAIL.toLowerCase();

                const isAdmin = user.role === 'admin';

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-[#96b830]/5 transition-colors"
                  >
                    <th className="pl-6 font-medium text-base-content/70">
                      {index + 1}
                    </th>

                    {/* User Profile */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="mask mask-squircle w-12 h-12 bg-base-300">
                            <img
                              src={
                                user.image ||
                                'https://i.ibb.co/SwcVjPmM/agent-pending.png'
                              }
                              alt={user.name || 'User'}
                              onError={(e) => {
                                e.target.src =
                                  'https://i.ibb.co/SwcVjPmM/agent-pending.png';
                              }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-base-content flex items-center gap-2">
                            {user.name || 'Valued User'}

                            {isSuperAdmin && (
                              <span className="badge badge-xs bg-[#96b830] text-white border-none">
                                Owner
                              </span>
                            )}
                          </div>

                          <div className="text-xs text-base-content/50 flex items-center gap-1">
                            ID: {user._id.slice(-6)}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td>
                      <div className="flex items-center gap-2 text-base-content/80 text-sm">
                        <FaEnvelope className="w-4 h-4 text-base-content/40" />
                        {user.email}
                      </div>
                    </td>

                    {/* Role */}
                    <td>
                      {isAdmin ? (
                        <span className="badge gap-1.5 font-semibold px-3 py-2 bg-[#96b830]/15 text-[#739522] border border-[#96b830]/30">
                          <FaShieldAlt className="w-3.5 h-3.5" />
                          Admin
                        </span>
                      ) : user.role === 'rider' ? (
                        <span className="badge badge-warning gap-1.5 font-semibold px-3 py-2">
                          <FaUserCheck className="w-3.5 h-3.5" />
                          Rider
                        </span>
                      ) : (
                        <span className="badge badge-ghost gap-1.5 font-semibold px-3 py-2">
                          User
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <FaCalendarAlt className="w-4 h-4 text-base-content/40" />

                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              'en-US',
                              {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              }
                            )
                          : 'N/A'}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="text-center">
                      {/* {isSuperAdmin ? (
                        <span className="badge badge-ghost badge-sm font-medium">
                          Protected
                        </span>
                      ) : isAdmin ? (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="btn btn-sm btn-outline btn-error gap-1.5"
                        >
                          <FaUserMinus className="w-3.5 h-3.5" />
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="btn btn-sm gap-1.5 bg-[#96b830] hover:bg-[#829f28] text-white border-none"
                        >
                          <FaUserShield className="w-3.5 h-3.5" />
                          Make Admin
                        </button>
                      )} */}

                      {isSuperAdmin ? (
                        <span className="badge badge-ghost badge-sm font-medium">Protected</span>
                      ) : isAdmin ? (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="btn btn-sm btn-outline border-error/50 text-error hover:bg-error hover:text-white hover:border-error gap-1.5 transition-all duration-200 shadow-2xs"
                        >
                          <FaUserMinus className="w-3.5 h-3.5" />
                          Remove Admin
                        </button>
                      ) : (
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="btn btn-sm btn-outline border-[#96b830]/50 text-[#96b830] hover:bg-[#96b830] hover:text-white hover:border-[#96b830] gap-1.5 transition-all duration-200 shadow-2xs"
                        >
                          <FaUserShield className="w-3.5 h-3.5" />
                          Make Admin
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
          <div className="text-center py-16 text-base-content/50">
            <FaUsers className="w-12 h-12 mx-auto mb-3 opacity-30" />

            <p className="text-lg font-medium">
              No matching users found.
            </p>

            <p className="text-xs mt-1">
              Try adjusting your search query for "{searchTerm}".
            </p>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">

            <h3 className="font-bold text-lg flex items-center gap-2 text-base-content">
              <FaExclamationTriangle className="text-warning w-5 h-5" />
              Confirm Role Change
            </h3>

            <p className="py-4 text-sm text-base-content/70">
              Are you sure you want to change the role for{' '}
              <span className="font-semibold text-base-content">
                {selectedUser.name || selectedUser.email}
              </span>{' '}
              to{' '}
              <span className="font-bold uppercase text-[#96b830]">
                {selectedUser.role === 'admin' ? 'user' : 'admin'}
              </span>
              ?
            </p>

            <div className="modal-action">
              <button
                onClick={() => setSelectedUser(null)}
                disabled={roleMutation.isPending}
                className="btn btn-ghost btn-sm"
              >
                Cancel
              </button>

              <button
                onClick={confirmRoleChange}
                disabled={roleMutation.isPending}
                className={`btn btn-sm border-none text-white ${
                  selectedUser.role === 'admin'
                    ? 'bg-error hover:bg-error/80'
                    : 'bg-[#96b830] hover:bg-[#829f28]'
                }`}
              >
                {roleMutation.isPending
                  ? 'Processing...'
                  : 'Confirm'}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default UsersList;
