"use client";

import { useEffect, useState, useRef } from "react";
import { Search, ArrowUpRight, Command } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import config from "../config/services.json";

export const SpotlightSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
                setQuery("");
                setSelectedIndex(0);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 50);
        }
    }, [isOpen]);

    const filteredServices = config.services.filter((s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        (s.description && s.description.toLowerCase().includes(query.toLowerCase()))
    );

    useEffect(() => {
        setSelectedIndex(0);
    }, [query]);

    const handleKeyNavigation = (e: React.KeyboardEvent) => {
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, filteredServices.length - 1));
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        } else if (e.key === "Enter" && filteredServices[selectedIndex]) {
            window.open(filteredServices[selectedIndex].url, "_blank");
            setIsOpen(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Spotlight Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[560px] z-50"
                    >
                        <div className="glass-strong rounded-2xl overflow-hidden shadow-2xl">
                            {/* Search input */}
                            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
                                <Search size={18} className="text-white/30 flex-shrink-0" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search applications..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyNavigation}
                                    className="flex-1 bg-transparent text-[15px] text-white/90 placeholder:text-white/25 outline-none font-medium"
                                />
                                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 bg-white/[0.06] rounded-md text-[10px] text-white/25 font-mono border border-white/[0.06]">
                                    ESC
                                </kbd>
                            </div>

                            {/* Results */}
                            <div className="max-h-[320px] overflow-y-auto p-2">
                                {filteredServices.length > 0 ? (
                                    filteredServices.map((service, i) => (
                                        <motion.a
                                            key={service.name}
                                            href={service.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.04 }}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all duration-200 group/item ${i === selectedIndex
                                                    ? "bg-white/[0.08]"
                                                    : "hover:bg-white/[0.04]"
                                                }`}
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <div className="p-2 bg-white/[0.06] rounded-xl border border-white/[0.06]">
                                                <img
                                                    src={`https://cdn.simpleicons.org/${service.icon}/_/white`}
                                                    className="w-5 h-5 opacity-70"
                                                    alt={service.name}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[13px] font-medium text-white/80">{service.name}</p>
                                                {service.description && (
                                                    <p className="text-[11px] text-white/30">{service.description}</p>
                                                )}
                                            </div>
                                            <ArrowUpRight
                                                size={14}
                                                className="text-white/0 group-hover/item:text-white/30 transition-all duration-200 flex-shrink-0"
                                            />
                                        </motion.a>
                                    ))
                                ) : (
                                    <div className="py-8 text-center">
                                        <p className="text-[13px] text-white/25">No applications found</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer hints */}
                            <div className="flex items-center gap-4 px-5 py-2.5 border-t border-white/[0.06]">
                                <div className="flex items-center gap-1.5 text-[10px] text-white/20">
                                    <kbd className="px-1.5 py-0.5 bg-white/[0.04] rounded text-[9px] border border-white/[0.06]">↑↓</kbd>
                                    <span>Navigate</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] text-white/20">
                                    <kbd className="px-1.5 py-0.5 bg-white/[0.04] rounded text-[9px] border border-white/[0.06]">↵</kbd>
                                    <span>Open</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
