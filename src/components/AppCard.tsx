"use client";

import { Card, CardBody, CardFooter, Chip, Image } from "@nextui-org/react";
import { ExternalLink, Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EditIconModal } from "./EditIconModal";
import { useDisclosure } from "@nextui-org/react";

interface AppCardProps {
    name: string;
    url: string;
    icon: string;
    customIcon?: string;
    description?: string;
    index?: number;
    onIconUpdated?: () => void;
}

export const AppCard = ({ name, url, icon, customIcon, description, index = 0, onIconUpdated }: AppCardProps) => {
    const [status, setStatus] = useState<"up" | "down" | "checking">("checking");
    const [imgError, setImgError] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
            className="group relative"
        >
            <Card
                isPressable
                as="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                shadow="sm"
                className="bg-background/60 backdrop-blur-xl backdrop-saturate-150 border border-divider hover:shadow-lg hover:scale-[1.02] transition-all duration-300 w-full"
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
                    <div className="p-4 rounded-2xl bg-default-100 flex items-center justify-center">
                        <img
                            src={
                                customIcon ||
                                (!imgError && icon !== "globe"
                                    ? `https://cdn.simpleicons.org/${icon}`
                                    : `https://icon.horse/icon/${hostname}`)
                            }
                            className={customIcon || imgError || icon === "globe" ? "w-10 h-10 object-contain rounded-lg" : "w-10 h-10"}
                            alt={name}
                            onError={(e) => {
                                if (!customIcon) setImgError(true);
                            }}
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

            {/* Edit Icon Button (Visible on Hover) */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        onOpen();
                    }}
                    className="p-1.5 rounded-full bg-background/80 backdrop-blur-md border border-divider text-default-500 hover:text-foreground hover:bg-default-200 transition-colors shadow-sm"
                    aria-label="Edit Icon"
                >
                    <Pencil size={14} />
                </button>
            </div>

            <EditIconModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                hostname={hostname}
                currentIconUrl={customIcon}
                onSaveSuccess={() => {
                    if (onIconUpdated) onIconUpdated();
                }}
            />
        </motion.div>
    );
};
