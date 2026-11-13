
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

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Register user
    const registerUser = (email, password) => {
        return createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
    };

    // Login user
    const signinUser = (email, password) => {
        return signInWithEmailAndPassword(
            auth,
            email,
            password
        );
    };

    // Google login
    const googleSignIn = () => {
        return signInWithPopup(auth, googleProvider);
    };

    // Logout
    const logOut = () => {
        return signOut(auth);
    };

    // Update profile
    const updateUserProfile = (name, photo) => {
        if (!auth.currentUser) {
            throw new Error("No authenticated user found.");
        }

        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
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
