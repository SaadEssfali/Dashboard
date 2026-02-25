"use client";

import { useEffect, useState } from "react";
import { AppCard } from "./AppCard";
import { SettingsModal } from "./SettingsModal";
import { Spinner } from "@nextui-org/react";

interface ServiceItem {
    name: string;
    url: string;
    icon: string;
    customIcon?: string;
    description?: string;
    source?: string;
}

export const ServiceGrid = () => {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isConfigured, setIsConfigured] = useState(false);

    const fetchServices = async () => {
        try {
            const res = await fetch("/api/services", { cache: "no-store" });
            const data = await res.json();
            setServices(data.services || []);
            setIsConfigured(!!data.configured);
        } catch (err) {
            console.error("Failed to fetch services:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
        // Poll every 60s for new/removed services
        const interval = setInterval(fetchServices, 60000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Spinner size="lg" color="primary" label="Loading services..." />
            </div>
        );
    }

    if (services.length === 0) {
        return (
            <div className="text-center py-20 bg-background/40 backdrop-blur-md rounded-2xl border border-divider/50 shadow-sm max-w-lg mx-auto">
                <p className="text-foreground font-semibold text-lg">No services found</p>
                {!isConfigured ? (
                    <>
                        <p className="text-default-400 text-sm mt-2 max-w-xs mx-auto">
                            Connect to Nginx Proxy Manager to auto-discover your apps.
                        </p>
                        <SettingsModal showLargeButton={true} onSaveSuccess={fetchServices} />
                    </>
                ) : (
                    <p className="text-default-400 text-sm mt-2">
                        You are connected to NPM, but no active proxy hosts were found.
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {services.map((service, index) => (
                <AppCard
                    key={`${service.name}-${service.url}`}
                    name={service.name}
                    url={service.url}
                    icon={service.icon}
                    customIcon={service.customIcon}
                    description={service.description}
                    index={index}
                    onIconUpdated={fetchServices}
                />
            ))}
        </div>
    );
};
