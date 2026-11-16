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
import axios from "axios"; 
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Use standard public axios instance or base URL for user creation
    const saveUserToDB = async (userInfo) => {
        try {
            const backendURL = import.meta.env.VITE_API_URL || "http://localhost:5000";
            await axios.post(`${backendURL}/users`, userInfo);
        } catch (error) {
            console.error("Error saving user to database:", error);
        }
    };

    // Register user
    // const registerUser = async (email, password, name = "Valued User", photo = "") => {
    //     setLoading(true);
    //     const result = await createUserWithEmailAndPassword(auth, email, password);
        
    //     await saveUserToDB({
    //         name: name,
    //         email: email,
    //         image: photo
    //     });

    //     return result;
    // };
    const registerUser = async (email, password, name = "Valued User", photo = "") => {
        setLoading(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            
            await saveUserToDB({
                name: name,
                email: email,
                image: photo
            });

            return result;
        } catch (error) {
            console.error("Firebase Registration Error Code:", error.code);
            console.error("Firebase Registration Error Message:", error.message);
            throw error; // Let the form catch it if needed
        } finally {
            setLoading(false);
        }
    };

    // Login user
    const signinUser = async (email, password) => {
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, email, password);
        const loggedUser = result.user;

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