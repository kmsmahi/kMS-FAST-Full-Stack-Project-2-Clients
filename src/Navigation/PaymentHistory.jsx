import React, { useState, useEffect } from 'react';
import UseAuth from '../Hooks/UseAuth';
import UseAxios from '../Hooks/UseAxios';
import { FiCheckCircle, FiClock, FiCreditCard, FiHash } from 'react-icons/fi';

const PaymentHistory = () => {
  const { user } = UseAuth();
  const axiosSecure = UseAxios();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      axiosSecure.get(`/payments?email=${user.email}`)
        .then((res) => {
          setPayments(Array.isArray(res.data) ? res.data : []);
          setLoading(false);
        })
        .catch((err) => {
          console.error('Error fetching payment history:', err);
          setPayments([]);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [user, axiosSecure]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#96b830]"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="text-xs text-gray-500">Track all your completed financial transactions and receipts</p>
        </div>
        <div className="px-4 py-2 bg-white border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 shadow-xs">
          Total Transactions: <span className="text-[#96b830] font-bold">{payments.length}</span>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl shadow-sm overflow-hidden">
        {payments.length === 0 ? (
          <div className="text-center py-16">
            <FiCreditCard className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm font-medium">No payment history found yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-xs md:table-sm w-full">
              <thead>
                <tr className="bg-gray-50 text-gray-600 border-b border-gray-100">
                  <th>#</th>
                  <th>Parcel Reference</th>
                  <th>Method</th>
                  <th>Amount</th>
                  <th>Transaction ID</th>
                  <th>Date & Time</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => {
                  const formattedDate = payment.paidAt 
                    ? new Date(payment.paidAt).toLocaleString('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      })
                    : 'N/A';

                  return (
                    <tr key={payment._id || index} className="hover:bg-gray-50/50 transition-colors">
                      <th className="font-medium text-gray-500">{index + 1}</th>
                      <td className="font-semibold text-gray-900">{payment.parcelName || 'Express Shipment'}</td>
                      <td>
                        <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded-lg text-xs font-bold uppercase">
                          {payment.method || 'Card'}
                        </span>
                      </td>
                      <td className="font-extrabold text-gray-900">৳{payment.amount}</td>
                      <td>
                        <span className="font-mono text-xs bg-gray-50 border border-gray-200 px-2 py-1 rounded-lg text-gray-600 flex items-center gap-1 w-fit">
                          <FiHash className="w-3 h-3 text-gray-400" /> {payment.transactionId}
                        </span>
                      </td>
                      <td className="text-gray-500 text-xs flex items-center gap-1.5 pt-4">
                        <FiClock className="w-3.5 h-3.5 text-gray-400" /> {formattedDate}
                      </td>
                      <td className="text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold">
                          <FiCheckCircle className="w-3.5 h-3.5" /> Paid
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentHistory;