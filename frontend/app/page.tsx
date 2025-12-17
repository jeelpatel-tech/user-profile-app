"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, UserCircle, Zap } from "lucide-react";
import { useAuth } from "./context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
          <span className="block text-neutral-900 dark:text-white">User Profiles</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mt-2">
            Secure & Simple
          </span>
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
          {user ? (
            <Link
              href={user.role === 'admin' ? '/admin' : '/profile'}
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all shadow-lg hover:shadow-blue-500/30"
            >
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 md:text-lg transition-all shadow-lg hover:shadow-blue-500/30"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          )}
        </div>


      </div>
    </div>
  );
}

