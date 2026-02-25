"use client";

import { useEffect, useState, useRef } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Input,
    Kbd,
    Listbox,
    ListboxItem,
} from "@nextui-org/react";
import { Search, ArrowUpRight } from "lucide-react";

interface ServiceItem {
    name: string;
    url: string;
    icon: string;
    customIcon?: string;
    description?: string;
}

export const SpotlightSearch = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [services, setServices] = useState<ServiceItem[]>([]);

    // Fetch services dynamically
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await fetch("/api/services", { cache: "no-store" });
                const data = await res.json();
                setServices(data.services || []);
            } catch (err) {
                console.error("Failed to fetch services for search:", err);
            }
        };
        fetchServices();
        const interval = setInterval(fetchServices, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(true);
                setQuery("");
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    const filteredServices = services.filter(
        (s) =>
            s.name.toLowerCase().includes(query.toLowerCase()) ||
            (s.description && s.description.toLowerCase().includes(query.toLowerCase()))
    );

    return (
        <Modal
            isOpen={isOpen}
            onOpenChange={setIsOpen}
            placement="top"
            backdrop="blur"
            hideCloseButton
            size="lg"
            classNames={{
                base: "bg-background/80 backdrop-blur-xl backdrop-saturate-150 border border-divider shadow-2xl",
                body: "p-0",
                header: "p-0",
                footer: "p-0",
            }}
        >
            <ModalContent>
                <ModalHeader className="flex-col p-0">
                    <Input
                        autoFocus
                        placeholder="Search applications..."
                        startContent={<Search size={18} className="text-default-300" />}
                        endContent={<Kbd className="hidden sm:inline-block">ESC</Kbd>}
                        value={query}
                        onValueChange={setQuery}
                        variant="flat"
                        size="lg"
                        radius="none"
                        classNames={{
                            inputWrapper: "bg-transparent shadow-none rounded-none border-b border-divider h-14",
                            input: "text-base",
                        }}
                    />
                </ModalHeader>

                <ModalBody>
                    {filteredServices.length > 0 ? (
                        <Listbox
                            aria-label="Search results"
                            variant="flat"
                            className="p-2 max-h-[300px] overflow-y-auto"
                        >
                            {filteredServices.map((service) => (
                                <ListboxItem
                                    key={`${service.name}-${service.url}`}
                                    href={service.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    startContent={
                                        <div className="p-2 rounded-xl bg-default-100 flex items-center justify-center">
                                            <img
                                                src={
                                                    service.customIcon ||
                                                    (service.icon !== "globe"
                                                        ? `https://cdn.simpleicons.org/${service.icon}`
                                                        : `https://icon.horse/icon/${new URL(service.url).hostname}`)
                                                }
                                                className={service.customIcon || service.icon === "globe" ? "w-5 h-5 object-contain rounded-sm" : "w-5 h-5"}
                                                alt={service.name}
                                            />
                                        </div>
                                    }
                                    endContent={
                                        <ArrowUpRight size={14} className="text-default-300" />
                                    }
                                    description={service.description || ""}
                                    classNames={{
                                        base: "py-3 gap-3 rounded-xl data-[hover=true]:bg-default-100",
                                        title: "font-medium text-sm",
                                        description: "text-tiny",
                                    }}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {service.name}
                                </ListboxItem>
                            ))}
                        </Listbox>
                    ) : query ? (
                        <div className="p-8 text-center">
                            <p className="text-sm text-default-400">No applications found</p>
                            <p className="text-tiny text-default-300 mt-1">Try a different search term</p>
                        </div>
                    ) : null}
                </ModalBody>

                <ModalFooter>
                    <div className="flex items-center gap-4 w-full px-4 py-2.5 border-t border-divider">
                        <div className="flex items-center gap-1.5 text-tiny text-default-300">
                            <Kbd keys={["up"]} className="text-[10px]" />
                            <Kbd keys={["down"]} className="text-[10px]" />
                            <span>Navigate</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-tiny text-default-300">
                            <Kbd keys={["enter"]} className="text-[10px]" />
                            <span>Open</span>
                        </div>
                    </div>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};
