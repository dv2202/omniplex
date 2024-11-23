import React, { useState } from "react";
import styles from "./Auth.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, ModalContent } from "@nextui-org/modal";
import { useDispatch } from "react-redux";
import { setAuthState, setUserDetailsState } from "@/store/authSlice";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import Spinner from "../Spinner/Spinner";
import Logo from "../../../public/Logo.svg";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const Auth = (props: Props) => {
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
      props.onClose();
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-row"
      >
      <div className="w-[50%] h-full flex flex-col">
        <div className="flex flex-row items-center justify-center">
          <img src={Logo} alt="logo" />
          <p>Omniplex</p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
