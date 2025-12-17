"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { ThemeToggle } from "./ThemeToggle";
import { User, LogOut } from "lucide-react";

export function Navbar() {
    const { user, logout, isLoading } = useAuth();

    return (
        <nav className="border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            ProfileApp
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {!isLoading && (
                            <>
                                {user ? (
                                    <div className="flex items-center gap-4">
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                        >
                                            <User className="w-4 h-4" />
                                            <span className="hidden sm:inline">Profile</span>
                                        </Link>

                                        <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800 mx-2" />

                                        <div className="flex items-center gap-3">
                                            <div className="text-right hidden sm:block">
                                                <p className="text-sm font-medium leading-none">{user.name || user.email}</p>
                                            </div>
                                            <button
                                                onClick={logout}
                                                className="p-2 text-neutral-500 hover:text-red-500 transition-colors"
                                                title="Sign out"
                                            >
                                                <LogOut className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-50 shadow transition-colors hover:bg-neutral-900/90 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-neutral-50/90"
                                    >
                                        Sign In
                                    </Link>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
