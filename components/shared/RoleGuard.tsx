"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types";


interface RoleGuardProps {
    allowedRoles: UserRole[];
    children: React.ReactNode;
}


export default function RoleGuard({ allowedRoles, children} : RoleGuardProps){
    const {user, role, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (loading) return;
        if (!user) {
            router.replace("/login");
            return;
        }

        if (role && !allowedRoles.includes(role)) {
            router.replace("/unauthorized");
        }
    }, [user, role, loading, allowedRoles, router])

    if (loading) {
        return  (
            <div className='flex items-center justify-center min-h-screen'>
                <p className="text-gray-500">Loading...</p>
            </div>
        )
    }

    if (!user || (role && !allowedRoles.includes(role))) {
        return null;
    }

    return <>{children}</>
}