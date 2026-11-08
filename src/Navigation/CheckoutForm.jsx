import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import UseAxios from '../Hooks/UseAxios';

const CheckoutForm = ({ parcel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = UseAxios();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState('');
  const [loadingSecret, setLoadingSecret] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  useEffect(() => {
    if (parcel?.cost) {
      setLoadingSecret(true);
      setCardError('');
      
      axiosSecure.post('/create-payment-intent', { cost: parcel.cost })
        .then((res) => {
          if (res.data?.clientSecret) {
            setClientSecret(res.data.clientSecret);
          } else {
            throw new Error('Client secret not received from server.');
          }
          setLoadingSecret(false);
        })
        .catch((err) => {
          console.error('Intent initialization error:', err);
          setCardError(err.response?.data?.error || err.message || 'Failed to connect to backend server.');
        })
        .finally(() => {
          setLoadingSecret(false); 
        
        });
        
    }
  }, [parcel, axiosSecure]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    setProcessing(true);
    setCardError('');

    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: card,
          billing_details: {
            name: parcel?.senderName || 'Valued Customer',
            email: parcel?.senderEmail || 'customer@kmsfast.com',
          },
        },
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        const paymentData = {
          transactionId: paymentIntent.id,
          amount: parcel.cost,
        };

        const res = await axiosSecure.patch(`/parcels/payment/${parcel._id}`, paymentData);
        
        if (res.data.modifiedCount > 0 || res.data.acknowledged) {
          Swal.fire({
            title: 'Payment Successful!',
            text: `Transaction ID: ${paymentIntent.id}`,
            icon: 'success',
            confirmButtonColor: '#CAEB66',
            customClass: { popup: 'rounded-3xl', confirmButton: 'rounded-2xl px-5 py-3 text-gray-900 font-bold' }
          }).then(() => {
            navigate('/dashboard/my-parcels');
          });
        } else {
          throw new Error('Server failed to update parcel payment status.');
        }
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setCardError(err.message || 'An error occurred during payment processing.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
        <label className="block text-xs font-bold text-gray-700 mb-2 uppercase tracking-wider">Debit or Credit Card</label>
        <CardElement
          options={{
            hidePostalCode: true,
            style: {
              base: {
                fontSize: '14px',
                color: '#1f2937',
                '::placeholder': { color: '#9ca3af' },
              },
              invalid: { color: '#ef4444' },
            },
          }}
          className="p-3 bg-white border border-gray-200 rounded-xl"
        />
      </div>

      {cardError && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600 font-medium">
          {cardError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || !clientSecret || loadingSecret || processing}
        className="w-full py-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl shadow-sm transition-all disabled:opacity-50 cursor-pointer"
      >
        {loadingSecret ? 'Preparing Secure Gateway...' : processing ? 'Processing Payment...' : `Pay ৳${parcel?.cost || 0} Securely`}
      </button>
    </form>
  );
};

export default CheckoutForm;