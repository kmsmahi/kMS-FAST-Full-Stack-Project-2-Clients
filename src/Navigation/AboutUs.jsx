import React from 'react';
import { motion } from 'framer-motion';
import { FiTruck, FiShield, FiClock, FiCheckCircle } from 'react-icons/fi';

const stats = [
    { label: 'Successful Deliveries', value: '50K+' },
    { label: 'Active Coverage Hubs', value: '64+' },
    { label: 'Satisfied Clients', value: '99.8%' },
    { label: 'On-Time Rate', value: '99.9%' },
];

const coreValues = [
    {
        icon: <FiTruck className="w-6 h-6 text-gray-900" />,
        title: 'Lightning Fast Transit',
        description: 'Optimized routing algorithms ensure your parcels move through the quickest path possible.'
    },
    {
        icon: <FiShield className="w-6 h-6 text-gray-900" />,
        title: 'Secure Handling',
        description: 'Every package is tracked, monitored, and handled with utmost care from pickup to doorstep.'
    },
    {
        icon: <FiClock className="w-6 h-6 text-gray-900" />,
        title: 'Real-Time Tracking',
        description: 'Stay updated every step of the way with live status indicators and instant alerts.'
    }
];

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white pt-28 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-20">
                
                {/* Hero Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center max-w-3xl mx-auto space-y-4"
                >
                    <span className="px-4 py-1.5 rounded-full text-xs font-bold bg-[#CAEB66]/30 text-gray-900 uppercase tracking-widest border border-[#CAEB66]">
                        About KMS-FAST
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight">
                        Redefining Logistics with <span className="text-[#96b830]">Speed & Trust</span>
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                        Enjoy fast, reliable parcel delivery with real-time tracking and zero hassle. From personal packages to business shipments — we deliver on time, every time.
                    </p>
                </motion.div>

                {/* Mission / Story Split Section */}
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-gray-50/70 border border-gray-100 rounded-3xl p-8 sm:p-12 shadow-sm"
                >
                    <div className="lg:col-span-6 space-y-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                            Our Journey & Commitment
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            We started with a simple promise — to make parcel delivery fast, reliable, and stress-free. Over the years, our commitment to real-time tracking, efficient logistics, and customer-first service has made us a trusted partner for thousands.
                        </p>
                        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                            Whether it's a personal gift or a time-sensitive business delivery, we ensure it reaches its destination — on time, every time.
                        </p>
                        
                        <div className="flex flex-col gap-3 pt-2">
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                                <FiCheckCircle className="w-5 h-5 text-[#96b830]" /> Enterprise-grade security protocols
                            </div>
                            <div className="flex items-center gap-3 text-sm font-semibold text-gray-800">
                                <FiCheckCircle className="w-5 h-5 text-[#96b830]" /> 24/7 dedicated customer assistance
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6">
                        <div className="relative bg-[#CAEB66]/20 border border-[#CAEB66]/40 rounded-3xl p-8 sm:p-10 flex flex-col justify-center gap-6 overflow-hidden">
                            <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-[#CAEB66]/30 rounded-full blur-2xl"></div>
                            <h3 className="text-xl font-bold text-gray-900 z-10">Driven by Modern Technology</h3>
                            <p className="text-sm text-gray-700 z-10 leading-relaxed">
                                Leveraging cutting-edge web infrastructure, automated sorting models, and responsive fleet management to provide an unmatched SaaS logistics experience.
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Statistics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                            className="bg-white border border-gray-200/80 rounded-2xl p-6 text-center shadow-sm hover:border-[#CAEB66] transition-all"
                        >
                            <h4 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-1">{stat.value}</h4>
                            <p className="text-xs sm:text-sm font-medium text-gray-500">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Core Values Cards */}
                <div className="space-y-8">
                    <div className="text-center max-w-xl mx-auto">
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Why Choose KMS-FAST?</h2>
                        <p className="text-sm text-gray-500 mt-1">Built for speed, backed by reliability.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {coreValues.map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.15 }}
                                className="bg-gray-50/50 border border-gray-200/80 rounded-3xl p-6 sm:p-8 flex flex-col gap-4 hover:shadow-md transition-all group"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-[#CAEB66] flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                    {item.icon}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AboutUs;