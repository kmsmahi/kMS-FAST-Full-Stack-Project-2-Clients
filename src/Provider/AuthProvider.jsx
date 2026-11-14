import React, { useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
    updateProfile,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

import { auth } from "../firebase/firebase.config";
import { AuthContext } from "./AuthContext";
import UseAxios from "../Hooks/UseAxios"; // 👈 Import your axios hook

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const axiosSecure = UseAxios(); // 👈 Initialize your secure/public axios hook

    // Helper function to save user to MongoDB database
    const saveUserToDB = async (userInfo) => {
        try {
            await axiosSecure.post('/users', userInfo);
        } catch (error) {
            console.error("Error saving user to database:", error);
        }
    };

    // Register user
    const registerUser = async (email, password, name = "Valued User", photo = "") => {
        setLoading(true);
        const result = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save user profile to MongoDB upon registration
        await saveUserToDB({
            name: name,
            email: email,
            image: photo
        });

        return result;
    };

    // Login user
    const signinUser = async (email, password) => {
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, email, password);
        const loggedUser = result.user;

        // Ensure user exists in MongoDB when logging in (handles pre-existing users)
        await saveUserToDB({
            name: loggedUser.displayName || "Valued User",
            email: loggedUser.email,
            image: loggedUser.photoURL || ""
        });

        return result;
    };

    // Google login
    const googleSignIn = async () => {
        setLoading(true);
        const result = await signInWithPopup(auth, googleProvider);
        const loggedUser = result.user;

        // Save or sync Google user to MongoDB
        await saveUserToDB({
            name: loggedUser.displayName || "Valued User",
            email: loggedUser.email,
            image: loggedUser.photoURL || ""
        });

        return result;
    };

    // Logout
    const logOut = () => {
        setLoading(true);
        return signOut(auth);
    };

    // Update profile
    const updateUserProfile = async (name, photo) => {
        if (!auth.currentUser) {
            throw new Error("No authenticated user found.");
        }

        const result = await updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });

        // Optional: Sync updated info to DB if needed
        if (auth.currentUser?.email) {
            await saveUserToDB({
                name: name,
                email: auth.currentUser.email,
                image: photo
            });
        }

        return result;
    };

    // Firebase Auth Observer
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(
            auth,
            (currentUser) => {

                setUser(currentUser);
                setLoading(false);

            }
        );

        return () => unsubscribe();

    }, []);

    const authInfo = {
        user,
        loading,
        registerUser,
        signinUser,
        googleSignIn,
        logOut,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;