'use client';

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Spinner from "@/components/Spinner/Spinner";
import { motion } from "framer-motion";

export default function Login() {
    const router = useRouter();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const handleAuth = async () => {
        setLoading(true);
        try {
            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            const userRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userRef);

            if (userDoc.exists()) {
                await setDoc(
                    userRef,
                    {
                        userDetails: {
                            email: user.email,
                            name: user.displayName,
                            profilePic: user.photoURL,
                        },
                    },
                    { merge: true }
                );
            } else {
                await setDoc(userRef, {
                    userDetails: {
                        email: user.email,
                        name: user.displayName,
                        profilePic: user.photoURL,
                        createdAt: serverTimestamp(),
                    },
                });
            }

            dispatch(setAuthState(true));
            dispatch(
                setUserDetailsState({
                    uid: user.uid,
                    name: user.displayName ?? "",
                    email: user.email ?? "",
                    profilePic: user.photoURL ?? "",
                })
            );

            setLoading(false);
            router.push("/");
        } catch (error) {
            console.error("Authentication error:", error);
            setLoading(false);
        }
    };

    return (

        <motion.div className="flex h-screen bg-[#232323] text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
        >
            {/* Left Section */}
            <div className="w-[60%] flex flex-col items-center justify-center">
                <div className="flex items-center gap-3">
                    <Image
                        src="https://omniplex.ai/_next/static/media/Logo.35b653fa.svg"
                        alt="logo"
                        width={50}
                        height={50}
                    />
                    <h1 className="text-3xl font-normal">Omniplex</h1>
                </div>
                <h2 className="text-4xl font-medium mt-10 text-center">
                    Where Knowledge <br /> Evolves
                </h2>
            </div>

            {/* Right Section */}
            <div className="w-[40%]  flex flex-col  pr-[10px]  items-center justify-center rounded-md">
                <div className="bg-[#161616] rounded-md h-[95%]  w-full flex flex-col items-center justify-center">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold">Welcome Back</h2>
                        <p className="text-gray-400 mt-2">Let's sign in to continue</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center mt-10">
                            <Spinner />
                            <span className="ml-3">Signing in...</span>
                        </div>
                    ) : (
                        <button
                            onClick={handleAuth}
                            className="flex items-center gap-3 px-6 py-3 mt-10 bg-white text-black rounded-lg shadow-lg hover:bg-gray-300 transition"
                        >
                            <Image
                                src="/svgs/Google.svg"
                                alt="Google"
                                width={24}
                                height={24}
                            />
                            <span>Continue with Google</span>
                        </button>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

