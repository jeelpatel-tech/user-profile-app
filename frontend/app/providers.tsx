"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
            <AuthProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </AuthProvider>
        </NextThemesProvider>
    );
}
