import { NextResponse } from "next/server";
import { fetchNPMStats, isNPMConfigured } from "@/lib/npm-client";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        if (isNPMConfigured()) {
            const stats = await fetchNPMStats();
            return NextResponse.json(stats);
        }

        // Fallback mock data if NPM is not configured
        return NextResponse.json({
            activeHosts: 0,
            expiringCerts: 0,
        });
    } catch (error) {
        console.error("NPM stats error:", error);
        return NextResponse.json({
            activeHosts: 0,
            expiringCerts: 0,
        });
    }
}
