"use client";

import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Kbd,
    Chip,
    Button,
} from "@nextui-org/react";
import { Monitor, Search } from "lucide-react";
import { SystemMonitor } from "./SystemMonitor";
import { NPMIntegration } from "./NPMIntegration";
import { ThemeSwitcher } from "./ThemeSwitcher";

export const TopBar = () => {
    const triggerSearch = () => {
        window.dispatchEvent(
            new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true })
        );
    };

    return (
        <Navbar
            maxWidth="xl"
            isBordered
            isBlurred
            classNames={{
                base: "bg-background/60 backdrop-blur-xl backdrop-saturate-150",
                wrapper: "px-4 sm:px-6",
            }}
        >
            {/* Brand */}
            <NavbarBrand className="gap-3">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary shadow-md">
                    <Monitor size={18} className="text-white" />
                </div>
                <div className="hidden sm:flex flex-col">
                    <p className="font-bold text-sm text-foreground">Home Lab OS</p>
                    <p className="text-tiny text-default-400">Control Center</p>
                </div>
            </NavbarBrand>

            {/* Center: Search */}
            <NavbarContent justify="center" className="hidden sm:flex">
                <NavbarItem>
                    <Button
                        variant="flat"
                        size="sm"
                        radius="lg"
                        className="text-default-400 bg-default-100 min-w-[220px] justify-start gap-3"
                        startContent={<Search size={14} />}
                        endContent={<Kbd keys={["command"]}>K</Kbd>}
                        onPress={triggerSearch}
                    >
                        Search apps...
                    </Button>
                </NavbarItem>
            </NavbarContent>

            {/* Right Side */}
            <NavbarContent justify="end" className="gap-2">
                <NavbarItem className="hidden lg:flex">
                    <NPMIntegration />
                </NavbarItem>
                <NavbarItem className="hidden md:flex">
                    <SystemMonitor />
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};
