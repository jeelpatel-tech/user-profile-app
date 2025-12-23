"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { CheckCircle, XCircle, Info, X, Loader2 } from "lucide-react";

type ToastType = "success" | "error" | "info" | "loading";

interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
    loading: (message: string) => number; // Returns toast ID for manual dismissal
    dismiss: (id: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType, autoClose = true): number => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, message, type }]);

        // Auto remove after 3 seconds (except for loading)
        if (autoClose) {
            setTimeout(() => {
                setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }, 3000);
        }

        return id;
    }, []);

    const removeToast = useCallback((id: number) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const success = useCallback((message: string) => {
        addToast(message, "success");
    }, [addToast]);

    const error = useCallback((message: string) => {
        addToast(message, "error");
    }, [addToast]);

    const info = useCallback((message: string) => {
        addToast(message, "info");
    }, [addToast]);

    const loading = useCallback((message: string): number => {
        return addToast(message, "loading", false); // Don't auto-close loading toasts
    }, [addToast]);

    const dismiss = useCallback((id: number) => {
        removeToast(id);
    }, [removeToast]);

    return (
        <ToastContext.Provider value={{ success, error, info, loading, dismiss }}>
            {children}
            <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg backdrop-blur-sm border animate-in slide-in-from-right-full duration-300 ${toast.type === "success"
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                            : toast.type === "error"
                                ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                                : toast.type === "loading"
                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
                                    : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200"
                            }`}
                    >
                        {toast.type === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === "error" && <XCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === "info" && <Info className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === "loading" && <Loader2 className="w-5 h-5 flex-shrink-0 animate-spin" />}
                        <p className="text-sm font-medium">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 hover:opacity-70 transition-opacity"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within ToastProvider");
    }
    return context;
}
