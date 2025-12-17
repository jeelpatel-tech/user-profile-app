"use client";

import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, MoreVertical, Shield, User } from "lucide-react";

// Mock Data for Admin View
const MOCK_USERS = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "user", status: "Active", date: "2023-11-15" },
    { id: 2, name: "Bob Smith", email: "bob@example.com", role: "admin", status: "Active", date: "2023-10-22" },
    { id: 3, name: "Charlie Brown", email: "charlie@example.com", role: "user", status: "Inactive", date: "2023-12-01" },
    { id: 4, name: "Diana Prince", email: "diana@example.com", role: "user", status: "Active", date: "2023-09-10" },
    { id: 5, name: "Evan Wright", email: "evan@example.com", role: "user", status: "Pending", date: "2023-12-05" },
];

export default function AdminPage() {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        setMounted(true);
        if (!isAuthenticated) {
            router.push("/login");
        } else if (user?.role !== "admin") {
            router.push("/profile");
        }
    }, [isAuthenticated, user, router]);

    if (!mounted || !user || user.role !== "admin") {
        return null;
    }

    const filteredUsers = MOCK_USERS.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">User Management</h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-2">View and manage all registered users.</p>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full sm:w-64 pl-10 pr-3 py-2.5 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    User
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                                    Joined Date
                                </th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-800">
                            {filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    className="h-10 w-10 rounded-full bg-neutral-100"
                                                    src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${u.name}`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-neutral-900 dark:text-white">{u.name}</div>
                                                <div className="text-sm text-neutral-500 dark:text-neutral-400">{u.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-neutral-700 dark:text-neutral-300">
                                            {u.role === 'admin' ? (
                                                <Shield className="w-4 h-4 mr-1.5 text-indigo-500" />
                                            ) : (
                                                <User className="w-4 h-4 mr-1.5 text-blue-500" />
                                            )}
                                            <span className="capitalize">{u.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${u.status === 'Active' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' :
                                                u.status === 'Inactive' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' :
                                                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'}`}>
                                            {u.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                                        {u.date}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                                            <MoreVertical className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
