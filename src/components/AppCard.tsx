"use client";

import { Card, CardBody, CardFooter, Chip, Image } from "@nextui-org/react";
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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
        >
            <Card
                isPressable
                as="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                shadow="sm"
                className="bg-background/60 backdrop-blur-xl backdrop-saturate-150 border border-divider hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
                <CardBody className="flex flex-col items-center gap-4 pt-8 pb-4 px-6 overflow-visible">
                    {/* Status Chip */}
                    <div className="absolute top-3 right-3">
                        <Chip
                            size="sm"
                            variant="dot"
                            color={status === "up" ? "success" : status === "down" ? "danger" : "warning"}
                            classNames={{
                                base: "border-none p-0 h-auto",
                                dot: `w-2 h-2 ${status === "up" ? "animate-pulse" : ""}`,
                                content: "hidden",
                            }}
                        />
                    </div>

                    {/* Icon */}
                    <div className="p-4 rounded-2xl bg-default-100">
                        <img
                            src={`https://cdn.simpleicons.org/${icon}`}
                            className="w-10 h-10"
                            alt={name}
                        />
                    </div>

                    {/* Name */}
                    <div className="text-center space-y-1">
                        <h3 className="font-semibold text-sm text-foreground">{name}</h3>
                        {description && (
                            <p className="text-tiny text-default-400">{description}</p>
                        )}
                    </div>
                </CardBody>

                <CardFooter className="justify-center pt-0 pb-4">
                    <Chip
                        size="sm"
                        variant="flat"
                        color="default"
                        startContent={<ExternalLink size={10} />}
                        classNames={{
                            base: "bg-default-50",
                            content: "text-tiny text-default-400 font-mono",
                        }}
                    >
                        {hostname}
                    </Chip>
                </CardFooter>
            </Card>
        </motion.div>
    );
};
