import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import { FiBox, FiFileText, FiMapPin, FiDollarSign, FiRefreshCw, FiSliders, FiCheckCircle } from 'react-icons/fi';

const Pricing = () => {
    const { register, control, reset, setValue } = useForm({
        defaultValues: {
            parcelType: 'Document',
            parcelWeight: '1',
            senderRegion: '',
            senderDistrict: '',
            receiverRegion: '',
            receiverDistrict: ''
        }
    });

    const serviceCenters = useLoaderData() || [];
    const regions = [...new Set(serviceCenters.map((r) => r.region))];

    // Watch values for real-time calculation
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

    // --- IDENTICAL PRICING CALCULATION LOGIC ---
    const calculateCost = () => {
        const weight = parseFloat(parcelWeight) || 0;
        const isWithinCity = senderDistrict && receiverDistrict && senderDistrict === receiverDistrict;

        let baseCost = 0;
        let calculationDetails = '';

        if (!senderDistrict || !receiverDistrict) {
            return {
                baseCost: 0,
                calculationDetails: 'Select districts or choose a quick route preset above.',
                isWithinCity: false
            };
        }

        if (parcelType === 'Document') {
            baseCost = isWithinCity ? 60 : 80;
            calculationDetails = isWithinCity ? 'Document delivery within the same city.' : 'Document delivery across different districts.';
        } else {
            if (weight <= 3) {
                baseCost = isWithinCity ? 110 : 150;
                calculationDetails = isWithinCity ? 'Non-Document up to 3kg (Within City).' : 'Non-Document up to 3kg (Outside City).';
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

    // Quick Route Preset Handler
    const handleQuickPreset = (type, weight, sDist, rDist, sReg, rReg) => {
        setValue('parcelType', type);
        setValue('parcelWeight', weight);
        setValue('senderRegion', sReg);
        setValue('senderDistrict', sDist);
        setValue('receiverRegion', rReg);
        setValue('receiverDistrict', rDist);
    };

    const handleResetAll = () => {
        reset({
            parcelType: 'Document',
            parcelWeight: '1',
            senderRegion: '',
            senderDistrict: '',
            receiverRegion: '',
            receiverDistrict: ''
        });
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CAEB66]/20 text-gray-900 rounded-full text-xs font-bold mb-2">
                        <FiSliders className="w-3.5 h-3.5 text-[#96b830]" /> Interactive Rate Matrix
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Instant Cost Estimator
                    </h1>
                    <p className="text-sm text-gray-500 max-w-md mx-auto">
                        Test delivery routes, weight thresholds, and parcel classes in real time before booking.
                    </p>
                </div>

                {/* Quick Presets Bar */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200/80 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">⚡ Popular Routes:</span>
                    <div className="flex flex-wrap gap-2">
                        <button 
                            type="button"
                            onClick={() => handleQuickPreset('Document', '0.5', 'Chittagong', 'Chittagong', 'Chittagong', 'Chittagong')}
                            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#96b830] text-gray-700 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                            📄 Local Document (Chittagong)
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleQuickPreset('Non-Document', '2', 'Dhaka', 'Chittagong', 'Dhaka', 'Chittagong')}
                            className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#96b830] text-gray-700 text-xs font-semibold rounded-xl shadow-xs transition-all cursor-pointer"
                        >
                            📦 Dhaka ➔ Chittagong (2kg)
                        </button>
                    </div>
                </div>

                {/* Main Interactive Card */}
                <div className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
                    
                    {/* Step 1: Choose Class */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            1. Select Shipment Category
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setValue('parcelType', 'Document')}
                                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                    parcelType === 'Document' 
                                        ? 'border-[#96b830] bg-[#CAEB66]/10 ring-2 ring-[#CAEB66]/30' 
                                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${parcelType === 'Document' ? 'bg-[#CAEB66] text-gray-900' : 'bg-gray-200 text-gray-600'}`}>
                                        <FiFileText className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Document</h4>
                                        <p className="text-[11px] text-gray-500">Fixed rate structure</p>
                                    </div>
                                </div>
                                {parcelType === 'Document' && <FiCheckCircle className="w-5 h-5 text-[#96b830]" />}
                            </button>

                            <button
                                type="button"
                                onClick={() => setValue('parcelType', 'Non-Document')}
                                className={`p-4 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                                    parcelType === 'Non-Document' 
                                        ? 'border-[#96b830] bg-[#CAEB66]/10 ring-2 ring-[#CAEB66]/30' 
                                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${parcelType === 'Non-Document' ? 'bg-[#CAEB66] text-gray-900' : 'bg-gray-200 text-gray-600'}`}>
                                        <FiBox className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-900">Non-Document (Parcel)</h4>
                                        <p className="text-[11px] text-gray-500">Weight-based scale</p>
                                    </div>
                                </div>
                                {parcelType === 'Non-Document' && <FiCheckCircle className="w-5 h-5 text-[#96b830]" />}
                            </button>
                        </div>
                    </div>

                    {/* Step 2: Weight Control (Only if Non-Document) */}
                    {parcelType === 'Non-Document' && (
                        <div className="space-y-3 bg-gray-50 p-5 rounded-2xl border border-gray-200 animate-fadeIn">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                                    2. Specify Weight Scale
                                </label>
                                <span className="text-xs font-extrabold text-gray-900 bg-white px-3 py-1 rounded-xl border border-gray-200 shadow-xs">
                                    {parcelWeight || 0} KG
                                </span>
                            </div>
                            <input 
                                type="range" 
                                min="0.5" 
                                max="20" 
                                step="0.5"
                                value={parcelWeight || 1}
                                onChange={(e) => setValue('parcelWeight', e.target.value)}
                                className="w-full accent-[#96b830] cursor-pointer"
                            />
                            <div className="flex justify-between text-[11px] text-gray-400 font-semibold">
                                <span>0.5 kg (Base)</span>
                                <span>10 kg</span>
                                <span>20 kg (Max)</span>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Route Selection Matrix */}
                    <div className="space-y-3">
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                            {parcelType === 'Non-Document' ? '3. Select Route Destinations' : '2. Select Route Destinations'}
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            
                            {/* Pickup Selection */}
                            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                                    <FiMapPin className="text-[#96b830]" /> From (Sender Location)
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <select 
                                        value={senderRegion || ""} 
                                        {...register('senderRegion')}
                                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                    >
                                        <option value="" disabled>Region</option>
                                        {regions.map((reg, i) => <option key={i} value={reg}>{reg}</option>)}
                                    </select>
                                    <select 
                                        value={senderDistrict || ""} 
                                        {...register('senderDistrict')}
                                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                    >
                                        <option value="" disabled>District</option>
                                        {districtsByRegion(senderRegion).map((dist, i) => <option key={i} value={dist}>{dist}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Delivery Selection */}
                            <div className="p-4 bg-gray-50/70 rounded-2xl border border-gray-200 space-y-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                                    <FiMapPin className="text-[#96b830]" /> To (Receiver Destination)
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <select 
                                        value={receiverRegion || ""} 
                                        {...register('receiverRegion')}
                                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                    >
                                        <option value="" disabled>Region</option>
                                        {regions.map((reg, i) => <option key={i} value={reg}>{reg}</option>)}
                                    </select>
                                    <select 
                                        value={receiverDistrict || ""} 
                                        {...register('receiverDistrict')}
                                        className="w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                    >
                                        <option value="" disabled>District</option>
                                        {districtsByRegion(receiverRegion).map((dist, i) => <option key={i} value={dist}>{dist}</option>)}
                                    </select>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* --- LIVE CALCULATION RESULT DISPLAY --- */}
                    <div className="bg-gray-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-[#CAEB66] flex items-center justify-center text-gray-900 font-bold shrink-0">
                                <FiDollarSign className="w-6 h-6" />
                            </div>
                            <div>
                                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Calculated Rate Breakdown</span>
                                <p className="text-xs text-gray-300 mt-0.5">{calculationDetails}</p>
                            </div>
                        </div>
                        <div className="text-3xl font-extrabold text-[#CAEB66] bg-gray-800 px-6 py-3 rounded-2xl border border-gray-700 shrink-0">
                            ৳{baseCost}
                        </div>
                    </div>

                    {/* --- RESET BUTTON AT BOTTOM --- */}
                    <div className="pt-2 flex justify-end">
                        <button
                            type="button"
                            onClick={handleResetAll}
                            className="inline-flex items-center gap-2 px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-2xl transition-all cursor-pointer"
                        >
                            <FiRefreshCw className="w-4 h-4 text-gray-500" /> Reset Calculator
                        </button>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Pricing;