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
import { SettingsModal } from "./SettingsModal";

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
                <img src="/logo.png" alt="Dash21 Logo" className="w-10 h-10 rounded-2xl shadow-md object-contain" />
                <div className="hidden sm:flex flex-col">
                    <p className="font-bold text-sm text-foreground">Dash21</p>
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
                    <SettingsModal />
                </NavbarItem>
                <NavbarItem>
                    <ThemeSwitcher />
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
};
