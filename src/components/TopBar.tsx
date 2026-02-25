"use client";

import { SystemMonitor } from "@/components/SystemMonitor";
import { NPMIntegration } from "@/components/NPMIntegration";

export const TopBar = () => {
    return (
        <header className="sticky top-0 z-40">
            <div className="glass border-b border-white/[0.06] border-t-0 border-l-0 border-r-0 rounded-none">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    {/* Left: Branding */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="3" width="20" height="14" rx="2" />
                                <line x1="8" y1="21" x2="16" y2="21" />
                                <line x1="12" y1="17" x2="12" y2="21" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-[14px] font-bold text-white/90 leading-none">Home Lab OS</h1>
                            <p className="text-[10px] text-white/30 font-medium mt-0.5">Control Center</p>
                        </div>
                    </div>

                    {/* Center: Search Trigger */}
                    <button
                        onClick={() => {
                            const event = new KeyboardEvent("keydown", { key: "k", ctrlKey: true, bubbles: true });
                            window.dispatchEvent(event);
                        }}
                        className="hidden sm:flex items-center gap-3 px-4 py-2 glass rounded-xl hover:bg-white/[0.06] transition-all duration-300 cursor-pointer group"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/25">
                            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                        </svg>
                        <span className="text-[12px] text-white/25 font-medium">Search...</span>
                        <kbd className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/[0.04] rounded text-[10px] text-white/20 font-mono border border-white/[0.06]">
                            ⌘K
                        </kbd>
                    </button>

                    {/* Right: Stats */}
                    <div className="flex items-center gap-3">
                        <NPMIntegration />
                        <SystemMonitor />
                    </div>
                </div>
            </div>
        </header>
    );
};
