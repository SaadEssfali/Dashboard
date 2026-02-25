"use client";

import { useState, useEffect } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    useDisclosure,
    Chip,
} from "@nextui-org/react";
import { Settings, Check, X, Loader2 } from "lucide-react";

export const SettingsModal = ({ onSaveSuccess, showLargeButton = false }: { onSaveSuccess?: () => void, showLargeButton?: boolean }) => {
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
    const [url, setUrl] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");
    const [isConfigured, setIsConfigured] = useState(false);

    // Fetch current config without password
    const loadConfig = async () => {
        try {
            const res = await fetch("/api/settings");
            if (res.ok) {
                const data = await res.json();
                setUrl(data.url || "");
                setEmail(data.email || "");
                setIsConfigured(data.configured);
            }
        } catch (e) {
            console.error("Failed to load settings", e);
        }
    };

    useEffect(() => {
        if (isOpen) {
            loadConfig();
            setStatus("idle");
            setErrorMsg("");
            setPassword(""); // Don't pre-fill password for security
        }
    }, [isOpen]);

    const testAndSave = async () => {
        setIsLoading(true);
        setStatus("idle");
        setErrorMsg("");

        try {
            // Send config to backend (which tests the connection and saves it)
            const saveRes = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url, email, password }),
            });

            if (!saveRes.ok) {
                const errorData = await saveRes.json();
                throw new Error(errorData.error || "Failed to save configuration");
            }

            setStatus("success");
            setIsConfigured(true);

            // Give visual feedback for a second before closing
            setTimeout(() => {
                onClose();
                if (onSaveSuccess) onSaveSuccess();
            }, 1000);
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message || "Unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {showLargeButton ? (
                <Button color="primary" onPress={onOpen} className="mt-4 font-medium" startContent={<Settings size={18} />}>
                    Connect to Nginx Proxy Manager
                </Button>
            ) : (
                <Button
                    isIconOnly
                    variant="light"
                    size="sm"
                    radius="full"
                    onPress={onOpen}
                    aria-label="Settings"
                    className="text-default-500"
                >
                    <Settings size={18} />
                </Button>
            )}

            <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" classNames={{
                base: "bg-background/80 backdrop-blur-xl backdrop-saturate-150 border border-divider shadow-2xl",
            }}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">
                                <div className="flex items-center gap-2">
                                    <span>Nginx Proxy Manager Connection</span>
                                    {isConfigured && <Chip size="sm" color="success" variant="flat">Configured</Chip>}
                                </div>
                                <p className="text-tiny text-default-400 font-normal">
                                    Connect your dashboard directly to NPM to auto-discover services.
                                </p>
                            </ModalHeader>
                            <ModalBody>
                                <Input
                                    autoFocus
                                    label="API URL"
                                    placeholder="e.g. http://192.168.1.100:81"
                                    variant="bordered"
                                    value={url}
                                    onValueChange={setUrl}
                                    description="Your NPM dashboard URL (usually port 81)"
                                />
                                <Input
                                    label="Admin Email"
                                    placeholder="admin@example.com"
                                    variant="bordered"
                                    type="email"
                                    value={email}
                                    onValueChange={setEmail}
                                />
                                <Input
                                    label="Password"
                                    placeholder="Enter your NPM password"
                                    variant="bordered"
                                    type="password"
                                    value={password}
                                    onValueChange={setPassword}
                                    description="Password is saved locally in src/config/npm.json"
                                />

                                {status === "error" && (
                                    <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 p-3 rounded-lg mt-2 border border-danger/20">
                                        <X size={16} />
                                        <span>{errorMsg}</span>
                                    </div>
                                )}
                                {status === "success" && (
                                    <div className="flex items-center gap-2 text-success text-sm bg-success/10 p-3 rounded-lg mt-2 border border-success/20">
                                        <Check size={16} />
                                        <span>Connected and saved successfully!</span>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button
                                    color="primary"
                                    onPress={testAndSave}
                                    isLoading={isLoading}
                                    isDisabled={!url || !email || !password}
                                    startContent={!isLoading && <Check size={16} />}
                                >
                                    Save & Connect
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};
