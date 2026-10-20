import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import UseAuth from "../Hooks/UseAuth";
import { uploadImageToImgBB } from './uploadImage';
// Path to your helper

export default function UpdateProfile() {
    const { user, updateUserProfile } = UseAuth();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [uploading, setUploading] = useState(false);

    const handleUpdateProfile = async (data) => {
        setUploading(true);
        try {
            let photoURL = user?.photoURL;

            // Check if a new image file was selected
            if (data.image && data.image[0]) {
                const imageFile = data.image[0];
                // Upload to ImgBB and get the public URL
                photoURL = await uploadImageToImgBB(imageFile);
            }

            // Update Firebase User Profile with new name and photo URL
            await updateUserProfile(data.name, photoURL);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Update failed:", error);
            alert("Failed to update profile.");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-3xl border border-gray-200 shadow-sm mt-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Update Profile</h2>
            
            <form onSubmit={handleSubmit(handleUpdateProfile)} className="flex flex-col gap-4">
                
                {/* Name Field */}
                <div>
                    <label className="label text-xs font-semibold text-gray-700">Full Name</label>
                    <input 
                        type="text" 
                        defaultValue={user?.displayName || ""}
                        {...register('name', { required: true })} 
                        className="w-full mt-1 px-4 py-3 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#CAEB66]" 
                        placeholder="Enter your name" 
                    />
                </div>

                {/* Profile Picture File Input */}
                <div>
                    <label className="label text-xs font-semibold text-gray-700">Profile Picture</label>
                    <input 
                        type="file" 
                        accept="image/*"
                        {...register('image')} 
                        className="w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-[#CAEB66] file:text-gray-900 hover:file:bg-[#b8d655] cursor-pointer" 
                    />
                </div>

                {/* Submit Button */}
                <button 
                    type="submit" 
                    disabled={uploading}
                    className="mt-4 w-full py-3 px-4 bg-[#CAEB66] hover:bg-[#b8d655] text-gray-900 font-bold text-sm rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                    {uploading ? "Uploading & Updating..." : "Save Changes"}
                </button>
            </form>
        </div>
    );
}