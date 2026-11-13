import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import UseAxios from '../Hooks/UseAxios';
import { FiShield, FiSmartphone, FiCreditCard } from 'react-icons/fi';
import Swal from 'sweetalert2';
import UseAuth from "../Hooks/UseAuth";

// Replace with your actual publishable key from Stripe Dashboard
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_sample');

const Payment = () => {
  const [searchParams] = useSearchParams();
  const parcelId = searchParams.get('parcelId');
  const axiosSecure = UseAxios();
  const navigate = useNavigate();
  const { user } = UseAuth();
  const [parcel, setParcel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState('card'); // 'card', 'bkash', 'nagad'
  const [mobileNumber, setMobileNumber] = useState('');
  const [pin, setPin] = useState('');

  useEffect(() => {
    if (parcelId) {
      axiosSecure.get('/parcels')
        .then((res) => {
          const found = res.data.find(p => p._id === parcelId);
          setParcel(found || null);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [parcelId, axiosSecure]);

  const handleMobilePayment = async (provider) => {
    if (!mobileNumber || mobileNumber.length < 11) {
      Swal.fire('Error', `Please enter a valid ${provider} account number`, 'error');
      return;
    }
    if (!pin || pin.length < 4) {
      Swal.fire('Error', 'Please enter your secure 4-digit PIN', 'error');
      return;
    }

    try {
      const txId = `${provider.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
      
      // 1. Update parcel payment status
      const res = await axiosSecure.patch(`/parcels/payment/${parcelId}`, {
        transactionId: txId,
        amount: parcel?.cost
      });

      if (res.data.modifiedCount > 0 || res.data.success) {
        
        // 2. Save record to the new 'payments' collection
        const paymentRecord = {
          parcelId: parcelId,
          parcelName: parcel?.parcelName || 'Express Shipment',
          customerEmail: parcel?.senderEmail || user?.email,
          amount: parcel?.cost,
          transactionId: txId,
          method: provider.toUpperCase()
        };

        await axiosSecure.post('/payments', paymentRecord);

        Swal.fire({
          title: 'Payment Successful!',
          text: `Paid via ${provider} | TxID: ${txId}`,
          icon: 'success',
          confirmButtonColor: '#CAEB66',
          customClass: { popup: 'rounded-3xl', confirmButton: 'rounded-2xl px-5 py-3 text-gray-900 font-bold' }
        }).then(() => {
          navigate('/dashboard/my-parcels');
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Mobile payment processing failed', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <span className="loading loading-spinner loading-lg text-[#96b830]"></span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
        <p className="text-xs text-gray-500">Choose your preferred secure gateway to finalize delivery</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Parcel Summary Box */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Parcel Reference</span>
            <p className="text-sm font-bold text-gray-900">{parcel?.parcelName || 'Express Shipment'}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Amount</span>
            <p className="text-lg font-extrabold text-[#96b830]">৳{parcel?.cost || 0}</p>
          </div>
        </div>

        {/* Payment Method Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-3 uppercase tracking-wider">Select Payment Method</label>
          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => setMethod('card')}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                method === 'card' ? 'border-[#96b830] bg-[#CAEB66]/20 text-gray-900 shadow-xs' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FiCreditCard className="w-4 h-4 text-[#96b830]" /> Card (Stripe)
            </button>

            <button
              type="button"
              onClick={() => setMethod('bkash')}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                method === 'bkash' ? 'border-pink-500 bg-pink-50 text-pink-700 shadow-xs' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-pink-600 text-white flex items-center text-[9px] justify-hidden font-extrabold">b</span> bKash
            </button>

            <button
              type="button"
              onClick={() => setMethod('nagad')}
              className={`py-3 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                method === 'nagad' ? 'border-orange-500 bg-orange-50 text-orange-700 shadow-xs' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center text-[9px] justify-hidden font-extrabold">N</span> Nagad
            </button>
          </div>
        </div>

        {/* Conditional Gateway Forms */}
        {method === 'card' && parcel && (
          <Elements stripe={stripePromise}>
            <CheckoutForm parcel={parcel} />
          </Elements>
        )}

        {(method === 'bkash' || method === 'nagad') && (
          <div className="space-y-4 pt-2">
            <div className={`p-4 rounded-2xl border ${method === 'bkash' ? 'bg-pink-50/50 border-pink-100' : 'bg-orange-50/50 border-orange-100'}`}>
              <p className="text-xs font-semibold text-gray-700 mb-1">
                Enter your <span className="capitalize font-bold">{method}</span> Account Number
              </p>
              <input
                type="tel"
                placeholder="01XXXXXXXXX"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#96b830]"
              />
            </div>

            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Enter 4-Digit PIN</label>
              <input
                type="password"
                maxLength={4}
                placeholder="••••"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#96b830]"
              />
            </div>

            <button
              type="button"
              onClick={() => handleMobilePayment(method)}
              className={`w-full py-4 text-white font-bold text-sm rounded-2xl shadow-sm transition-all cursor-pointer ${
                method === 'bkash' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-orange-600 hover:bg-orange-700'
              }`}
            >
              Confirm & Pay ৳{parcel?.cost || 0} via {method.toUpperCase()}
            </button>
          </div>
        )}

        <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-2 border-t border-gray-100">
          <FiShield className="w-4 h-4 text-emerald-600" /> End-to-end 256-bit SSL encrypted financial transaction
        </div>
      </div>
    </div>
  );
};

export default Payment;