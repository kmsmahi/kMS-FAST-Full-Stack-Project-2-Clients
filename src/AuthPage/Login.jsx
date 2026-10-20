import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import UseAuth from "../Hooks/UseAuth";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { signinUser, googleSignIn } = UseAuth();
    
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Email & Password Login Handler
    const loginBtnHandler = async (data) => {
        setLoading(true);
        setErrorMessage('');
        try {
            const result = await signinUser(data.email, data.password);
            console.log("Logged in user:", result.user);
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            // Friendly error messaging
            if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
                setErrorMessage("Invalid email or password. Please check your credentials.");
            } else {
                setErrorMessage(err.message || "Failed to log in. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    // Google Sign-In Handler
    const handleGoogleLogin = async () => {
        setErrorMessage('');
        try {
            const result = await googleSignIn();
            console.log("Google User:", result.user);
            navigate(from, { replace: true });
        } catch (err) {
            console.error(err);
            setErrorMessage(err.message || "Google login failed.");
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-6">
                
                {/* Header text */}
                <div className="space-y-1 text-center lg:text-left">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Welcome back</h1>
                    <p className="text-sm text-gray-500">Log in to manage your KMS-FAST account</p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                        {errorMessage}
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={handleSubmit(loginBtnHandler)} className="space-y-4">
                    
                    {/* Email Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
                        <input 
                            type="email" 
                            {...register('email', { required: true })} 
                            className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66] transition-all" 
                            placeholder="name@example.com" 
                        />
                        {errors.email && <p className="text-red-500 text-xs mt-1">Email is required.</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-semibold text-gray-700">Password</label>
                            <Link 
                                to="#" 
                                className="text-xs font-semibold text-[#96b830] hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <input 
                            type="password" 
                            {...register('password', { required: true })} 
                            className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66] transition-all" 
                            placeholder="••••••••" 
                        />
                        {errors.password && <p className="text-red-500 text-xs mt-1">Password is required.</p>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={loading}
                        type="submit"
                        className="w-full mt-2 py-3.5 px-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {/* Switch to Register link */}
                <p className="text-center text-xs text-gray-600">
                    Don't have an account?{' '}
                    <Link 
                        to='/register' 
                        state={location.state}
                        className="text-gray-900 font-bold underline hover:text-[#96b830] transition-colors"
                    >
                        Register
                    </Link>
                </p>

                {/* Divider */}
                <div className="relative flex py-1 items-center">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-xs font-medium uppercase">Or continue with</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Google Sign In Button */}
                <div className="flex justify-center w-full">
                    <button 
                        onClick={handleGoogleLogin} 
                        type="button" 
                        className="w-full sm:w-auto px-6 py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-semibold text-gray-800 transition-all shadow-sm"
                    >
                        <FcGoogle className="w-5 h-5" />
                        Login with google
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Login;