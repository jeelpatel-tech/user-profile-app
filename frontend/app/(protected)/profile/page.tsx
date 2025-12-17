"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
    const { user, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        }
    }, [isLoading, user, router]);

    if (isLoading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Your Profile</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">Managed via AWS Cognito</p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow p-6 border border-neutral-200 dark:border-neutral-800">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Email</dt>
                        <dd className="mt-1 text-sm text-neutral-900 dark:text-white">{user.email || user.username}</dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Name</dt>
                        <dd className="mt-1 text-sm text-neutral-900 dark:text-white">{user.name || "N/A"}</dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-neutral-500 dark:text-neutral-400">Cognito User ID</dt>
                        <dd className="mt-1 text-sm text-mono text-neutral-900 dark:text-white">{user.sub || user.userId}</dd>
                    </div>
                </dl>
            </div>
        </div>
    );
}
