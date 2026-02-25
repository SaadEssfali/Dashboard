import { NextResponse } from "next/server";
import { fetchNPMHosts, isNPMConfigured, ServiceItem } from "@/lib/npm-client";
import staticConfig from "@/config/services.json";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
    try {
        let services: ServiceItem[] = [];

        if (isNPMConfigured()) {
            // Fetch live data from NPM
            try {
                services = await fetchNPMHosts();
            } catch (npmError) {
                console.error("NPM fetch failed, falling back to static config:", npmError);
                // Fallback to static
                services = staticConfig.services.map((s) => ({
                    ...s,
                    source: "static" as const,
                }));
            }
        } else {
            // No NPM configured — use static config
            services = staticConfig.services.map((s) => ({
                ...s,
                source: "static" as const,
            }));
        }

        return NextResponse.json({
            services,
            configured: isNPMConfigured()
        });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch services", services: [] },
            { status: 500 }
        );
    }
}
