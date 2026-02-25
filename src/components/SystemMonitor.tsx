"use client";

import { useEffect, useState } from "react";
import { Chip, Divider } from "@nextui-org/react";
import { Clock, Cpu, HardDrive } from "lucide-react";

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

    return (
        <div className="flex items-center gap-1.5">
            <Chip
                size="sm"
                variant="flat"
                color="primary"
                startContent={<Clock size={12} />}
                classNames={{ content: "text-tiny font-medium" }}
            >
                {stats.uptime}
            </Chip>
            <Chip
                size="sm"
                variant="flat"
                color="secondary"
                startContent={<Cpu size={12} />}
                classNames={{ content: "text-tiny font-medium" }}
            >
                {stats.cpu}
            </Chip>
            <Chip
                size="sm"
                variant="flat"
                color="success"
                startContent={<HardDrive size={12} />}
                classNames={{ content: "text-tiny font-medium" }}
            >
                {stats.ram}
            </Chip>
        </div>
    );
};
