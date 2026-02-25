"use client";

import { useEffect, useState } from "react";
import { AppCard } from "./AppCard";
import { Spinner } from "@nextui-org/react";

interface ServiceItem {
    name: string;
    url: string;
    icon: string;
    description?: string;
    source?: string;
}

export const ServiceGrid = () => {
    const [services, setServices] = useState<ServiceItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services");
                const data = await res.json();
                setServices(data.services || []);
            } catch (err) {
                console.error("Failed to fetch services:", err);
            } finally {
                setLoading(false);
            }
        };

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
            <div className="text-center py-20">
                <p className="text-default-400 text-lg">No services found</p>
                <p className="text-default-300 text-sm mt-2">
                    Connect to Nginx Proxy Manager or edit services.json
                </p>
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
                    description={service.description}
                    index={index}
                />
            ))}
        </div>
    );
};
