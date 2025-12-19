"use client";

import { useEffect, useState } from "react";
import { signIn, signUp, confirmSignUp, type SignUpInput, fetchAuthSession } from "aws-amplify/auth";
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle, ArrowRight, User as UserIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

type AuthState = "signin" | "signup" | "confirm";

export default function LoginPage() {
    const [authState, setAuthState] = useState<AuthState>("signin");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { checkUser } = useAuth();

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await signIn({ username: email, password });

            // check user group from cognito pool
            const session = await fetchAuthSession();
            const groups = session.tokens?.accessToken?.payload["cognito:groups"];
            const isAdminUser = Array.isArray(groups) && groups.includes("admin");

            await checkUser();

            // store in local storage
            localStorage.setItem("isAdmin", isAdminUser ? "true" : "false");
            if (isAdminUser) {
                router.push("/admin/dashboard");
            } else {
                router.push("/profile");
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign in");
        } finally {
            setLoading(false);
        }
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { nextStep } = await signUp({
                username: email,
                password,
                options: {
                    userAttributes: {
                        name,
                        email,
                    },
                },
            });
            if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
                setAuthState("confirm");
            }
        } catch (err: any) {
            setError(err.message || "Failed to sign up");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirm = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await confirmSignUp({ username: email, confirmationCode: code });
            await signIn({ username: email, password });
            await checkUser();
            router.push("/profile");
        } catch (err: any) {
            setError(err.message || "Failed to confirm code");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-140px)] px-4">
            <div className="w-full max-w-md">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
                                {authState === "signin" && "Welcome Back"}
                                {authState === "signup" && "Create Account"}
                                {authState === "confirm" && "Verify Email"}
                            </h2>
                            <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                                {authState === "signin" && "Sign in to manage your profile"}
                                {authState === "signup" && "Get started with your profile"}
                                {authState === "confirm" && `Enter the code sent to ${email}`}
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}

                        {authState === "signin" && (
                            <form onSubmit={handleSignIn} className="space-y-6">
                                <InputGroup icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="Email" />
                                <InputGroup icon={<Lock />} type="password" value={password} onChange={setPassword} placeholder="Password" />
                                <SubmitButton loading={loading} text="Sign In" />
                                <p className="text-center text-sm text-neutral-600">
                                    Don't have an account?{" "}
                                    <button type="button" onClick={() => setAuthState("signup")} className="text-blue-600 hover:underline">
                                        Sign Up
                                    </button>
                                </p>
                            </form>
                        )}

                        {authState === "signup" && (
                            <form onSubmit={handleSignUp} className="space-y-6">
                                <InputGroup icon={<UserIcon />} type="text" value={name} onChange={setName} placeholder="Full Name" />
                                <InputGroup icon={<Mail />} type="email" value={email} onChange={setEmail} placeholder="Email" />
                                <InputGroup icon={<Lock />} type="password" value={password} onChange={setPassword} placeholder="Password" />
                                <SubmitButton loading={loading} text="Sign Up" />
                                <p className="text-center text-sm text-neutral-600">
                                    Already have an account?{" "}
                                    <button type="button" onClick={() => setAuthState("signin")} className="text-blue-600 hover:underline">
                                        Sign In
                                    </button>
                                </p>
                            </form>
                        )}

                        {authState === "confirm" && (
                            <form onSubmit={handleConfirm} className="space-y-6">
                                <InputGroup icon={<Lock />} type="text" value={code} onChange={setCode} placeholder="Verification Code" />
                                <SubmitButton loading={loading} text="Verify & Sign In" />
                                <p className="text-center text-sm text-neutral-600">
                                    <button type="button" onClick={() => setAuthState("signup")} className="text-blue-600 hover:underline">
                                        Back to Sign Up
                                    </button>
                                </p>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}

function InputGroup({ icon, type, value, onChange, placeholder }: any) {
    return (
        <div>
            <label className="sr-only">{placeholder}</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400">
                    {/* Clone icon to set size if needed, or rely on lucid default (24px which is maybe big for h-5, use h-5 w-5 class on icon itself usually) */}
                    <div className="h-5 w-5 flex items-center justify-center">
                        {icon}
                    </div>
                </div>
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder={placeholder}
                    required
                />
            </div>
        </div>
    );
}

function SubmitButton({ loading, text }: { loading: boolean; text: string }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
        >
            {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <>
                    {text}
                    <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </button>
    );
}
