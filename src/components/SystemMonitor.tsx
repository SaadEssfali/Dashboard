"use client";

import { useEffect, useState } from "react";
import { Server, Cpu, HardDrive, Clock } from "lucide-react";
import { motion } from "framer-motion";

export const SystemMonitor = () => {
    const [stats, setStats] = useState({
        cpu: "—",
        ram: "—",
        uptime: "—",
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/system");
                const data = await res.json();
                setStats(data);
            } catch (err) {
                console.error("Failed to fetch system stats", err);
            }
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    const items = [
        { icon: Clock, label: "UPTIME", value: stats.uptime, color: "text-sky-400" },
        { icon: Cpu, label: "CPU", value: stats.cpu, color: "text-violet-400" },
        { icon: HardDrive, label: "RAM", value: stats.ram, color: "text-emerald-400" },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass gradient-border rounded-2xl px-1 py-1"
        >
            <div className="flex items-center gap-1">
                {items.map((item, i) => (
                    <div key={item.label} className="flex items-center">
                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/[0.04] transition-colors duration-300">
                            <item.icon size={13} className={`${item.color} opacity-80`} />
                            <div className="flex flex-col">
                                <span className="text-[9px] text-white/30 font-semibold uppercase tracking-widest leading-none">
                                    {item.label}
                                </span>
                                <span className="text-[12px] text-white/80 font-medium leading-tight mt-0.5">
                                    {item.value}
                                </span>
                            </div>
                        </div>
                        {i < items.length - 1 && (
                            <div className="w-px h-6 bg-white/[0.06]" />
                        )}
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
