"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";
import { Sun, Moon } from "lucide-react";

export const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return <div className="w-9 h-9" />;

    return (
        <Button
            isIconOnly
            variant="light"
            size="sm"
            radius="full"
            onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="text-default-500"
        >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
    );
};
