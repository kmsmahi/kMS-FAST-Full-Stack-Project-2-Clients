
import React, { useState, useEffect } from "react";
import {
    CardElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import UseAxios from "../Hooks/UseAxios";

const CheckoutForm = ({ parcel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = UseAxios();
    const navigate = useNavigate();

    const [clientSecret, setClientSecret] = useState("");
    const [loadingSecret, setLoadingSecret] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [cardError, setCardError] = useState("");

    useEffect(() => {
        if (!parcel?._id) return;

        let cancelled = false;

        const createPaymentIntent = async () => {
            setLoadingSecret(true);
            setCardError("");
            setClientSecret("");

            try {
                const res = await axiosSecure.post(
                    "/create-payment-intent",
                    {
                        parcelId: parcel._id
                    }
                );

                if (!cancelled) {
                    if (!res.data?.clientSecret) {
                        throw new Error("Client secret not received.");
                    }

                    setClientSecret(res.data.clientSecret);
                }
            } catch (error) {
                if (!cancelled) {
                    console.error("Payment Intent Error:", error);

                    setCardError(
                        error.response?.data?.error ||
                        error.message ||
                        "Unable to initialize payment."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoadingSecret(false);
                }
            }
        };

        createPaymentIntent();

        return () => {
            cancelled = true;
        };

    }, [parcel?._id, axiosSecure]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        const card = elements.getElement(CardElement);

        if (!card) return;

        setProcessing(true);
        setCardError("");

        try {
            const { error, paymentIntent } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card,
                        billing_details: {
                            name: parcel?.senderName || "Customer",
                            email: parcel?.senderEmail || ""
                        }
                    }
                });

            if (error) {
                setCardError(error.message);
                return;
            }

            if (paymentIntent?.status === "succeeded") {

                const response = await axiosSecure.patch(
                    `/parcels/payment/${parcel._id}`,
                    {
                        transactionId: paymentIntent.id
                    }
                );

                if (response.data.success) {
                    await Swal.fire({
                        title: "Payment Successful!",
                        text: `Transaction ID: ${paymentIntent.id}`,
                        icon: "success",
                        confirmButtonColor: "#CAEB66"
                    });

                    navigate("/dashboard/my-parcels");
                } else {
                    throw new Error("Payment verification failed.");
                }
            }

        } catch (error) {
            console.error("Payment Error:", error);

            setCardError(
                error.response?.data?.error ||
                error.message ||
                "Payment processing failed."
            );
        } finally {
            setProcessing(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-2xl">
                <label className="block text-xs font-bold text-gray-700 mb-2 uppercase">
                    Debit or Credit Card
                </label>

                <CardElement
                    options={{
                        hidePostalCode: true,
                        style: {
                            base: {
                                fontSize: "14px",
                                color: "#1f2937",
                                "::placeholder": {
                                    color: "#9ca3af"
                                }
                            },
                            invalid: {
                                color: "#ef4444"
                            }
                        }
                    }}
                    className="p-3 bg-white border border-gray-200 rounded-xl"
                />
            </div>

            {cardError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-600">
                    {cardError}
                </div>
            )}

            <button
                type="submit"
                disabled={
                    !stripe ||
                    !clientSecret ||
                    loadingSecret ||
                    processing
                }
                className="w-full py-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl disabled:opacity-50 cursor-pointer"
            >
                {loadingSecret
                    ? "Preparing Secure Gateway..."
                    : processing
                    ? "Processing Payment..."
                    : `Pay ৳${parcel?.cost || 0} Securely`}
            </button>

        </form>
    );
};

export default CheckoutForm;
