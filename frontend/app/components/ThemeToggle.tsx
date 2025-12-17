"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/app/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className={cn("w-9 h-9 opacity-0", className)} />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className={cn(
                "relative rounded-full p-2 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-colors",
                className
            )}
            aria-label="Toggle theme"
        >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute top-2 left-2 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>
    );
}
