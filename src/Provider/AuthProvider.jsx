import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword,GoogleAuthProvider, getAuth, signInWithEmailAndPassword, signOut, updateProfile,  signInWithPopup } from 'firebase/auth';
const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const auth = getAuth();
    const googleProvider=new GoogleAuthProvider();
    // create user (sign up by email and password)
    const registerUser=(email,password)=>{
        setLoading(true);
        return createUserWithEmailAndPassword(auth,email,password)
    }

    // sign in with email and password

    const signinUser=(email,password)=>{
        setLoading(true);
        return signInWithEmailAndPassword(auth,email,password);
    }

    // google sign in

    const googleSignIn=()=>{
        setLoading(true);
        return signInWithPopup(auth,googleProvider)
    }

    // logout

    const logOut=()=>{
        setLoading(true);
        return signOut(auth)
    }

    // update profile

    const updateUserProfile=(profile)=>{
        return updateProfile(auth.currentUser,profile);
    }





    // observer


    useEffect(()=>{
        const unsubscribe=(auth,(currentUser)=>{
            setUser(currentUser);
            setLoading(false);
        });
       return()=>{
        unsubscribe();
       };
    },[])


    const authInfo={
        user,
        loading,
        registerUser,
        signinUser,
        googleSignIn,
        logOut,
        updateUserProfile

    }
    return (
        <AuthContext value={authInfo}>
            {children}
        </AuthContext>
    );
};

export default AuthProvider;