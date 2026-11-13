import React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useLoaderData } from 'react-router';
import { FiUser, FiMail, FiPhone, FiMapPin, FiAward, FiTruck, FiFileText, FiCheckCircle } from 'react-icons/fi';
import Swal from 'sweetalert2';
import UseAuth from '../Hooks/UseAuth';
import UseAxios from '../Hooks/UseAxios';

const BeARider = () => {
    const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues: {
            name: '',
            email: '',
            phone: '',
            region: '',
            district: '',
            drivingLicense: '',
            bikeModel: '',
            bikeYear: '',
            bikeRegistration: '',
            bio: ''
        }
    });

    const serviceCenters = useLoaderData() || [];
    const { user } = UseAuth();
    const axiosSecure = UseAxios();

    // Extract unique regions safely
    const regions = [...new Set(serviceCenters.map((r) => r.region))];

    // Watch region for district filtering
    const selectedRegion = useWatch({ control, name: 'region' });

    const districtsByRegion = (region) => {
        if (!region) return [];
        return serviceCenters
            .filter((c) => c.region === region)
            .map((d) => d.district);
    };

    // --- FORM SUBMISSION ---
    const onSubmit = (data) => {
        Swal.fire({
            title: '<span class="text-xl font-bold text-gray-900">Submit Rider Application?</span>',
            html: `
                <div class="text-left bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-2 mt-2">
                    <p><strong>Name:</strong> ${data.name || user?.displayName || 'Applicant'}</p>
                    <p><strong>Email:</strong> ${data.email || user?.email}</p>
                    <p><strong>Location:</strong> ${data.district}, ${data.region}</p>
                    <p><strong>Vehicle:</strong> ${data.bikeModel} (${data.bikeYear})</p>
                </div>
            `,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#CAEB66',
            cancelButtonColor: '#f3f4f6',
            confirmButtonText: '<span class="text-gray-900 font-bold">Yes, Submit Application</span>',
            cancelButtonText: '<span class="text-gray-600 font-semibold">Review</span>',
            customClass: {
                popup: 'rounded-3xl',
                confirmButton: 'rounded-2xl px-5 py-3',
                cancelButton: 'rounded-2xl px-5 py-3'
            }
        }).then(async (result) => {
            if (result.isConfirmed) {
                const applicationData = {
                    ...data,
                    email: data.email || user?.email || '',
                    name: data.name || user?.displayName || 'Applicant',
                    status: 'pending',
                    appliedAt: new Date()
                };

                try {
                    // Send to backend (e.g., POST /riders)
                    const response = await axiosSecure.post('/riders', applicationData);

                    if (response.data.success || response.status === 201 || response.status === 200) {
                        Swal.fire({
                            title: 'Application Received!',
                            text: 'We have received your rider application. Our team will review your credentials and contact you soon.',
                            icon: 'success',
                            confirmButtonColor: '#CAEB66',
                            customClass: { popup: 'rounded-3xl', confirmButton: 'rounded-2xl px-5 py-3 text-gray-900 font-bold' }
                        });
                        reset();
                    }
                } catch (error) {
                    console.error('Rider application error:', error);
                    Swal.fire({
                        title: 'Error!',
                        text: error.response?.data?.message || 'Failed to submit application. Please try again.',
                        icon: 'error',
                        confirmButtonColor: '#CAEB66',
                        customClass: { popup: 'rounded-3xl', confirmButton: 'rounded-2xl px-5 py-3 text-gray-900 font-bold' }
                    });
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-10">
                
                {/* Hero Section */}
                <div className="text-center space-y-3">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#CAEB66]/20 text-gray-900 rounded-full text-xs font-bold">
                        <FiAward className="w-4 h-4 text-[#96b830]" /> Join Our Delivery Fleet
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                        Become a Delivery Rider
                    </h1>
                    <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
                        Enjoy flexible hours, reliable earnings, and fast payouts. Join our growing network of professional couriers delivering parcels safely across the country.
                    </p>
                </div>

                {/* Application Form Card */}
                <form onSubmit={handleSubmit(onSubmit)} className="bg-gray-50/60 border border-gray-200/80 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
                    
                    {/* Section 1: Personal Information */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                            <FiUser className="text-[#96b830]" /> 1. Personal Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                                <input 
                                    type="text" 
                                    {...register('name', { required: true })} 
                                    defaultValue={user?.displayName || ''}
                                    placeholder="e.g., Kazi Mahi" 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">Name is required.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                                <input 
                                    type="email" 
                                    {...register('email', { required: true })} 
                                    defaultValue={user?.email || ''}
                                    placeholder="e.g., mahi@example.com" 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">Email is required.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
                                <input 
                                    type="tel" 
                                    {...register('phone', { required: true })} 
                                    placeholder="01XXXXXXXXX" 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                />
                                {errors.phone && <p className="text-red-500 text-xs mt-1">Phone number is required.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Driving License Number</label>
                                <input 
                                    type="text" 
                                    {...register('drivingLicense', { required: true })} 
                                    placeholder="e.g., DL-9832104" 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                />
                                {errors.drivingLicense && <p className="text-red-500 text-xs mt-1">Driving license number is required.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Operating Region & District */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                            <FiMapPin className="text-[#96b830]" /> 2. Preferred Operating Zone
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Region</label>
                                <select 
                                    value={selectedRegion || ""}
                                    {...register('region', { required: true })} 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                >
                                    <option value="" disabled>Select Region</option>
                                    {regions.map((region, i) => (
                                        <option key={i} value={region}>{region}</option>
                                    ))}
                                </select>
                                {errors.region && <p className="text-red-500 text-xs mt-1">Region is required.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">District</label>
                                <select 
                                    {...register('district', { required: true })} 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                >
                                    <option value="" disabled>Select District</option>
                                    {districtsByRegion(selectedRegion).map((district, i) => (
                                        <option key={i} value={district}>{district}</option>
                                    ))}
                                </select>
                                {errors.district && <p className="text-red-500 text-xs mt-1">District is required.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Vehicle Information */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                            <FiTruck className="text-[#96b830]" /> 3. Motorcycle Details
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Bike Brand & Model</label>
                                <input 
                                    type="text" 
                                    {...register('bikeModel', { required: true })} 
                                    placeholder="e.g., Yamaha FZS V3" 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                />
                                {errors.bikeModel && <p className="text-red-500 text-xs mt-1">Bike model is required.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Model Year</label>
                                <input 
                                    type="number" 
                                    {...register('bikeYear', { required: true })} 
                                    placeholder="e.g., 2023" 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                />
                                {errors.bikeYear && <p className="text-red-500 text-xs mt-1">Year is required.</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">Registration Number</label>
                                <input 
                                    type="text" 
                                    {...register('bikeRegistration', { required: true })} 
                                    placeholder="e.g., Dhaka Metro-H 12-3456" 
                                    className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                                />
                                {errors.bikeRegistration && <p className="text-red-500 text-xs mt-1">Registration number required.</p>}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Tell Us About Yourself */}
                    <div className="space-y-4">
                        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2 border-b border-gray-200 pb-2">
                            <FiFileText className="text-[#96b830]" /> 4. Tell Us About Yourself
                        </h2>
                        <div>
                            <textarea 
                                rows={4}
                                {...register('bio', { required: true })}
                                placeholder="Briefly describe your riding experience, familiarity with local routes, and why you want to join us..."
                                className="w-full px-4 py-3 text-sm bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                            ></textarea>
                            {errors.bio && <p className="text-red-500 text-xs mt-1">Please tell us a bit about yourself.</p>}
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full py-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl transition-all shadow-sm cursor-pointer flex items-center justify-center gap-2"
                        >
                            <FiCheckCircle className="w-5 h-5" /> Submit Rider Application
                        </button>
                    </div>

                </form>

            </div>
        </div>
    );
};

export default BeARider;