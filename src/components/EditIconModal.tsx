"use client";

import { useState, useEffect, useCallback, Key } from "react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Input,
    useDisclosure,
    Autocomplete,
    AutocompleteItem,
    Divider,
} from "@nextui-org/react";
import { Image as ImageIcon, Check, X, Search } from "lucide-react";
import debounce from "lodash.debounce";

interface EditIconModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    hostname: string;
    currentIconUrl?: string;
    onSaveSuccess: () => void;
}

interface IconItem {
    name: string;
    url: string;
}

export const EditIconModal = ({
    isOpen,
    onOpenChange,
    hostname,
    currentIconUrl = "",
    onSaveSuccess,
}: EditIconModalProps) => {
    const [iconUrl, setIconUrl] = useState(currentIconUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
    const [errorMsg, setErrorMsg] = useState("");

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<IconItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Initial search load (to populate empty list)
    useEffect(() => {
        if (isOpen) {
            setIconUrl(currentIconUrl);
            setStatus("idle");
            setErrorMsg("");
            setSearchQuery("");
            fetchSearchResults(""); // Load top 100 initially
        }
    }, [isOpen, currentIconUrl]);

    const fetchSearchResults = async (query: string) => {
        setIsSearching(true);
        try {
            const res = await fetch(`/api/icons/search?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.icons || []);
            }
        } catch (e) {
            console.error("Search failed", e);
        } finally {
            setIsSearching(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const debouncedSearch = useCallback(
        debounce((query: string) => fetchSearchResults(query), 300),
        []
    );

    const handleSearchChange = (val: string) => {
        setSearchQuery(val);
        debouncedSearch(val);
    };

    const handleSave = async (onClose: () => void) => {
        setIsLoading(true);
        setStatus("idle");

        try {
            const res = await fetch("/api/icons", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ hostname, iconUrl }),
            });

            if (!res.ok) throw new Error("Failed to save icon");

            setStatus("success");
            setTimeout(() => {
                onClose();
                onSaveSuccess();
            }, 500);
        } catch (err: any) {
            setStatus("error");
            setErrorMsg(err.message || "Unknown error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur" size="md" classNames={{
            base: "bg-background/80 backdrop-blur-xl backdrop-saturate-150 border border-divider shadow-2xl overflow-visible",
        }}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            <span>Custom Icon: {hostname}</span>
                            <p className="text-tiny text-default-400 font-normal">
                                Search selfh.st/icons or paste an image URL. Leave blank to reset.
                            </p>
                        </ModalHeader>
                        <ModalBody className="overflow-visible">
                            <Autocomplete
                                label="Search selfh.st Icons"
                                placeholder="E.g. plex, portainer, nextcloud..."
                                variant="bordered"
                                inputValue={searchQuery}
                                onInputChange={handleSearchChange}
                                isLoading={isSearching}
                                items={searchResults}
                                startContent={<Search size={16} className="text-default-400" />}
                                onSelectionChange={(key: Key | null) => {
                                    if (key) setIconUrl(key.toString());
                                }}
                                classNames={{
                                    listboxWrapper: "max-h-[250px]",
                                }}
                            >
                                {(item) => (
                                    <AutocompleteItem
                                        key={item.url}
                                        textValue={item.name}
                                        startContent={
                                            <div className="w-6 h-6 rounded-md bg-default-100 flex items-center justify-center p-1 border border-divider">
                                                <img src={item.url} alt={item.name} className="w-full h-full object-contain" />
                                            </div>
                                        }
                                        className="gap-3"
                                    >
                                        <span className="capitalize">{item.name.replace(/-/g, " ")}</span>
                                    </AutocompleteItem>
                                )}
                            </Autocomplete>

                            <div className="flex items-center gap-2 py-2">
                                <Divider className="flex-1" />
                                <span className="text-tiny text-default-400 uppercase tracking-wider font-semibold">Or</span>
                                <Divider className="flex-1" />
                            </div>

                            <Input
                                label="Image URL"
                                placeholder="https://example.com/icon.png"
                                variant="bordered"
                                value={iconUrl}
                                onValueChange={setIconUrl}
                                startContent={<ImageIcon size={18} className="text-default-400" />}
                                isClearable
                            />

                            {/* Preview */}
                            {iconUrl && (
                                <div className="mt-2 flex flex-col items-center gap-2">
                                    <span className="text-tiny text-default-400">Preview:</span>
                                    <div className="w-16 h-16 rounded-2xl bg-default-100 flex items-center justify-center overflow-hidden border border-divider p-2">
                                        <img
                                            src={iconUrl}
                                            alt="Preview"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'none';
                                                setErrorMsg("Image failed to load");
                                                setStatus("error");
                                            }}
                                            onLoad={(e) => {
                                                (e.target as HTMLImageElement).style.display = 'block';
                                                if (status === "error") setStatus("idle");
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {status === "error" && (
                                <div className="flex items-center gap-2 text-danger text-sm bg-danger/10 p-3 rounded-lg mt-2 border border-danger/20">
                                    <X size={16} />
                                    <span>{errorMsg}</span>
                                </div>
                            )}
                            {status === "success" && (
                                <div className="flex items-center gap-2 text-success text-sm bg-success/10 p-3 rounded-lg mt-2 border border-success/20">
                                    <Check size={16} />
                                    <span>Saved successfully!</span>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Cancel
                            </Button>
                            <Button
                                color="primary"
                                onPress={() => handleSave(onClose)}
                                isLoading={isLoading}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};
