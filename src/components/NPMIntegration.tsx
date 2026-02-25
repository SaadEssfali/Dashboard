"use client";

import { useEffect, useState } from "react";
import { Shield, ShieldCheck, Globe2, Wifi } from "lucide-react";
import { motion } from "framer-motion";

export const NPMIntegration = () => {
    const [npmStats, setNpmStats] = useState({
        activeHosts: 0,
        expiringCerts: 0,
    });

    useEffect(() => {
        const fetchNPMStats = async () => {
            try {
                const res = await fetch("/api/npm");
                const data = await res.json();
                setNpmStats(data);
            } catch (err) {
                console.error("Failed to fetch NPM stats", err);
            }
        };
        fetchNPMStats();
        const interval = setInterval(fetchNPMStats, 60000);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2"
        >
            {/* Proxy Hosts Badge */}
            <div className="glass gradient-border rounded-2xl px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.06] transition-colors duration-300">
                <div className="p-1.5 bg-sky-500/10 rounded-lg">
                    <Globe2 size={14} className="text-sky-400" />
                </div>
                <div>
                    <p className="text-[9px] text-white/30 font-semibold uppercase tracking-widest leading-none">Proxies</p>
                    <p className="text-[12px] text-white/80 font-medium leading-tight mt-0.5">{npmStats.activeHosts} Active</p>
                </div>
            </div>

            {/* SSL Badge */}
            <div className={`glass gradient-border rounded-2xl px-4 py-2.5 flex items-center gap-3 hover:bg-white/[0.06] transition-colors duration-300 ${npmStats.expiringCerts > 0 ? "border-red-500/20" : ""}`}>
                <div className={`p-1.5 rounded-lg ${npmStats.expiringCerts > 0 ? "bg-red-500/10" : "bg-emerald-500/10"}`}>
                    {npmStats.expiringCerts > 0 ? (
                        <Shield size={14} className="text-red-400 animate-pulse" />
                    ) : (
                        <ShieldCheck size={14} className="text-emerald-400" />
                    )}
                </div>
                <div>
                    <p className="text-[9px] text-white/30 font-semibold uppercase tracking-widest leading-none">SSL</p>
                    <p className="text-[12px] text-white/80 font-medium leading-tight mt-0.5">
                        {npmStats.expiringCerts > 0 ? `${npmStats.expiringCerts} Expiring` : "All Valid"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};
