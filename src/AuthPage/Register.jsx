import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa6";
import UseAuth from "../Hooks/UseAuth";
import axios from "axios"; // 👈 Import axios

const Register = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const {
        registerUser,
        updateUserProfile,
        googleSignIn
    } = UseAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    // ImgBB Upload
    const uploadImageToImgBB = async (imageFile) => {
        const apiKey = import.meta.env.VITE_IMGBB_API_KEY;
        if (!apiKey) {
            throw new Error("ImgBB API key is missing.");
        }
        const formData = new FormData();
        formData.append("image", imageFile);
        const response = await fetch(
            `https://api.imgbb.com/1/upload?key=${apiKey}`,
            {
                method: "POST",
                body: formData
            }
        );
        const data = await response.json();
        if (!response.ok || !data.success) {
            throw new Error("Image upload failed.");
        }
        return data.data.url;
    };

    // Email Registration
    const registerBtnHandler = async (data) => {
        setLoading(true);
        setErrorMessage("");
        try {
            let photoURL = "";
            if (data.photo?.[0]) {
                photoURL = await uploadImageToImgBB(
                    data.photo[0]
                );
            }
            const result = await registerUser(
                data.email,
                data.password
            );
            await updateUserProfile(
                data.name,
                photoURL
            );
            console.log("Registered user:", result.user);

            // 👈 Save user profile in MongoDB backend
            const userInfo = {
                name: data.name,
                email: data.email,
                image: photoURL
            };
            await axios.post('http://localhost:5000/users', userInfo);

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Registration error:", error);
            const errorMessages = {
                "auth/email-already-in-use":
                    "This email is already registered.",
                "auth/invalid-email":
                    "Please enter a valid email address.",
                "auth/weak-password":
                    "Password should be at least 6 characters."
            };
            setErrorMessage(
                errorMessages[error.code] ||
                error.message ||
                "Registration failed."
            );

        } finally {
            setLoading(false);
        }
    };

    // Google Registration
    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setErrorMessage("");
        try {
            const result = await googleSignIn();
            console.log("Google user:", result.user);

            // 👈 Save / Sync Google user in MongoDB backend
            const userInfo = {
                name: result.user.displayName,
                email: result.user.email,
                image: result.user.photoURL
            };
            await axios.post('http://localhost:5000/users', userInfo);

            navigate("/", { replace: true });
        } catch (error) {
            console.error("Google registration error:", error);
            setErrorMessage(
                error.message || "Google sign-in failed."
            );

        } finally {
            setGoogleLoading(false);
        }
    };
    return (
        <div className="w-full">
            <div className="flex flex-col gap-6">
                <div className="space-y-1 text-center lg:text-left">
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Create an account
                    </h1>
                    <p className="text-sm text-gray-500">
                        Enter your details to register with KMS-FAST
                    </p>
                </div>
                {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600">
                        {errorMessage}
                    </div>
                )}
                <form
                    onSubmit={handleSubmit(registerBtnHandler)}
                    className="space-y-4"
                >
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Full Name
                        </label>

                        <input
                            type="text"
                            {...register("name", {
                                required: "Name is required."
                            })}
                            className="w-full px-4 py-3 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                            placeholder="Kazi Salauddin"
                        />

                        {errors.name && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.name.message}
                            </p>
                        )}

                    </div>

                    {/* Profile Picture */}

                    <div>

                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Profile Picture
                        </label>

                        <input
                            type="file"
                            accept="image/*"
                            {...register("photo", {
                                required: "Profile picture is required."
                            })}
                            className="w-full text-xs text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#CAEB66] file:text-gray-900 bg-gray-50/50 border border-gray-200 rounded-2xl"
                        />

                        {errors.photo && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.photo.message}
                            </p>
                        )}

                    </div>

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

                        <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                            Password
                        </label>

                        <div className="relative flex items-center">

                            <input
                                type={showPassword ? "text" : "password"}
                                {...register("password", {
                                    required: "Password is required.",
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters."
                                    }
                                })}
                                className="w-full px-4 py-3 pr-10 text-sm bg-gray-50/50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]"
                                placeholder="••••••••"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 text-gray-500 cursor-pointer"
                            >
                                {showPassword
                                    ? <FaRegEye />
                                    : <FaRegEyeSlash />
                                }
                            </button>

                        </div>

                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">
                                {errors.password.message}
                            </p>
                        )}

                    </div>

                    {/* Register Button */}

                    <button
                        type="submit"
                        disabled={loading || googleLoading}
                        className="w-full mt-2 py-3.5 px-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-2xl transition-all disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="text-center text-xs text-gray-600">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-gray-900 font-bold underline"
                    >
                        Log in
                    </Link>

                </p>

                <div className="relative flex py-1 items-center">

                    <div className="flex-grow border-t border-gray-200" />

                    <span className="mx-4 text-gray-400 text-xs font-medium uppercase">
                        Or continue with
                    </span>

                    <div className="flex-grow border-t border-gray-200" />

                </div>

                <button
                    onClick={handleGoogleLogin}
                    type="button"
                    disabled={loading || googleLoading}
                    className="w-full py-3 border border-gray-200 rounded-2xl hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-semibold disabled:opacity-50 cursor-pointer"
                >

                    <FcGoogle className="w-5 h-5" />

                    {googleLoading
                        ? "Connecting..."
                        : "Register with Google"
                    }

                </button>

            </div>

        </div>

    );
};

export default Register;