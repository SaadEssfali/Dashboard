"use client";

import { useEffect, useState } from "react";
import { Chip } from "@nextui-org/react";
import { Globe2, ShieldCheck, ShieldAlert } from "lucide-react";

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
        <div className="flex items-center gap-1.5">
            <Chip
                size="sm"
                variant="flat"
                color="default"
                startContent={<Globe2 size={12} />}
                classNames={{ content: "text-tiny font-medium" }}
            >
                {npmStats.activeHosts} Proxies
            </Chip>
            <Chip
                size="sm"
                variant="flat"
                color={npmStats.expiringCerts > 0 ? "danger" : "success"}
                startContent={
                    npmStats.expiringCerts > 0 ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />
                }
                classNames={{ content: "text-tiny font-medium" }}
            >
                {npmStats.expiringCerts > 0 ? `${npmStats.expiringCerts} SSL Expiring` : "SSL Valid"}
            </Chip>
        </div>
    );
};
