import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import { FiBox, FiUser, FiMapPin, FiFileText, FiDollarSign } from 'react-icons/fi';
import Swal from 'sweetalert2';
import UseAuth from '../Hooks/UseAuth';
import UseAxios from '../Hooks/UseAxios'; // Make sure the path matches your hook location

const SendParcel = () => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            parcelType: 'Document'
        }
    });

    const serviceCenters = useLoaderData() || [];
    const { user } = UseAuth();
    const axiosSecure = UseAxios();

    // Extract unique regions safely
    const regions = [...new Set(serviceCenters.map((r) => r.region))];

    // Watch values for dynamic pricing and district filtering
    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' });
    const parcelType = useWatch({ control, name: 'parcelType' });
    const senderDistrict = useWatch({ control, name: 'senderDistrict' });
    const receiverDistrict = useWatch({ control, name: 'receiverDistrict' });
    const parcelWeight = useWatch({ control, name: 'parcelWeight' });

    const districtsByRegion = (region) => {
        if (!region) return [];
        return serviceCenters
            .filter((c) => c.region === region)
            .map((d) => d.district);
    };

    // --- PRICING CALCULATION LOGIC ---
    const calculateCost = () => {
        const weight = parseFloat(parcelWeight) || 0;
        const isWithinCity = senderDistrict && receiverDistrict && senderDistrict === receiverDistrict;

        let baseCost = 0;
        let calculationDetails = '';

        if (parcelType === 'Document') {
            baseCost = isWithinCity ? 60 : 80;
            calculationDetails = isWithinCity ? 'Document (Within City)' : 'Document (Outside City/District)';
        } else {
            // Non-Document
            if (weight <= 3) {
                baseCost = isWithinCity ? 110 : 150;
                calculationDetails = isWithinCity ? 'Non-Document up to 3kg (Within City)' : 'Non-Document up to 3kg (Outside City)';
            } else {
                const extraKg = Math.ceil(weight - 3);
                if (isWithinCity) {
                    baseCost = 110 + (extraKg * 40);
                    calculationDetails = `Non-Document > 3kg (Base ৳110 + ৳40 × ${extraKg} extra kg)`;
                } else {
                    baseCost = 150 + (extraKg * 40) + 40;
                    calculationDetails = `Non-Document > 3kg (Base ৳150 + ৳40 × ${extraKg} extra kg + ৳40 extra fee)`;
                }
            }
        }
        return { baseCost, calculationDetails, isWithinCity };
    };

    const { baseCost, calculationDetails, isWithinCity } = calculateCost();

    // --- FORM SUBMISSION & DATABASE SAVING ---
    const onSubmit = (data) => {
        const costInfo = calculateCost();

        Swal.fire({
            title: '<span class="text-xl font-bold text-gray-900">Confirm Parcel Booking</span>',
            html: `
                <div class="text-left bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2 mt-2">
                    <p><strong>Parcel Name:</strong> ${data.parcelName}</p>
                    <p><strong>Type & Weight:</strong> ${data.parcelType} (${data.parcelWeight} kg)</p>
                    <p><strong>Route:</strong> ${data.senderDistrict} ➔ ${data.receiverDistrict} (${costInfo.isWithinCity ? 'Within City' : 'Outside City'})</p>
                    <hr class="border-gray-200 my-1"/>
                    <p><strong>Calculation:</strong> ${costInfo.calculationDetails}</p>
                    <p class="text-sm font-bold text-[#96b830] pt-1">Total Cost: ৳${costInfo.baseCost}</p>
                </div>
            `,
            icon: 'info',
            showCancelButton: true,
            confirmButtonColor: '#CAEB66',
            cancelButtonColor: '#f3f4f6',
            confirmButtonText: '<span class="text-gray-900 font-bold">Confirm & Save</span>',
            cancelButtonText: '<span class="text-gray-600 font-semibold">Cancel</span>',
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-2xl px-5 py-3 hover:bg-[#b8d655]',
                cancelButton: 'rounded-2xl px-5 py-3 text-gray-700'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                // Construct the payload to save in MongoDB
                const parcelData = {
                    ...data,
                    cost: costInfo.baseCost,
                    senderEmail: user?.email || 'anonymous',
                    status: 'pending',
                    createdAt: new Date()
                };

                try {
                    // Send data to backend server
                    const response = await axiosSecure.post('/parcels', parcelData);
                    
                    if (response.data.insertedId || response.data.success || response.status === 200) {
                        Swal.fire({
                            title: 'Success!',
                            text: 'Your parcel has been booked and saved successfully!',
                            icon: 'success',
                            confirmButtonColor: '#CAEB66',
                            customClass: { popup: 'rounded-3xl', confirmButton: 'rounded-2xl px-5 py-3 text-gray-900 font-bold' }
                        });

                        // Reset form fields
                        reset({
                            parcelType: 'Document',
                            parcelName: '',
                            parcelWeight: '',
                            senderName: '',
                            senderAddress: '',
                            senderPhone: '',
                            senderRegion: '',
                            senderDistrict: '',
                            receiverName: '',
                            receiverAddress: '',
                            receiverPhone: '',
                            receiverRegion: '',
                            receiverDistrict: ''
                        });
                    }
                } catch (error) {
                    console.error('Error saving parcel:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: 'Failed to save parcel to database. Please try again.',
                        icon: 'error',
                        confirmButtonColor: '#CAEB66'
                    });
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Send a Parcel</h1>
                    <p className="text-sm text-gray-500">Fill in shipment details & calculate your delivery cost instantly</p>
                </div>

                {/* Main Form Card */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50/50 border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
                    
                    {/* Parcel Type Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-3 uppercase tracking-wider">Parcel Type</label>
                        <div className="flex gap-6">
                            <label className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-[#CAEB66] transition-all">
                                <input 
                                    type="radio" 
                                    value="Document" 
                                    {...register('parcelType')} 
                                    className="radio radio-sm accent-[#96b830]" 
                                />
                                <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <FiFileText className="text-[#96b830]" /> Document
                                </span>
                            </label>
                            <label className="flex items-center gap-3 px-5 py-3 bg-white border border-gray-200 rounded-2xl cursor-pointer hover:border-[#CAEB66] transition-all">
                                <input 
                                    type="radio" 
                                    value="Non-Document" 
                                    {...register('parcelType')} 
                                    className="radio radio-sm accent-[#96b830]" 
                                />
                                <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <FiBox className="text-[#96b830]" /> Non-Document
                                </span>
                            </label>
                        </div>
                    </div>

                    {/* Parcel General Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Parcel Name / Title</label>
                            <input 
                                type="text" 
                                {...register('parcelName', { required: true })} 
                                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                placeholder="e.g., Corporate Documents" 
                            />
                            {errors.parcelName && <p className="text-red-500 text-xs mt-1">Parcel name is required.</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Parcel Weight (kg)</label>
                            <input 
                                type="number" 
                                step="0.1" 
                                {...register('parcelWeight', { required: true, min: 0.1 })} 
                                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                placeholder="e.g., 1.5" 
                            />
                            {errors.parcelWeight && <p className="text-red-500 text-xs mt-1">Valid weight is required.</p>}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-200"></div>

                    {/* Sender & Receiver Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        
                        {/* --- SENDER DETAILS --- */}
                        <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200/60 shadow-xs">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <FiUser className="text-[#96b830]" /> Sender Details
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Sender Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                    placeholder="Full Name"  
                                    {...register('senderName', { required: true })} 
                                />
                                {errors.senderName && <p className="text-red-500 text-xs mt-1">Sender name required.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                    placeholder="Street Address"  
                                    {...register('senderAddress', { required: true })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                    placeholder="01XXXXXXXXX"  
                                    {...register('senderPhone', { required: true })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Region</label>
                                <select 
                                    value={senderRegion || ""} 
                                    {...register('senderRegion', { required: true })}
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                >
                                    <option value="" disabled>Pick a Region</option>
                                    {regions.map((region, index) => (
                                        <option key={index} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                                <select 
                                    value={senderDistrict || ""} 
                                    {...register('senderDistrict', { required: true })} 
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                >
                                    <option value="" disabled>Pick a District</option>
                                    {districtsByRegion(senderRegion).map((district, i) => (
                                        <option key={i} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* --- RECEIVER DETAILS --- */}
                        <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200/60 shadow-xs">
                            <h2 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b pb-2">
                                <FiMapPin className="text-[#96b830]" /> Receiver Details
                            </h2>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Receiver Name</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                    placeholder="Full Name"  
                                    {...register('receiverName', { required: true })} 
                                />
                                {errors.receiverName && <p className="text-red-500 text-xs mt-1">Receiver name required.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Address</label>
                                <input 
                                    type="text" 
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                    placeholder="Street Address" 
                                    {...register('receiverAddress', { required: true })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                    placeholder="01XXXXXXXXX"  
                                    {...register('receiverPhone', { required: true })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Region</label>
                                <select 
                                    value={receiverRegion || ""} 
                                    {...register('receiverRegion', { required: true })}
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                >
                                    <option value="" disabled>Pick a Region</option>
                                    {regions.map((region, index) => (
                                        <option key={index} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                                <select 
                                    value={receiverDistrict || ""} 
                                    {...register('receiverDistrict', { required: true })} 
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                >
                                    <option value="" disabled>Pick a District</option>
                                    {districtsByRegion(receiverRegion).map((district, i) => (
                                        <option key={i} value={district}>{district}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>

                    {/* --- LIVE COST ESTIMATE BANNER --- */}
                    <div className="bg-[#CAEB66]/15 border border-[#CAEB66]/50 rounded-2xl p-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[#CAEB66] flex items-center justify-center text-gray-900 font-bold">
                                <FiDollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-700">Estimated Shipping Cost</h4>
                                <p className="text-xs text-gray-500">{calculationDetails || "Select districts and weight to calculate"}</p>
                            </div>
                        </div>
                        <div className="text-2xl font-extrabold text-gray-900">
                            ৳{baseCost}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button 
                            type="submit" 
                            className="w-full py-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer"
                        >
                            Confirm & Send Parcel (৳{baseCost})
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default SendParcel;