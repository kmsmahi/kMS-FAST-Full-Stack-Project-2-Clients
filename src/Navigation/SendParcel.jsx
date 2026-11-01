import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import { FiBox, FiUser, FiMapPin, FiPhone, FiFileText } from 'react-icons/fi';

const SendParcel = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        defaultValues: {
            parcelType: 'Document'
        }
    });

    const serviceCenters = useLoaderData() || [];
    
    // Extract unique regions safely
    const regions = [...new Set(serviceCenters.map((r) => r.region))];

    // Watch region selections for dynamic district filtering
    const senderRegion = useWatch({ control, name: 'senderRegion' });
    const receiverRegion = useWatch({ control, name: 'receiverRegion' });

    const districtsByRegion = (region) => {
        if (!region) return [];
        return serviceCenters
            .filter((c) => c.region === region)
            .map((d) => d.district);
    };

    const onSubmit = (data) => {
        console.log('Parcel Submission Data:', data);
        alert('Parcel submission simulated successfully!');
    };

    return (
        <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center sm:text-left space-y-1">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Send a Parcel</h1>
                    <p className="text-sm text-gray-500">Fill in the shipment and location details below</p>
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
                                    defaultChecked 
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

                            {/* Sender Region */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Region</label>
                                <select 
                                    defaultValue="" 
                                    {...register('senderRegion', { required: true })}
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                >
                                    <option value="" disabled>Pick a Region</option>
                                    {regions.map((region, index) => (
                                        <option key={index} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Sender District */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                                <select 
                                    defaultValue="" 
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

                            {/* Receiver Region */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">Region</label>
                                <select 
                                    defaultValue="" 
                                    {...register('receiverRegion', { required: true })}
                                    className="w-full px-4 py-2.5 text-sm bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                >
                                    <option value="" disabled>Pick a Region</option>
                                    {regions.map((region, index) => (
                                        <option key={index} value={region}>{region}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Receiver District */}
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1">District</label>
                                <select 
                                    defaultValue="" 
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

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type="submit" 
                            className="w-full py-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer"
                        >
                            Confirm & Send Parcel
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default SendParcel;