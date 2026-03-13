"use client";

import { useEffect, useState } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut, 
    User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserProfile, UserRole } from "@/types";

interface AuthState {
    user: User | null;
    profile: UserProfile | null;
    role: UserRole | null;
    loading: boolean;
}


export function useAuth() {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        profile: null,
        role: null,
        loading: true
    })

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if(!user){
                setAuthState({ user: null, profile: null, role: null, loading: false})
            }

            try {
                // Get the role from custom claims (this is the trusted source)
                const tokenResult = await user?.getIdTokenResult();
                const role = tokenResult?.claims.roles as UserRole | null;

                // Get full profile from Firestore  (for display data);
                const profileSnap = await getDoc(doc(db, "users", user.uid));
                const profile = profileSnap.exists() ? (profileSnap.data() as UserProfile) : null;

                setAuthState({ user, profile, role, loading: false})
            } catch (error) {
                console.error("Auth state error", error);
                setAuthState({ user: null, profile: null, role: null, loading: false})
            }
        });
        return () => unsubscribe()
    }, []);

    const logout = async () => {
        await signOut(auth);   
    };

    return {...authState, logout}
}