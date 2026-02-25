"use client";

import { Card, CardBody } from "@nextui-org/react";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface AppCardProps {
    name: string;
    url: string;
    icon: string;
    description?: string;
    index?: number;
}

export const AppCard = ({ name, url, icon, description, index = 0 }: AppCardProps) => {
    const [status, setStatus] = useState<"up" | "down" | "checking">("checking");
    const hostname = (() => {
        try { return new URL(url).hostname; } catch { return url; }
    })();

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/status?url=${encodeURIComponent(url)}`);
                const data = await res.json();
                setStatus(data.status);
            } catch {
                setStatus("down");
            }
        };
        checkStatus();
        const interval = setInterval(checkStatus, 30000);
        return () => clearInterval(interval);
    }, [url]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
            <a href={url} target="_blank" rel="noopener noreferrer" className="block group">
                <div className="glass-card gradient-border rounded-[24px] p-1 transition-all duration-500 group-hover:translate-y-[-4px]">
                    <div className="rounded-[22px] p-6 relative overflow-hidden">

                        {/* Hover glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/[0.06] group-hover:via-purple-500/[0.04] group-hover:to-pink-500/[0.06] transition-all duration-700" />

                        {/* Status Indicator */}
                        <div className="absolute top-5 right-5 z-10">
                            {status === "checking" ? (
                                <span className="flex h-2.5 w-2.5 rounded-full bg-yellow-400/60"></span>
                            ) : (
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status === "up" ? "bg-emerald-400" : "bg-red-400"}`} />
                                    <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${status === "up" ? "bg-emerald-500" : "bg-red-500"}`} />
                                </span>
                            )}
                        </div>

                        <div className="flex flex-col items-center gap-5 relative z-[1]">
                            {/* Icon container with gradient background */}
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl blur-xl scale-150 group-hover:scale-[1.8] transition-transform duration-700" />
                                <div className="relative p-4 bg-gradient-to-br from-white/[0.08] to-white/[0.02] rounded-2xl border border-white/[0.08] group-hover:border-white/[0.15] transition-all duration-500">
                                    <img
                                        src={`https://cdn.simpleicons.org/${icon}/_/white`}
                                        className="w-10 h-10 opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                        alt={name}
                                    />
                                </div>
                            </div>

                            {/* Text */}
                            <div className="text-center space-y-1.5">
                                <h3 className="font-semibold text-[15px] text-white/90 group-hover:text-white transition-colors duration-300">
                                    {name}
                                </h3>
                                {description && (
                                    <p className="text-[11px] text-white/40 font-medium uppercase tracking-wider">
                                        {description}
                                    </p>
                                )}
                                <p className="text-[11px] text-white/25 font-mono tracking-tight">
                                    {hostname}
                                </p>
                            </div>

                            {/* External link hint on hover */}
                            <div className="absolute top-5 left-5 opacity-0 group-hover:opacity-50 transition-opacity duration-300">
                                <ExternalLink size={12} className="text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </motion.div>
    );
};
