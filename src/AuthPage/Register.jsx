import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import UseAuth from "../Hooks/UseAuth";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc"; 

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { registerUser, updateUserProfile, googleSignIn } = UseAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // ImgBB Upload Helper function
    const uploadImageToImgBB = async (imageFile) => {
        const formData = new FormData();
        formData.append("image", imageFile);
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        const url = `https://api.imgbb.com/1/upload?key=${apiKey}`;

        const response = await fetch(url, { method: "POST", body: formData });
        const data = await response.json();
        if (data.success) {
            return data.data.url;
        } else {
            throw new Error("Image upload failed");
        }
    };

    const registerBtnHandler = async (data) => {
        setLoading(true);
        setErrorMessage('');
        try {
            let photoURL = "";
            if (data.photo && data.photo[0]) {
                photoURL = await uploadImageToImgBB(data.photo[0]);
            }

            const result = await registerUser(data.email, data.password);
            console.log("User created:", result.user);

            await updateUserProfile(data.name, photoURL);
            navigate('/');
        } catch (err) {
            console.error(err);
            setErrorMessage(err.message || "Registration failed. Please try again.");
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
            navigate('/');
        } catch (err) {
            console.error(err);
            setErrorMessage(err.message || "Google sign in failed.");
        }
    };

    return (
        <div className="w-full">
            <div className="flex flex-col gap-6">
                
                {/* Header text */}
                <div className="space-y-1 text-center lg:text-left">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">Create an account</h1>
                    <p className="text-sm text-gray-500">Enter your details to register with KMS-FAST</p>
                </div>

                {/* Error Banner */}
                {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                        {errorMessage}
                    </div>
                )}

                {/* Form Container */}
                <form onSubmit={handleSubmit(registerBtnHandler)} className="space-y-4">
                    
                    {/* Name Field */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
                        <input 
                            type="text" 
                            {...register('name', { required: true })} 
                            className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66] transition-all" 
                            placeholder="Kazi Salauddin" 
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">Name is required.</p>}
                    </div>

                    {/* Photo File Input */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Profile Picture</label>
                        <input 
                            type="file" 
                            accept="image/*"
                            {...register('photo', { required: true })} 
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#CAEB66] file:text-gray-900 hover:file:bg-[#b8d655] cursor-pointer bg-gray-50/50 border border-gray-200 rounded-2xl" 
                        />
                        {errors.photo && <p className="text-red-500 text-xs mt-1">Photo is required.</p>}
                    </div>

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
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
                        <input 
                            type="password" 
                            {...register('password', {
                                required: true,
                                minLength: 6,
                                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/
                            })} 
                            className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66] transition-all" 
                            placeholder="••••••••" 
                        />
                        {errors.password?.type === 'required' && <p className="text-red-500 text-xs mt-1">Password is required.</p>}
                        {errors.password?.type === 'minLength' && <p className="text-red-500 text-xs mt-1">Password must be 6+ characters.</p>}
                        {errors.password?.type === 'pattern' && <p className="text-red-500 text-xs mt-1">Include uppercase, lowercase, number & special character.</p>}
                    </div>

                    {/* Submit Button */}
                    <button 
                        disabled={loading}
                        className="w-full mt-2 py-3.5 px-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                {/* Already have an account link */}
                <p className="text-center text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link to='/login' className="text-gray-900 font-bold underline hover:text-[#96b830] transition-colors">
                        Log in
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
                        className="btn btn-wide items-center gap-2 shadow-sm border border-gray-200 rounded-2xl hover:bg-gray-50"
                    >
                        <span><FcGoogle className="w-6 h-6" /></span>
                        Register with google
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Register;