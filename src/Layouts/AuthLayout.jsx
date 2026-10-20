import React from 'react';
import Logo from '../HomePage/Logo';
import { Outlet, NavLink } from 'react-router';
import AuthImg from '../AuthPage/AuthImg';

const AuthLayout = () => {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white overflow-x-hidden">
            
            {/* Left Section: Form & Brand Logo */}
            <div className="lg:col-span-6 xl:col-span-5 flex flex-col justify-between px-4 sm:px-8 md:px-12 py-8 lg:py-12">
                
                {/* Top Branding / Logo Header */}
                <div>
                    <NavLink
                        to="/aboutus"
                        className="inline-flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-[#CAEB66] rounded-xl p-1"
                        aria-label="KMS-FAST Home"
                    >
                        <div className="w-12 h-8 sm:w-16 sm:h-9 flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
                            <Logo />
                        </div>
                        <span className="text-2xl -ms-4 pt-4 sm:text-3xl font-bold tracking-tight text-gray-900 font-sans">
                            KMS<span className="text-[#96b830] font-extrabold">-FAST</span>
                        </span>
                    </NavLink>
                </div>

                {/* Main Dynamic Outlet Content (Register / Login) */}
                <div className="my-auto py-8 w-full max-w-md mx-auto">
                    <Outlet />
                </div>

                {/* Footer text or copyright */}
                <div className="text-center lg:text-left text-xs text-gray-400">
                    &copy; {new Date().getFullYear()} KMS-FAST Logistics. All rights reserved.
                </div>
            </div>

            {/* Right Section: Visual Banner (Hidden on small mobile screens for performance & clean layout) */}
            <div className="hidden lg:lg:col-span-6 xl:col-span-7 lg:flex items-center justify-center bg-slate-50 border-l border-gray-100 p-8">
                <div className="w-full max-w-xl">
                    <AuthImg />
                </div>
            </div>

        </div>
    );
};

export default AuthLayout;