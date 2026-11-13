
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/firebase.config";

import UseAuth from "../Hooks/UseAuth";

const Login = () => {

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const { signinUser, googleSignIn } = UseAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const from = location.state?.from?.pathname || "/";

    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const [showPassword, setShowPassword] = useState(false);

    const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [resetMessage, setResetMessage] = useState("");
    const [resetError, setResetError] = useState("");
    const [resetLoading, setResetLoading] = useState(false);

    // Email and Password Login
    const loginBtnHandler = async (data) => {

        setLoading(true);
        setErrorMessage("");

        try {

            const result = await signinUser(
                data.email,
                data.password
            );

            console.log("Logged in user:", result.user);

            navigate(from, { replace: true });

        } catch (error) {

            console.error("Login error:", error);

            const errorMessages = {
                "auth/invalid-credential":
                    "Invalid email or password.",

                "auth/user-not-found":
                    "No account found with this email.",

                "auth/wrong-password":
                    "Incorrect password.",

                "auth/invalid-email":
                    "Please enter a valid email address.",

                "auth/too-many-requests":
                    "Too many attempts. Please try again later."
            };

            setErrorMessage(
                errorMessages[error.code] ||
                error.message ||
                "Failed to log in."
            );

        } finally {

            setLoading(false);

        }
    };

    // Google Login
    const handleGoogleLogin = async () => {

        setGoogleLoading(true);
        setErrorMessage("");

        try {

            const result = await googleSignIn();

            console.log("Google user:", result.user);

            navigate(from, { replace: true });

        } catch (error) {

            console.error("Google login error:", error);

            setErrorMessage(
                error.message || "Google login failed."
            );

        } finally {

            setGoogleLoading(false);

        }
    };

    // Forgot Password
    const handlePasswordReset = async (e) => {

        e.preventDefault();

        if (!resetEmail) {
            setResetError("Please enter your email address.");
            return;
        }

        setResetLoading(true);
        setResetError("");
        setResetMessage("");

        try {

            await sendPasswordResetEmail(
                auth,
                resetEmail
            );

            setResetMessage(
                "Password reset email sent! Check your inbox."
            );

            setResetEmail("");

        } catch (error) {

            console.error("Password reset error:", error);

            const errorMessages = {
                "auth/invalid-email":
                    "Please enter a valid email address.",

                "auth/user-not-found":
                    "No account found with this email.",

                "auth/too-many-requests":
                    "Too many requests. Try again later."
            };

            setResetError(
                errorMessages[error.code] ||
                error.message ||
                "Failed to send reset email."
            );

        } finally {

            setResetLoading(false);

        }
    };

    return (

        <div className="w-full">

            <div className="flex flex-col gap-6">

                {/* Header */}

                <div className="space-y-1 text-center lg:text-left">

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome back
                    </h1>

                    <p className="text-sm text-gray-500">
                        Log in to manage your KMS-FAST account
                    </p>

                </div>

                {/* Error Message */}

                {errorMessage && (

                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                        {errorMessage}
                    </div>

                )}

                {/* Login Form */}

                <form
                    onSubmit={handleSubmit(loginBtnHandler)}
                    className="space-y-4"
                >

                    {/* Email */}

                    <div>

                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Email Address
                        </label>

                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required."
                            })}
                            className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                            placeholder="name@example.com"
                        />

                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.email.message}
                            </p>
                        )}

                    </div>

                    {/* Password */}

                    <div>

                        <div className="flex items-center justify-between mb-1.5">

                            <label className="block text-xs font-semibold text-gray-700">
                                Password
                            </label>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsForgotModalOpen(true);
                                    setResetError("");
                                    setResetMessage("");
                                }}
                                className="text-xs font-semibold text-[#96b830] hover:underline cursor-pointer"
                            >
                                Forgot password?
                            </button>

                        </div>

                        <div className="relative flex items-center">

                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required."
                                })}
                                className="w-full px-4 py-3 pr-10 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                placeholder="••••••••"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-gray-500 cursor-pointer"
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword
                                    ? <FaRegEyeSlash />
                                    : <FaRegEye />
                                }
                            </button>

                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}

                    </div>

                    {/* Login Button */}

                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full mt-2 py-3.5 px-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl transition-all shadow-sm disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                {/* Register Link */}

                <p className="text-center text-xs text-gray-600">

                    Don't have an account?{" "}

                    <Link
                        to="/register"
                        state={location.state}
                        className="text-gray-900 font-bold underline hover:text-[#96b830]"
                    >
                        Register
                    </Link>

                </p>

                {/* Divider */}

                <div className="relative flex py-1 items-center">

                    <div className="flex-grow border-t border-gray-200" />

                    <span className="mx-4 text-gray-400 text-xs font-medium uppercase">
                        Or continue with
                    </span>

                    <div className="flex-grow border-t border-gray-200" />

                </div>

                {/* Google Login */}

                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    disabled={loading || googleLoading}
                    className="w-full py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 cursor-pointer"
                >

                    <FcGoogle className="w-5 h-5" />

                    {googleLoading
                        ? "Connecting..."
                        : "Login with Google"
                    }

                </button>

            </div>

            {/* Forgot Password Modal */}

            {isForgotModalOpen && (

                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">

                    <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-100 relative">

                        <button
                            type="button"
                            onClick={() => {
                                setIsForgotModalOpen(false);
                                setResetError("");
                                setResetMessage("");
                            }}
                            className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 cursor-pointer"
                        >
                            ✕
                        </button>

                        <h2 className="text-xl font-bold text-gray-900 mb-1">
                            Reset Password
                        </h2>

                        <p className="text-xs text-gray-500 mb-4">
                            Enter your account email and we'll send you a link to reset your password.
                        </p>

                        {resetError && (

                            <div className="p-3 mb-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                                {resetError}
                            </div>

                        )}

                        {resetMessage && (

                            <div className="p-3 mb-3 rounded-xl bg-green-50 border border-green-200 text-xs text-green-700">
                                {resetMessage}
                            </div>

                        )}

                        <form
                            onSubmit={handlePasswordReset}
                            className="space-y-4"
                        >

                            <div>

                                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={resetEmail}
                                    onChange={(e) =>
                                        setResetEmail(e.target.value)
                                    }
                                    className="w-full px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                    placeholder="name@example.com"
                                    required
                                />

                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsForgotModalOpen(false);
                                        setResetError("");
                                        setResetMessage("");
                                    }}
                                    className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-2xl cursor-pointer"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={resetLoading}
                                    className="px-5 py-2.5 text-xs font-bold text-gray-900 bg-[#CAEB66] hover:bg-[#b8d655] rounded-2xl disabled:opacity-50 cursor-pointer"
                                >
                                    {resetLoading
                                        ? "Sending Link..."
                                        : "Send Reset Link"
                                    }
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );
};

export default Login;
