"use client";

import { useAuth } from "../../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;
    dob?: string;
    hobby?: string[];
    interest?: string[];
    gender?: string;
}

export default function AdminDashboard() {
    const { user, isLoading } = useAuth();
    const router = useRouter();
    const [users, setUsers] = useState<User[]>([]);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
            return;
        }

        if (typeof window !== 'undefined' && localStorage.getItem("isAdmin") != "true") {
            console.log("User role:", user?.role, "- Redirecting to profile");
            router.push("/profile");
            return;
        }

        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users");
                if (!res.ok) {
                    throw new Error("Failed to fetch users");
                }
                const data = await res.json();
                setUsers(data.users || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load users");
            } finally {
                setFetching(false);
            }
        };

        fetchUsers();
    }, [isLoading, user, router]);

    if (isLoading || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                    <p className="text-red-800 dark:text-red-200">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Admin Dashboard</h1>
                <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                    Total Users: {users.length}
                </p>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-800">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    DOB
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Gender
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Hobby
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Interest
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                                        {user.name || "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                                        {user.dob ? user.dob.slice(0, 10) : "-"}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                                        {user.gender || "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                                        {user.hobby && user.hobby.length > 0
                                            ? user.hobby.join(", ")
                                            : "-"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-neutral-900 dark:text-neutral-100">
                                        {user.interest && user.interest.length > 0
                                            ? user.interest.join(", ")
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-neutral-500 dark:text-neutral-400">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
}
